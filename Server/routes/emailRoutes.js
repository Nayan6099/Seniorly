const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const EmailSubscription = require('../models/EmailSubscription');
const CourseNotification = require('../models/CourseNotification');
const { sendConfirmationEmail, sendWelcomeEmail } = require('../utils/emailService');

const router = express.Router();

// Rate limiting for email subscriptions
const subscriptionLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 subscription requests per windowMs
  message: 'Too many subscription requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateEmailSubscription = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('subscriptionType')
    .optional()
    .isIn(['newsletter', 'course_notifications', 'marketing', 'all'])
    .withMessage('Invalid subscription type'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('source')
    .optional()
    .isIn(['website', 'popup', 'course_page', 'checkout', 'referral', 'social', 'other'])
    .withMessage('Invalid source')
];

// @desc    Subscribe to newsletter/email list
// @route   POST /api/emails/subscribe
// @access  Public
router.post('/subscribe', subscriptionLimit, validateEmailSubscription, async (req, res) => {
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
      subscriptionType = 'newsletter',
      interests = [],
      source = 'website',
      referralSource,
      preferences = {}
    } = req.body;

    // Check if email already exists
    const existingSubscription = await EmailSubscription.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscription.status = 'active';
        existingSubscription.subscriptionType = subscriptionType;
        existingSubscription.interests = interests;
        existingSubscription.preferences = { ...existingSubscription.preferences, ...preferences };
        existingSubscription.unsubscribeReason = undefined;
        existingSubscription.unsubscribeDate = undefined;
        
        await existingSubscription.save();
        
        res.status(200).json({
          success: true,
          message: 'Subscription reactivated successfully',
          data: {
            email: existingSubscription.email,
            subscriptionType: existingSubscription.subscriptionType
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Email already subscribed'
        });
      }
      return;
    }

    // Create new subscription
    const subscription = new EmailSubscription({
      email,
      firstName,
      lastName,
      subscriptionType,
      interests,
      source,
      referralSource,
      preferences,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Generate confirmation token
    const confirmationToken = subscription.generateConfirmationToken();
    await subscription.save();

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, confirmationToken, {
        firstName: firstName || email.split('@')[0],
        subscriptionType
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Subscription successful! Please check your email to confirm.',
      data: {
        email: subscription.email,
        subscriptionType: subscription.subscriptionType,
        needsConfirmation: !subscription.isConfirmed
      }
    });

  } catch (error) {
    console.error('Email subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process subscription'
    });
  }
});

// @desc    Confirm email subscription
// @route   GET /api/emails/confirm/:token
// @access  Public
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token to match stored version
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const subscription = await EmailSubscription.findOne({
      confirmationToken: hashedToken,
      isConfirmed: false
    });
    
    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired confirmation token'
      });
    }
    
    subscription.confirmSubscription();
    await subscription.save();
    
    // Send welcome email
    try {
      await sendWelcomeEmail(subscription.email, {
        firstName: subscription.firstName || subscription.email.split('@')[0],
        subscriptionType: subscription.subscriptionType
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Email confirmed successfully! Welcome to our community.',
      data: {
        email: subscription.email,
        confirmedAt: subscription.confirmedAt
      }
    });
    
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm email'
    });
  }
});

// @desc    Unsubscribe from emails
// @route   POST /api/emails/unsubscribe
// @access  Public
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token, reason } = req.body;
    
    let subscription;
    
    if (token) {
      subscription = await EmailSubscription.findOne({
        unsubscribeToken: token
      });
    } else if (email) {
      subscription = await EmailSubscription.findOne({ email });
    }
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    subscription.unsubscribe(reason);
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from emails',
      data: {
        email: subscription.email,
        unsubscribeDate: subscription.unsubscribeDate
      }
    });
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
});

// @desc    Subscribe to course notifications
// @route   POST /api/emails/course-notifications
// @access  Public
router.post('/course-notifications', subscriptionLimit, async (req, res) => {
  try {
    const {
      email,
      courseId,
      firstName,
      lastName,
      phone,
      notificationType = 'launch',
      preferences = {}
    } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if notification already exists
    const existingNotification = await CourseNotification.findOne({
      email: email.toLowerCase(),
      course: courseId
    });

    if (existingNotification) {
      if (existingNotification.status === 'unsubscribed') {
        existingNotification.status = 'active';
        existingNotification.preferences = { ...existingNotification.preferences, ...preferences };
        await existingNotification.save();
        
        return res.status(200).json({
          success: true,
          message: 'Course notification reactivated successfully'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Already subscribed to notifications for this course'
        });
      }
    }

    // Create new course notification
    const notification = new CourseNotification({
      email: email.toLowerCase(),
      course: courseId,
      notificationType,
      firstName,
      lastName,
      phone,
      preferences: {
        emailNotification: true,
        smsNotification: !!phone,
        ...preferences
      },
      metadata: {
        source: req.body.source || 'course_page',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referralSource: req.body.referralSource,
        utmSource: req.body.utm_source,
        utmMedium: req.body.utm_medium,
        utmCampaign: req.body.utm_campaign
      }
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to course notifications!',
      data: {
        email: notification.email,
        courseId: notification.course,
        notificationType: notification.notificationType
      }
    });

  } catch (error) {
    console.error('Course notification subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to course notifications'
    });
  }
});

