const mongoose = require('mongoose');
const validator = require('validator');

const courseNotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  notificationType: {
    type: String,
    enum: ['launch', 'early_access', 'price_drop', 'enrollment_reminder', 'general_update'],
    required: [true, 'Notification type is required']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || validator.isMobilePhone(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  status: {
    type: String,
    enum: ['active', 'notified', 'enrolled', 'unsubscribed', 'expired'],
    default: 'active'
  },
  preferences: {
    emailNotification: {
      type: Boolean,
      default: true
    },
    smsNotification: {
      type: Boolean,
      default: false
    },
    notifyOnLaunch: {
      type: Boolean,
      default: true
    },
    notifyOnEarlyAccess: {
      type: Boolean,
      default: true
    },
    notifyOnDiscount: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['course_page', 'popup', 'banner', 'email', 'social', 'referral'],
      default: 'course_page'
    },
    ipAddress: String,
    userAgent: String,
    referralSource: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    location: {
      country: String,
      city: String,
      region: String
    }
  },
  notificationHistory: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push']
    },
    subject: String,
    content: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced'],
      default: 'sent'
    },
    opens: [{
      openedAt: Date,
      ipAddress: String,
      userAgent: String
    }],
    clicks: [{
      clickedAt: Date,
      url: String,
      ipAddress: String,
      userAgent: String
    }],
    errorMessage: String
  }],
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  scheduledNotifications: [{
    type: String,
    scheduledFor: Date,
    content: String,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  unsubscribeToken: String,
  unsubscribeReason: String,
  unsubscribeDate: Date,
  enrollmentDate: Date, // When user actually enrolled in the course
  conversionValue: Number, // Value if user purchased after notification
  notes: String,
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate notifications for same email/course
courseNotificationSchema.index({ email: 1, course: 1 }, { unique: true });

// Other indexes for performance
courseNotificationSchema.index({ course: 1 });
courseNotificationSchema.index({ status: 1 });
courseNotificationSchema.index({ notificationType: 1 });
courseNotificationSchema.index({ createdAt: -1 });
courseNotificationSchema.index({ 'preferences.emailNotification': 1 });

// Virtual for full name
courseNotificationSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email.split('@')[0];
});

// Virtual for notification count
courseNotificationSchema.virtual('notificationCount').get(function() {
  return this.notificationHistory.length;
});

// Virtual for last notification date
courseNotificationSchema.virtual('lastNotificationDate').get(function() {
  if (this.notificationHistory.length > 0) {
    return this.notificationHistory[this.notificationHistory.length - 1].sentAt;
  }
  return null;
});

// Virtual for open rate
courseNotificationSchema.virtual('openRate').get(function() {
  const totalSent = this.notificationHistory.filter(n => n.status !== 'failed').length;
  const totalOpened = this.notificationHistory.filter(n => n.opens.length > 0).length;
  
  if (totalSent === 0) return 0;
  return Math.round((totalOpened / totalSent) * 100);
});

// Virtual for click rate
courseNotificationSchema.virtual('clickRate').get(function() {
  const totalSent = this.notificationHistory.filter(n => n.status !== 'failed').length;
  const totalClicked = this.notificationHistory.filter(n => n.clicks.length > 0).length;
  
  if (totalSent === 0) return 0;
  return Math.round((totalClicked / totalSent) * 100);
});

// Pre-save middleware to generate unsubscribe token
courseNotificationSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    const crypto = require('crypto');
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Static method to get notification statistics
courseNotificationSchema.statics.getNotificationStats = async function(courseId = null) {
  const matchStage = courseId ? { $match: { course: mongoose.Types.ObjectId(courseId) } } : { $match: {} };
  
  const stats = await this.aggregate([
    matchStage,
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const typeStats = await this.aggregate([
    matchStage,
    {
      $group: {
        _id: '$notificationType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalNotifications = await this.countDocuments(courseId ? { course: courseId } : {});
  const activeNotifications = await this.countDocuments({ 
    status: 'active', 
    ...(courseId && { course: courseId })
  });
  
  return {
    total: totalNotifications,
    active: activeNotifications,
    byStatus: stats,
    byType: typeStats
  };
};

// Instance method to add notification to history
courseNotificationSchema.methods.addNotificationHistory = function(notificationData) {
  this.notificationHistory.push(notificationData);
  
  // Update status if this was a course launch notification
  if (notificationData.type === 'email' && 
      this.notificationType === 'launch' && 
      notificationData.status === 'sent') {
    this.status = 'notified';
  }
};

// Instance method to track email open
courseNotificationSchema.methods.trackEmailOpen = function(openData) {
  const lastNotification = this.notificationHistory[this.notificationHistory.length - 1];
  if (lastNotification) {
    lastNotification.opens.push({
      openedAt: openData.openedAt || new Date(),
      ipAddress: openData.ipAddress,
      userAgent: openData.userAgent
    });
    
    if (lastNotification.status === 'sent' || lastNotification.status === 'delivered') {
      lastNotification.status = 'opened';
    }
  }
};

// Instance method to track email click
courseNotificationSchema.methods.trackEmailClick = function(clickData) {
  const lastNotification = this.notificationHistory[this.notificationHistory.length - 1];
  if (lastNotification) {
    lastNotification.clicks.push({
      clickedAt: clickData.clickedAt || new Date(),
      url: clickData.url,
      ipAddress: clickData.ipAddress,
      userAgent: clickData.userAgent
    });
    
    lastNotification.status = 'clicked';
  }
};

// Instance method to mark as enrolled
courseNotificationSchema.methods.markAsEnrolled = function(enrollmentData) {
  this.status = 'enrolled';
  this.enrollmentDate = enrollmentData.enrollmentDate || new Date();
  this.conversionValue = enrollmentData.amount || 0;
};

// Instance method to unsubscribe
courseNotificationSchema.methods.unsubscribe = function(reason) {
  this.status = 'unsubscribed';
  this.unsubscribeDate = new Date();
  this.unsubscribeReason = reason || 'User requested';
};

// Instance method to schedule notification
courseNotificationSchema.methods.scheduleNotification = function(type, scheduledFor, content) {
  this.scheduledNotifications.push({
    type: type,
    scheduledFor: scheduledFor,
    content: content
  });
};

// Static method to find notifications ready to send
courseNotificationSchema.statics.findReadyNotifications = function() {
  return this.find({
    status: 'active',
    'scheduledNotifications.sent': false,
    'scheduledNotifications.scheduledFor': { $lte: new Date() }
  }).populate('course');
};

// Static method to get conversion rate
courseNotificationSchema.statics.getConversionRate = async function(courseId = null) {
  const matchStage = courseId ? { course: mongoose.Types.ObjectId(courseId) } : {};
  
  const totalNotified = await this.countDocuments({ 
    ...matchStage, 
    status: { $in: ['notified', 'enrolled'] } 
  });
  
  const totalEnrolled = await this.countDocuments({ 
    ...matchStage, 
    status: 'enrolled' 
  });
  
  const conversionRate = totalNotified > 0 ? (totalEnrolled / totalNotified) * 100 : 0;
  
  return {
    totalNotified,
    totalEnrolled,
    conversionRate: Math.round(conversionRate * 100) / 100
  };
};

module.exports = mongoose.model('CourseNotification', courseNotificationSchema);