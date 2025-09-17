const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Course = require('../models/Course');
const EmailSubscription = require('../models/EmailSubscription');
const CourseNotification = require('../models/CourseNotification');
const Enrollment = require('../models/Enrollment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edutech');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'student',
    phone: '+1234567890',
    bio: 'Passionate about web development and always eager to learn new technologies.',
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['Web Development', 'Mobile Development'],
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'instructor',
    phone: '+1234567891',
    bio: 'Senior software engineer with 10+ years of experience in full-stack development.',
    skills: ['JavaScript', 'Python', 'React', 'Django', 'AWS'],
    interests: ['Web Development', 'Data Science'],
    isActive: true,
    isVerified: true,
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: new Date('2018-01-01'),
        description: 'Leading development of scalable web applications'
      }
    ]
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@edutech.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567892',
    bio: 'EduTech platform administrator',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'instructor',
    phone: '+1234567893',
    bio: 'Expert in HTML, CSS, and responsive design with a passion for teaching.',
    skills: ['HTML', 'CSS', 'JavaScript', 'UI/UX Design'],
    interests: ['Web Development', 'Design'],
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@example.com',
    password: 'password123',
    role: 'instructor',
    phone: '+1234567894',
    bio: 'JavaScript developer and educator with expertise in modern frameworks.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js'],
    interests: ['Web Development', 'Mobile Development'],
    isActive: true,
    isVerified: true
  }
];

const sampleEmailSubscriptions = [
  {
    email: 'subscriber1@example.com',
    firstName: 'Alice',
    lastName: 'Brown',
    subscriptionType: 'newsletter',
    interests: ['Web Development', 'Design'],
    source: 'website',
    isConfirmed: true,
    confirmedAt: new Date()
  },
  {
    email: 'subscriber2@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    subscriptionType: 'course_notifications',
    interests: ['Data Science', 'Machine Learning'],
    source: 'popup',
    isConfirmed: true,
    confirmedAt: new Date()
  },
  {
    email: 'subscriber3@example.com',
    firstName: 'Carol',
    subscriptionType: 'all',
    interests: ['Business', 'Marketing'],
    source: 'course_page',
    isConfirmed: false
  }
];

// Function to create sample courses
const createSampleCourses = async (instructors) => {
  const courses = [
    {
      title: 'Introduction to HTML & CSS',
      slug: 'introduction-to-html-css',
      description: 'Learn the fundamentals of web development with HTML and CSS. This comprehensive course covers everything from basic tags to responsive design.',
      shortDescription: 'Learn the basics of web development with HTML and CSS',
      instructor: instructors.find(i => i.email === 'sarah.johnson@example.com')._id,
      category: 'Web Development',
      subcategory: 'Frontend',
      level: 'Beginner',
      duration: { hours: 8, lectures: 24 },
      price: { current: 0, original: 49.99, currency: 'USD' },
      isFree: true,
      image: {
        url: '/api/placeholder/300/180',
        alt: 'HTML CSS Course'
      },
      curriculum: [
        {
          title: 'Getting Started',
          lectures: [
            { title: 'What is HTML?', duration: 15, isFree: true },
            { title: 'Setting up your environment', duration: 20, isFree: true },
            { title: 'Your first HTML page', duration: 25, isFree: false }
          ],
          totalDuration: 60
        },
        {
          title: 'CSS Fundamentals',
          lectures: [
            { title: 'Introduction to CSS', duration: 20, isFree: false },
            { title: 'Selectors and Properties', duration: 30, isFree: false },
            { title: 'Box Model', duration: 35, isFree: false }
          ],
          totalDuration: 85
        }
      ],
      requirements: ['Basic computer skills', 'Text editor installed'],
      whatYouWillLearn: [
        'HTML Fundamentals',
        'CSS Styling',
        'Responsive Design',
        'Flexbox & Grid'
      ],
      targetAudience: ['Complete beginners', 'Career changers', 'Students'],
      tags: ['html', 'css', 'web development', 'frontend'],
      status: 'published',
      rating: { average: 4.8, count: 2540 },
      enrollmentCount: 2540,
      certificateOffered: true
    },
    {
      title: 'Python Programming Basics',
      slug: 'python-programming-basics',
      description: 'Start your programming journey with Python. Learn syntax, data types, control structures, and build real projects.',
      shortDescription: 'Start your programming journey with Python',
      instructor: instructors.find(i => i.email === 'jane.smith@example.com')._id,
      category: 'Data Science',
      subcategory: 'Programming',
      level: 'Beginner',
      duration: { hours: 10, lectures: 30 },
      price: { current: 0, original: 59.99, currency: 'USD' },
      isFree: true,
      image: {
        url: '/api/placeholder/300/180',
        alt: 'Python Course'
      },
      curriculum: [
        {
          title: 'Python Fundamentals',
          lectures: [
            { title: 'Python Installation', duration: 15, isFree: true },
            { title: 'Variables and Data Types', duration: 25, isFree: false },
            { title: 'Control Structures', duration: 30, isFree: false }
          ],
          totalDuration: 70
        }
      ],
      requirements: ['Basic computer skills', 'Willingness to learn'],
      whatYouWillLearn: [
        'Python Syntax',
        'Data Types',
        'Control Structures',
        'Functions'
      ],
      targetAudience: ['Programming beginners', 'Students', 'Career changers'],
      tags: ['python', 'programming', 'beginner'],
      status: 'published',
      rating: { average: 4.9, count: 3200 },
      enrollmentCount: 3200,
      certificateOffered: true
    }
  ];

  return courses;
};