// @desc    Get subscription status
// @route   GET /api/emails/status/:email
// @access  Public
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscription = await EmailSubscription.findOne({ 
      email: email.toLowerCase() 
    });
    
    const courseNotifications = await CourseNotification.find({ 
      email: email.toLowerCase() 
    }).populate('course', 'title status');
    
    res.status(200).json({
      success: true,
      data: {
        subscription: subscription ? {
          email: subscription.email,
          subscriptionType: subscription.subscriptionType,
          status: subscription.status,
          isConfirmed: subscription.isConfirmed,
          interests: subscription.interests,
          createdAt: subscription.createdAt
        } : null,
        courseNotifications: courseNotifications.map(notification => ({
          courseId: notification.course._id,
          courseTitle: notification.course.title,
          courseStatus: notification.course.status,
          notificationType: notification.notificationType,
          status: notification.status,
          createdAt: notification.createdAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
});

// @desc    Update subscription preferences
// @route   PUT /api/emails/preferences
// @access  Public
router.put('/preferences', async (req, res) => {
  try {
    const { email, preferences, interests, subscriptionType } = req.body;
    
    const subscription = await EmailSubscription.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    if (preferences) {
      subscription.preferences = { ...subscription.preferences, ...preferences };
    }
    
    if (interests) {
      subscription.interests = interests;
    }
    
    if (subscriptionType) {
      subscription.subscriptionType = subscriptionType;
    }
    
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        email: subscription.email,
        preferences: subscription.preferences,
        interests: subscription.interests,
        subscriptionType: subscription.subscriptionType
      }
    });
    
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// @desc    Get email subscription statistics (Admin only)
// @route   GET /api/emails/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const subscriptionStats = await EmailSubscription.getSubscriptionStats();
    const notificationStats = await CourseNotification.getNotificationStats();
    const conversionRate = await CourseNotification.getConversionRate();
    
    res.status(200).json({
      success: true,
      data: {
        subscriptions: subscriptionStats,
        courseNotifications: notificationStats,
        conversion: conversionRate,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Get email stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email statistics'
    });
  }
});

// @desc    Track email open
// @route   GET /api/emails/track/open/:trackingId
// @access  Public
router.get('/track/open/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    // Decode tracking ID to get email and notification info
    const decoded = Buffer.from(trackingId, 'base64').toString('utf8');
    const [email, notificationId] = decoded.split('|');
    
    // Track the open
    const subscription = await EmailSubscription.findOne({ email });
    if (subscription) {
      subscription.trackEmailOpened();
      await subscription.save();
    }
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'
    );
    
    res.set({
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    
    res.send(pixel);
    
  } catch (error) {
    console.error('Track email open error:', error);
    // Still return pixel even if tracking fails
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'
    );
    res.set('Content-Type', 'image/gif');
    res.send(pixel);
  }
});

// @desc    Track email click
// @route   GET /api/emails/track/click/:trackingId
// @access  Public
router.get('/track/click/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { url } = req.query;
    
    // Decode tracking ID
    const decoded = Buffer.from(trackingId, 'base64').toString('utf8');
    const [email, notificationId] = decoded.split('|');
    
    // Track the click
    const subscription = await EmailSubscription.findOne({ email });
    if (subscription) {
      subscription.trackLinkClicked();
      await subscription.save();
    }
    
    // Redirect to the original URL
    res.redirect(url || process.env.CLIENT_URL || 'http://localhost:3000');
    
  } catch (error) {
    console.error('Track email click error:', error);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
});

// @desc    Bulk unsubscribe (Admin only)
// @route   POST /api/emails/bulk-unsubscribe
// @access  Private/Admin
router.post('/bulk-unsubscribe', async (req, res) => {
  try {
    const { emails, reason = 'Bulk unsubscribe' } = req.body;
    
    if (!Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: 'Emails must be an array'
      });
    }
    
    const result = await EmailSubscription.updateMany(
      { email: { $in: emails.map(email => email.toLowerCase()) } },
      {
        status: 'unsubscribed',
        unsubscribeDate: new Date(),
        unsubscribeReason: reason
      }
    );
    
    res.status(200).json({
      success: true,
      message: `Successfully unsubscribed ${result.modifiedCount} emails`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });
    
  } catch (error) {
    console.error('Bulk unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk unsubscribe'
    });
  }
});

module.exports = router;