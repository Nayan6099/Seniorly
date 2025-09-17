const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const CourseNotification = require('../models/CourseNotification');
const { auth, authorize } = require('../middleware/auth');
const { sendEnrollmentConfirmation, sendCertificate } = require('../utils/emailService');

const router = express.Router();

// Rate limiting for enrollments
const enrollmentLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 enrollment requests per windowMs
  message: 'Too many enrollment requests, please try again later.',
});

// Validation middleware
const validateEnrollment = [
  body('courseId')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),
  body('paymentMethod')
    .optional()
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'free', 'coupon'])
    .withMessage('Invalid payment method'),
  body('couponCode')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Coupon code must be between 1 and 50 characters')
];

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll
// @access  Public
router.post('/enroll', enrollmentLimit, validateEnrollment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email,
      firstName,
      lastName,
      phone,
      courseId,
      paymentMethod = 'free',
      transactionId,
      amount,
      couponCode,
      source = 'direct',
      referralCode
    } = req.body;

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        password: Math.random().toString(36).slice(-8), // Temporary password
        role: 'student'
      });
      await user.save();
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is available for enrollment
    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }

    // Check enrollment limits
    if (course.maxEnrollment && course.enrollmentCount >= course.maxEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Course enrollment is full'
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
        data: {
          enrollmentId: existingEnrollment._id,
          status: existingEnrollment.status
        }
      });
    }

    // Calculate final amount (apply coupon if provided)
    let finalAmount = course.isFree ? 0 : course.price.current;
    let appliedCoupon = null;

    if (couponCode && !course.isFree) {
      // TODO: Implement coupon validation logic
      // For now, we'll just store the coupon code
      appliedCoupon = { code: couponCode };
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: user._id,
      course: courseId,
      status: 'active',
      payment: {
        transactionId,
        amount: finalAmount,
        method: paymentMethod,
        status: finalAmount === 0 ? 'completed' : 'pending',
        paymentDate: finalAmount === 0 ? new Date() : undefined
      },
      coupon: appliedCoupon,
      source,
      referralCode
    });

    await enrollment.save();

    // Update course notification status if exists
    await CourseNotification.findOneAndUpdate(
      { email: email.toLowerCase(), course: courseId },
      { 
        status: 'enrolled',
        enrollmentDate: new Date(),
        conversionValue: finalAmount
      }
    );

    // Populate enrollment data for response
    await enrollment.populate([
      { path: 'student', select: 'firstName lastName email' },
      { path: 'course', select: 'title instructor duration price' }
    ]);

    // Send enrollment confirmation email
    try {
      await sendEnrollmentConfirmation(user.email, {
        firstName: user.firstName,
        courseName: course.title,
        enrollmentId: enrollment._id,
        amount: finalAmount,
        accessUrl: `${process.env.CLIENT_URL}/courses/${course._id}`
      });
    } catch (emailError) {
      console.error('Failed to send enrollment confirmation:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course!',
      data: {
        enrollmentId: enrollment._id,
        student: enrollment.student,
        course: enrollment.course,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
        amount: finalAmount,
        accessUrl: `${process.env.CLIENT_URL}/courses/${course._id}`
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process enrollment'
    });
  }
});

// @desc    Get user enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = { student: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title description instructor image duration rating status',
        match: search ? { 
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        } : {},
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar'
        }
      })
      .sort({ enrollmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter out enrollments where course didn't match search
    const filteredEnrollments = enrollments.filter(enrollment => enrollment.course);

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        enrollments: filteredEnrollments.map(enrollment => ({
          _id: enrollment._id,
          course: enrollment.course,
          enrollmentDate: enrollment.enrollmentDate,
          status: enrollment.status,
          progress: enrollment.progress,
          lastAccessed: enrollment.progress.lastAccessed,
          certificate: enrollment.certificate
        })),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollments'
    });
  }
});