// Clear existing data
const clearDatabase = async () => {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Course.deleteMany({});
  await EmailSubscription.deleteMany({});
  await CourseNotification.deleteMany({});
  await Enrollment.deleteMany({});
  console.log('Database cleared');
};

// Seed users
const seedUsers = async () => {
  console.log('Seeding users...');
  const users = [];
  
  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    await user.save();
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }
  
  return users;
};

// Seed courses
const seedCourses = async (instructors) => {
  console.log('Seeding courses...');
  const coursesData = await createSampleCourses(instructors);
  const courses = [];
  
  for (const courseData of coursesData) {
    const course = new Course(courseData);
    await course.save();
    courses.push(course);
    console.log(`Created course: ${course.title}`);
  }
  
  return courses;
};

// Seed email subscriptions
const seedEmailSubscriptions = async () => {
  console.log('Seeding email subscriptions...');
  
  for (const subscriptionData of sampleEmailSubscriptions) {
    const subscription = new EmailSubscription(subscriptionData);
    await subscription.save();
    console.log(`Created subscription: ${subscription.email}`);
  }
};

// Seed course notifications
const seedCourseNotifications = async (courses) => {
  console.log('Seeding course notifications...');
  
  const notifications = [
    {
      email: 'notify1@example.com',
      firstName: 'David',
      lastName: 'Lee',
      course: courses.find(c => c.slug === 'advanced-react-development')._id,
      notificationType: 'launch',
      status: 'active',
      preferences: {
        emailNotification: true,
        notifyOnLaunch: true,
        notifyOnDiscount: true
      }
    },
    {
      email: 'notify2@example.com',
      firstName: 'Emma',
      lastName: 'Garcia',
      course: courses.find(c => c.slug === 'advanced-react-development')._id,
      notificationType: 'early_access',
      status: 'active',
      preferences: {
        emailNotification: true,
        notifyOnEarlyAccess: true
      }
    }
  ];
  
  for (const notificationData of notifications) {
    const notification = new CourseNotification(notificationData);
    await notification.save();
    console.log(`Created notification: ${notification.email} for course ${notification.course}`);
  }
};

// Seed enrollments
const seedEnrollments = async (users, courses) => {
  console.log('Seeding enrollments...');
  
  const student = users.find(u => u.role === 'student');
  const freeCourses = courses.filter(c => c.isFree);
  
  for (const course of freeCourses) {
    const enrollment = new Enrollment({
      student: student._id,
      course: course._id,
      status: 'active',
      payment: {
        amount: 0,
        method: 'free',
        status: 'completed',
        paymentDate: new Date()
      },
      progress: {
        completedLectures: [
          {
            lectureId: 'lecture1',
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            timeSpent: 15
          }
        ],
        currentLecture: 'lecture2',
        percentageCompleted: 10,
        totalTimeSpent: 15,
        lastAccessed: new Date()
      }
    });
    
    await enrollment.save();
    console.log(`Created enrollment: ${student.email} in ${course.title}`);
  }
};

