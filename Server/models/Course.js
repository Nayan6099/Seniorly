const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Course must have an instructor']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
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
  },
  subcategory: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  },
  duration: {
    hours: {
      type: Number,
      required: [true, 'Course duration in hours is required'],
      min: [0.5, 'Duration must be at least 0.5 hours']
    },
    lectures: {
      type: Number,
      required: [true, 'Number of lectures is required'],
      min: [1, 'Course must have at least 1 lecture']
    }
  },
  price: {
    current: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative']
    },
    original: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  isFree: {
    type: Boolean,
    default: false
  },
  image: {
    url: String,
    public_id: String,
    alt: String
  },
  preview: {
    video: String,
    duration: Number
  },
  curriculum: [{
    title: {
      type: String,
      required: true
    },
    lectures: [{
      title: String,
      duration: Number,
      video: String,
      resources: [String],
      isFree: {
        type: Boolean,
        default: false
      }
    }],
    totalDuration: Number
  }],
  requirements: [String],
  whatYouWillLearn: [String],
  targetAudience: [String],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  subtitles: [String],
  certificateOffered: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'coming_soon'],
    default: 'draft'
  },
  launchDate: Date,
  lastUpdated: Date,
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  enrollmentCount: {
    type: Number,
    default: 0
  },
  maxEnrollment: {
    type: Number,
    default: null // null means unlimited
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'audio', 'link', 'code', 'other']
    },
    url: String,
    size: Number
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  announcements: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    important: {
      type: Boolean,
      default: false
    }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  return this.duration.hours;
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.price.original && this.price.original > this.price.current) {
    return Math.round(((this.price.original - this.price.current) / this.price.original) * 100);
  }
  return 0;
});

// Virtual for enrollment status
courseSchema.virtual('isEnrollmentOpen').get(function() {
  if (this.maxEnrollment && this.enrollmentCount >= this.maxEnrollment) {
    return false;
  }
  return this.status === 'published';
});

// Pre-save middleware to generate slug
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Pre-save middleware to set lastUpdated
courseSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Static method to get average rating
courseSchema.statics.calculateAverageRating = async function(courseId) {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(courseId, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].numReviews
    });
  } else {
    await this.findByIdAndUpdate(courseId, {
      'rating.average': 0,
      'rating.count': 0
    });
  }
};

// Indexes for better performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ featured: 1, trending: 1, bestseller: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ price: 1 });
courseSchema.index({ slug: 1 });

module.exports = mongoose.model('Course', courseSchema);