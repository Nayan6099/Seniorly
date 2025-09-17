const mongoose = require('mongoose');
const validator = require('validator');

const emailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
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
  subscriptionType: {
    type: String,
    enum: ['newsletter', 'course_notifications', 'marketing', 'all'],
    default: 'newsletter'
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced', 'complained'],
    default: 'active'
  },
  interests: [{
    type: String,
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Design',
      'Business',
      'Marketing',
      'Photography',
      'Music',
      'Language',
      'Other'
    ]
  }],
  source: {
    type: String,
    enum: ['website', 'popup', 'course_page', 'checkout', 'referral', 'social', 'other'],
    default: 'website'
  },
  referralSource: String,
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'never'],
      default: 'weekly'
    },
    categories: [{
      type: String
    }],
    timeZone: String,
    language: {
      type: String,
      default: 'en'
    }
  },
  engagementData: {
    totalEmailsSent: {
      type: Number,
      default: 0
    },
    totalEmailsOpened: {
      type: Number,
      default: 0
    },
    totalLinksClicked: {
      type: Number,
      default: 0
    },
    lastEmailSent: Date,
    lastEmailOpened: Date,
    lastLinkClicked: Date,
    openRate: {
      type: Number,
      default: 0
    },
    clickRate: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  unsubscribeReason: String,
  unsubscribeDate: Date,
  confirmedAt: Date,
  confirmationToken: String,
  isConfirmed: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
emailSubscriptionSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email.split('@')[0];
});

// Virtual for engagement score
emailSubscriptionSchema.virtual('engagementScore').get(function() {
  const { totalEmailsSent, totalEmailsOpened, totalLinksClicked } = this.engagementData;
  if (totalEmailsSent === 0) return 0;
  
  const openWeight = 0.6;
  const clickWeight = 0.4;
  
  const openScore = (totalEmailsOpened / totalEmailsSent) * openWeight;
  const clickScore = totalEmailsSent > 0 ? (totalLinksClicked / totalEmailsSent) * clickWeight : 0;
  
  return Math.round((openScore + clickScore) * 100);
});

// Pre-save middleware to update engagement rates
emailSubscriptionSchema.pre('save', function(next) {
  if (this.isModified('engagementData')) {
    const { totalEmailsSent, totalEmailsOpened, totalLinksClicked } = this.engagementData;
    
    if (totalEmailsSent > 0) {
      this.engagementData.openRate = Math.round((totalEmailsOpened / totalEmailsSent) * 100);
      this.engagementData.clickRate = Math.round((totalLinksClicked / totalEmailsSent) * 100);
    }
  }
  next();
});

// Static method to get subscription statistics
emailSubscriptionSchema.statics.getSubscriptionStats = async function() {
  const totalSubscribers = await this.countDocuments({ status: 'active' });
  const totalUnsubscribed = await this.countDocuments({ status: 'unsubscribed' });
  
  const statusStats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const sourceStats = await this.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const averageEngagement = await this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        avgOpenRate: { $avg: '$engagementData.openRate' },
        avgClickRate: { $avg: '$engagementData.clickRate' }
      }
    }
  ]);
  
  return {
    total: totalSubscribers,
    unsubscribed: totalUnsubscribed,
    byStatus: statusStats,
    bySource: sourceStats,
    averageEngagement: averageEngagement[0] || { avgOpenRate: 0, avgClickRate: 0 }
  };
};

// Instance method to generate confirmation token
emailSubscriptionSchema.methods.generateConfirmationToken = function() {
  const crypto = require('crypto');
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  
  this.confirmationToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');
    
  return confirmationToken;
};

// Instance method to confirm subscription
emailSubscriptionSchema.methods.confirmSubscription = function() {
  this.isConfirmed = true;
  this.confirmedAt = new Date();
  this.confirmationToken = undefined;
};

// Instance method to unsubscribe
emailSubscriptionSchema.methods.unsubscribe = function(reason) {
  this.status = 'unsubscribed';
  this.unsubscribeDate = new Date();
  this.unsubscribeReason = reason || 'User requested';
};

// Instance method to track email sent
emailSubscriptionSchema.methods.trackEmailSent = function() {
  this.engagementData.totalEmailsSent += 1;
  this.engagementData.lastEmailSent = new Date();
};

// Instance method to track email opened
emailSubscriptionSchema.methods.trackEmailOpened = function() {
  this.engagementData.totalEmailsOpened += 1;
  this.engagementData.lastEmailOpened = new Date();
};

// Instance method to track link clicked
emailSubscriptionSchema.methods.trackLinkClicked = function() {
  this.engagementData.totalLinksClicked += 1;
  this.engagementData.lastLinkClicked = new Date();
};

// Indexes for better performance
emailSubscriptionSchema.index({ email: 1 });
emailSubscriptionSchema.index({ status: 1 });
emailSubscriptionSchema.index({ subscriptionType: 1 });
emailSubscriptionSchema.index({ interests: 1 });
emailSubscriptionSchema.index({ createdAt: -1 });
emailSubscriptionSchema.index({ 'engagementData.lastEmailOpened': -1 });

module.exports = mongoose.model('EmailSubscription', emailSubscriptionSchema);