// Create sample analytics data
const seedAnalyticsData = async (users, courses) => {
  console.log('Seeding analytics data...');
  
  // Add some engagement data to email subscriptions
  const subscriptions = await EmailSubscription.find({});
  for (const subscription of subscriptions) {
    subscription.engagementData.totalEmailsSent = Math.floor(Math.random() * 20) + 5;
    subscription.engagementData.totalEmailsOpened = Math.floor(subscription.engagementData.totalEmailsSent * 0.7);
    subscription.engagementData.totalLinksClicked = Math.floor(subscription.engagementData.totalEmailsOpened * 0.3);
    subscription.engagementData.lastEmailSent = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    await subscription.save();
  }
  
  console.log('Analytics data seeded');
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data in order
    const users = await seedUsers();
    const instructors = users.filter(u => u.role === 'instructor');
    const courses = await seedCourses(instructors);
    await seedEmailSubscriptions();
    await seedCourseNotifications(courses);
    await seedEnrollments(users, courses);
    await seedAnalyticsData(users, courses);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Courses: ${courses.length}`);
    console.log(`Email Subscriptions: ${sampleEmailSubscriptions.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('Student: john.doe@example.com / password123');
    console.log('Instructor: jane.smith@example.com / password123');
    console.log('Admin: admin@edutech.com / admin123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearDatabase,
  seedUsers,
  seedCourses,
  seedEmailSubscriptions,
  seedCourseNotifications,
  seedEnrollments
};,
    {
      title: 'JavaScript Fundamentals',
      slug: 'javascript-fundamentals',
      description: 'Master JavaScript basics and start building interactive websites. Learn variables, functions, DOM manipulation, and modern ES6 features.',
      shortDescription: 'Master JavaScript basics and start building interactive websites',
      instructor: instructors.find(i => i.email === 'mike.chen@example.com')._id,
      category: 'Web Development',
      subcategory: 'Programming',
      level: 'Beginner',
      duration: { hours: 12, lectures: 36 },
      price: { current: 0, original: 79.99, currency: 'USD' },
      isFree: true,
      image: {
        url: '/api/placeholder/300/180',
        alt: 'JavaScript Course'
      },
      curriculum: [
        {
          title: 'JavaScript Basics',
          lectures: [
            { title: 'Variables and Data Types', duration: 20, isFree: true },
            { title: 'Functions', duration: 25, isFree: false },
            { title: 'Control Structures', duration: 30, isFree: false }
          ],
          totalDuration: 75
        }
      ],
      requirements: ['Basic HTML/CSS knowledge', 'Web browser'],
      whatYouWillLearn: [
        'Variables & Functions',
        'DOM Manipulation',
        'Events',
        'ES6 Features'
      ],
      targetAudience: ['HTML/CSS learners', 'Aspiring developers'],
      tags: ['javascript', 'programming', 'web development'],
      status: 'published',
      rating: { average: 4.7, count: 1890 },
      enrollmentCount: 1890,
      certificateOffered: true
    },
    {
      title: 'Advanced React Development',
      slug: 'advanced-react-development',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and testing. Build production-ready applications.',
      shortDescription: 'Master advanced React concepts including hooks, context, and performance optimization',
      instructor: instructors.find(i => i.email === 'jane.smith@example.com')._id,
      category: 'Web Development',
      subcategory: 'Frontend Framework',
      level: 'Advanced',
      duration: { hours: 20, lectures: 45 },
      price: { current: 99.99, original: 149.99, currency: 'USD' },
      isFree: false,
      image: {
        url: '/api/placeholder/300/180',
        alt: 'React Course'
      },
      curriculum: [
        {
          title: 'Advanced Hooks',
          lectures: [
            { title: 'useEffect Deep Dive', duration: 35, isFree: true },
            { title: 'Custom Hooks', duration: 40, isFree: false },
            { title: 'useContext and useReducer', duration: 45, isFree: false }
          ],
          totalDuration: 120
        }
      ],
      requirements: ['Basic React Knowledge', 'JavaScript ES6+', 'HTML/CSS'],
      whatYouWillLearn: [
        'Advanced React Hooks',
        'Context API',
        'Performance Optimization',
        'Testing React Apps'
      ],
      targetAudience: ['React developers', 'Frontend engineers'],
      tags: ['react', 'javascript', 'hooks', 'advanced'],
      status: 'coming_soon',
      launchDate: new Date('2025-03-15'),
      rating: { average: 0, count: 0 },
      enrollmentCount: 0,
      certificateOffered: true
    }