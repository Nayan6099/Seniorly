const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Enrollment must belong to a student']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Enrollment must belong to a course']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'suspended'],
    default: 'active'
  },
  progress: {
    completedLectures: [{
      lectureId: String,
      completedAt: {
        type: Date,
        default: Date.now
      },
      timeSpent: Number // in minutes
    }],
    currentLecture: String,
    percentageCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  },
  payment: {
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'free', 'coupon']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed'
    },
    paymentDate: Date,
    refundDate: Date,
    refundReason: String
  },
  coupon: {
    code: String,
    discountAmount: Number,
    discountPercentage: Number
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedDate: Date,
    certificateId: String,
    downloadUrl: String
  },
  notes: [{
    lecture: String,
    content: String,
    timestamp: Number, // timestamp in video
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    lecture: String,
    timestamp: Number,
    title: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  quiz: [{
    quizId: String,
    score: Number,
    maxScore: Number,
    attempts: Number,
    passed: Boolean,
    completedAt: Date
  }],
  assignments: [{
    assignmentId: String,
    submissionUrl: String,
    submittedAt: Date,
    grade: String,
    feedback: String,
    gradedAt: Date
  }],
  discussions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Discussion'
  }],
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewDate: Date
  },
  completionDate: Date,
  certificateEligible: {
    type: Boolean,
    default: false
  },
  accessExpiryDate: Date, // for timed access courses
  remindersSent: {
    type: Number,
    default: 0
  },
  lastReminderDate: Date,
  source: {
    type: String,
    enum: ['direct', 'referral', 'social', 'search', 'email', 'advertisement'],
    default: 'direct'
  },
  referralCode: String,
  deviceInfo: {
    lastDevice: String,
    lastPlatform: String,
    lastBrowser: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Other indexes for performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ 'progress.lastAccessed': -1 });

// Virtual for days since enrollment
enrollmentSchema.virtual('daysSinceEnrollment').get(function() {
  return Math.floor((Date.now() - this.enrollmentDate) / (1000 * 60 * 60 * 24));
});

// Virtual for completion percentage
enrollmentSchema.virtual('completionPercentage').get(function() {
  return this.progress.percentageCompleted;
});

// Pre-save middleware to update progress
enrollmentSchema.pre('save', async function(next) {
  if (this.isModified('progress.completedLectures')) {
    // Fetch course to get total lectures
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);
    
    if (course) {
      const totalLectures = course.curriculum.reduce((total, section) => {
        return total + section.lectures.length;
      }, 0);
      
      const completedCount = this.progress.completedLectures.length;
      this.progress.percentageCompleted = Math.round((completedCount / totalLectures) * 100);
      
      // Check if course is completed
      if (this.progress.percentageCompleted >= 95 && this.status === 'active') {
        this.status = 'completed';
        this.completionDate = new Date();
        this.certificateEligible = course.certificateOffered;
      }
    }
  }
  next();
});

// Post-save middleware to update course enrollment count
enrollmentSchema.post('save', async function() {
  if (this.isNew) {
    const Course = mongoose.model('Course');
    await Course.findByIdAndUpdate(this.course, {
      $inc: { enrollmentCount: 1 }
    });
  }
});

// Post-remove middleware to decrease course enrollment count
enrollmentSchema.post('remove', async function() {
  const Course = mongoose.model('Course');
  await Course.findByIdAndUpdate(this.course, {
    $inc: { enrollmentCount: -1 }
  });
});

// Static method to get enrollment statistics
enrollmentSchema.statics.getEnrollmentStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalEnrollments = await this.countDocuments();
  const avgCompletion = await this.aggregate([
    {
      $group: {
        _id: null,
        avgCompletion: { $avg: '$progress.percentageCompleted' }
      }
    }
  ]);
  
  return {
    total: totalEnrollments,
    byStatus: stats,
    averageCompletion: avgCompletion[0]?.avgCompletion || 0
  };
};

// Instance method to calculate time to completion
enrollmentSchema.methods.getTimeToCompletion = function() {
  if (this.completionDate) {
    return Math.floor((this.completionDate - this.enrollmentDate) / (1000 * 60 * 60 * 24));
  }
  return null;
};

// Instance method to get learning streak
enrollmentSchema.methods.getLearningStreak = function() {
  // Calculate consecutive days of activity
  const completedLectures = this.progress.completedLectures
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const lecture of completedLectures) {
    const lectureDate = new Date(lecture.completedAt);
    lectureDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - lectureDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = new Date(lectureDate);
    } else if (daysDiff === streak + 1) {
      streak++;
      currentDate = new Date(lectureDate);
    } else {
      break;
    }
  }
  
  return streak;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);