# EduTech Platform - Complete Learning Management System

A modern, full-featured educational technology platform built with Next.js, Node.js, and MongoDB. Features course management, user enrollment, email notifications, and comprehensive analytics.

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Course Management**: Create, edit, and manage courses with multimedia content
- **Enrollment System**: Course enrollment with payment processing
- **Email Notifications**: Automated email campaigns and course notifications
- **Progress Tracking**: Detailed learning analytics and progress monitoring
- **Certificate Generation**: Automated certificate issuance upon completion

### Advanced Features
- **Newsletter System**: Advanced email subscription management
- **Course Notifications**: Notify users about upcoming courses
- **Analytics Dashboard**: Comprehensive reporting and analytics
- **Mobile Responsive**: Fully responsive design for all devices
- **SEO Optimized**: Built-in SEO features for better discoverability

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Additional Tools
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Docker** - Containerization

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edutech-platform.git
cd edutech-platform
```

### 2. Backend Setup

#### Install Dependencies
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
```

#### Required Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/edutech

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Configuration
ADMIN_EMAIL=admin@edutech.com
ADMIN_PASSWORD=admin123
```

#### Database Setup
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# On Windows: Start MongoDB service from Services panel
```

#### Seed Database (Optional)
```bash
# Populate database with sample data
npm run seed
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend  # If you're in the backend directory
# or
cd frontend     # If you're in the root directory
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit the .env.local file
```

#### Required Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
```

#### Start Frontend Server
```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

The frontend will be available at `http://localhost:3000`

## 🐳 Docker Setup (Recommended)

### 1. Using Docker Compose
```bash
# Clone the repository
git clone https://github.com/yourusername/edutech-platform.git
cd edutech-platform

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Individual Container Setup
```bash
# Build backend image
docker build -t edutech-backend .

# Run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:7.0

# Run backend
docker run -d --name edutech-backend -p 5000:5000 --link mongodb edutech-backend

# Run frontend
cd frontend
docker build -t edutech-frontend .
docker run -d --name edutech-frontend -p 3000:3000 edutech-frontend
```

## 📁 Project Structure

```
edutech-platform/
├── backend/
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── EmailSubscription.js
│   │   └── CourseNotification.js
│   ├── routes/              # API routes
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── emailRoutes.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── utils/               # Utility functions
│   │   └── emailService.js
│   ├── scripts/             # Database scripts
│   │   └── seedData.js
│   ├── server.js            # Main server file
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Banner.tsx
│   │   ├── FreeCourses.jsx
│   │   └── UpcomingCourses.jsx
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx
│   │   └── _app.tsx
│   ├── styles/              # CSS styles
│   │   ├── globals.css
│   │   └── Home.module.css
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
├── docker-compose.yml       # Docker orchestration
├── nginx/                   # Nginx configuration
├── monitoring/              # Monitoring setup
└── README.md
```

## 🔌 API Endpoints

### Authentication & Users
```http
POST   /api/users/register          # User registration
POST   /api/users/login             # User login
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update profile
POST   /api/users/forgot-password   # Password reset
```

### Courses
```http
GET    /api/courses                 # Get all courses
GET    /api/courses/:id             # Get course by ID
POST   /api/courses                 # Create course (instructor/admin)
PUT    /api/courses/:id             # Update course
DELETE /api/courses/:id             # Delete course
```

### Enrollments
```http
POST   /api/enrollments/enroll      # Enroll in course
GET    /api/enrollments/my-courses  # Get user enrollments
PUT    /api/enrollments/:id/progress # Update progress
POST   /api/enrollments/:id/review  # Submit review
```

### Email & Notifications
```http
POST   /api/emails/subscribe           # Newsletter subscription
POST   /api/emails/course-notifications # Course notifications
GET    /api/emails/confirm/:token      # Confirm subscription
POST   /api/emails/unsubscribe         # Unsubscribe
```

## 🎯 Usage Examples

### 1. Newsletter Subscription
```javascript
// Frontend JavaScript
const subscribeToNewsletter = async (email, interests) => {
  const response = await fetch('/api/emails/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      subscriptionType: 'newsletter',
      interests,
      source: 'website'
    }),
  });
  
  const data = await response.json();
  return data;
};
```

### 2. Course Enrollment
```javascript
// Enroll in a course
const enrollInCourse = async (courseId, userEmail) => {
  const response = await fetch('/api/enrollments/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      courseId,
      paymentMethod: 'free',
      source: 'website'
    }),
  });
  
  const data = await response.json();
  return data;
};
```

### 3. Course Notifications
```javascript
// Subscribe to course launch notifications
const notifyOnLaunch = async (email, courseId) => {
  const response = await fetch('/api/emails/course-notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      courseId,
      notificationType: 'launch',
      preferences: {
        emailNotification: true,
        notifyOnLaunch: true
      }
    }),
  });
  
  const data = await response.json();
  return data;
};
```

## 📊 Database Schema

### Key Collections

#### Users
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'instructor' | 'admin',
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Courses
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructor: ObjectId (ref: User),
  category: String,
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  price: { current: Number, original: Number },
  isFree: Boolean,
  status: 'draft' | 'published' | 'archived',
  enrollmentCount: Number,
  rating: { average: Number, count: Number },
  createdAt: Date,
  updatedAt: Date
}
```

#### Enrollments
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  status: 'active' | 'completed' | 'dropped',
  progress: {
    completedLectures: Array,
    percentageCompleted: Number,
    totalTimeSpent: Number
  },
  certificate: {
    issued: Boolean,
    certificateId: String,
    downloadUrl: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Email Subscriptions
```javascript
{
  _id: ObjectId,
  email: String (unique),
  firstName: String,
  subscriptionType: 'newsletter' | 'course_notifications' | 'all',
  status: 'active' | 'unsubscribed',
  interests: [String],
  isConfirmed: Boolean,
  engagementData: {
    totalEmailsSent: Number,
    totalEmailsOpened: Number,
    openRate: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Production Deployment with Docker

1. **Set Production Environment Variables**
```bash
# Copy and edit production environment
cp .env.example .env.production

# Update values for production
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST=your-production-smtp-host
CLIENT_URL=https://your-domain.com
```

2. **Build and Deploy**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

### Manual Deployment

1. **Backend Deployment**
```bash
# Install PM2 for process management
npm install -g pm2

# Build and start backend
cd backend
npm install --production
pm2 start server.js --name "edutech-backend"
```

2. **Frontend Deployment**
```bash
# Build and start frontend
cd frontend
npm install --production
npm run build
pm2 start npm --name "edutech-frontend" -- start
```

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet.js**: Security headers
- **Input Validation**: Server-side validation using express-validator
- **SQL Injection Protection**: MongoDB prevents SQL injection
- **XSS Protection**: Built-in React XSS protection

## 📈 Monitoring & Analytics

### Built-in Analytics
- Email open/click tracking
- Course enrollment statistics
- User engagement metrics
- Progress tracking
- Conversion rate analysis

### External Monitoring (with Docker)
- **Prometheus**: Metrics collection
- **Grafana**: Data visualization
- **MongoDB Compass**: Database monitoring

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing with Postman
Import the provided Postman collection from `/docs/api-collection.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Email Service Issues
- Ensure Gmail App Password is configured correctly
- Check firewall settings for SMTP ports
- Verify email credentials in .env file

### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Docker Issues
```bash
# Reset Docker
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📧 Support

For support, email support@edutech.com or create an issue on GitHub.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database
- All open-source contributors

---

Made with ❤️ by the Seniorly Team