// @desc    Get enrollment details
// @route   GET /api/enrollments/:enrollmentId
// @access  Private
router.get('/:enrollmentId', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    }).populate([
      {
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar bio'
        }
      },
      { path: 'student', select: 'firstName lastName email' }
    ]);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });

  } catch (error) {
    console.error('Get enrollment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollment details'
    });
  }
});

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:enrollmentId/progress
// @access  Private
router.put('/:enrollmentId/progress', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lectureId, timeSpent, currentLecture } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if lecture is already completed
    const existingLecture = enrollment.progress.completedLectures.find(
      lecture => lecture.lectureId === lectureId
    );

    if (!existingLecture) {
      // Add to completed lectures
      enrollment.progress.completedLectures.push({
        lectureId,
        completedAt: new Date(),
        timeSpent: timeSpent || 0
      });
    } else {
      // Update time spent
      existingLecture.timeSpent = (existingLecture.timeSpent || 0) + (timeSpent || 0);
    }

    // Update current lecture and last accessed
    if (currentLecture) {
      enrollment.progress.currentLecture = currentLecture;
    }
    enrollment.progress.lastAccessed = new Date();
    enrollment.progress.totalTimeSpent = (enrollment.progress.totalTimeSpent || 0) + (timeSpent || 0);

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: enrollment.progress,
        certificateEligible: enrollment.certificateEligible
      }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
});

// @desc    Add note to enrollment
// @route   POST /api/enrollments/:enrollmentId/notes
// @access  Private
router.post('/:enrollmentId/notes', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lecture, content, timestamp } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.notes.push({
      lecture,
      content,
      timestamp: timestamp || 0
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        notes: enrollment.notes
      }
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// @desc    Add bookmark to enrollment
// @route   POST /api/enrollments/:enrollmentId/bookmarks
// @access  Private
router.post('/:enrollmentId/bookmarks', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lecture, timestamp, title } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.bookmarks.push({
      lecture,
      timestamp: timestamp || 0,
      title: title || `Bookmark ${enrollment.bookmarks.length + 1}`
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Bookmark added successfully',
      data: {
        bookmarks: enrollment.bookmarks
      }
    });

  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bookmark'
    });
  }
});

// @desc    Submit course rating and review
// @route   POST /api/enrollments/:enrollmentId/review
// @access  Private
router.post('/:enrollmentId/review', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update enrollment rating
    enrollment.rating = {
      value: rating,
      review,
      reviewDate: new Date()
    };

    await enrollment.save();

    // Update course average rating
    await Course.calculateAverageRating(enrollment.course);

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        rating: enrollment.rating
      }
    });

  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// @desc    Issue certificate
// @route   POST /api/enrollments/:enrollmentId/certificate
// @access  Private
router.post('/:enrollmentId/certificate', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user.id
    }).populate(['course', 'student']);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (!enrollment.certificateEligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible for a certificate yet. Please complete the course first.'
      });
    }

    if (enrollment.certificate.issued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate has already been issued',
        data: {
          certificate: enrollment.certificate
        }
      });
    }

    // Generate certificate
    const certificateId = `CERT-${enrollment.course._id}-${enrollment.student._id}-${Date.now()}`;
    const downloadUrl = `${process.env.CLIENT_URL}/certificates/${certificateId}`;

    enrollment.certificate = {
      issued: true,
      issuedDate: new Date(),
      certificateId,
      downloadUrl
    };

    await enrollment.save();

    // Send certificate email
    try {
      await sendCertificate(enrollment.student.email, {
        firstName: enrollment.student.firstName,
        courseName: enrollment.course.title,
        certificateId,
        downloadUrl
      });
    } catch (emailError) {
      console.error('Failed to send certificate email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Certificate issued successfully',
      data: {
        certificate: enrollment.certificate
      }
    });

  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to issue certificate'
    });
  }
});

// @desc    Get enrollment statistics (Admin only)
// @route   GET /api/enrollments/stats
// @access  Private/Admin
router.get('/admin/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    
    const stats = await Enrollment.getEnrollmentStats();
    
    // Course-specific stats if requested
    let courseStats = null;
    if (courseId) {
      courseStats = await Enrollment.aggregate([
        { $match: { course: mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgCompletion: { $avg: '$progress.percentageCompleted' }
          }
        }
      ]);
    }
    
    res.status(200).json({
      success: true,
      data: {
        overall: stats,
        course: courseStats,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Get enrollment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollment statistics'
    });
  }
});

module.exports = router;