import React, { useState } from 'react';
import { Clock, Calendar, Bell, Users, Star, AlertCircle } from 'lucide-react';

const UpcomingCourses = () => {
  const [notifiedCourses, setNotifiedCourses] = useState(new Set());

  const upcomingCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      instructor: 'David Kumar',
      launchDate: 'March 15, 2025',
      duration: '20 hours',
      image: '/api/placeholder/300/180',
      level: 'Advanced',
      description: 'Master advanced React concepts including hooks, context, and performance optimization',
      prerequisites: ['Basic React Knowledge', 'JavaScript ES6+', 'HTML/CSS'],
      features: ['Live Sessions', 'Code Reviews', 'Project-Based Learning', 'Industry Mentorship'],
      estimatedStudents: '500+',
      earlyAccess: true
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Lisa Wong',
      launchDate: 'March 22, 2025',
      duration: '15 hours',
      image: '/api/placeholder/300/180',
      level: 'Intermediate',
      description: 'Dive into machine learning algorithms and practical applications',
      prerequisites: ['Python Programming', 'Basic Statistics', 'Mathematics'],
      features: ['Hands-on Projects', 'Real Datasets', 'Industry Case Studies', 'Certification'],
      estimatedStudents: '300+',
      earlyAccess: false
    },
    {
      id: 3,
      title: 'UI/UX Design Mastery',
      instructor: 'Alex Thompson',
      launchDate: 'April 5, 2025',
      duration: '18 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner to Advanced',
      description: 'Complete guide to user interface and user experience design',
      prerequisites: ['Basic Design Knowledge', 'Creativity', 'Design Tools Access'],
      features: ['Design Portfolio', 'Client Projects', 'Design System Creation', 'Peer Reviews'],
      estimatedStudents: '400+',
      earlyAccess: true
    },
    {
      id: 4,
      title: 'DevOps & Cloud Computing',
      instructor: 'Michael Rodriguez',
      launchDate: 'April 12, 2025',
      duration: '25 hours',
      image: '/api/placeholder/300/180',
      level: 'Intermediate',
      description: 'Learn DevOps practices and cloud deployment strategies',
      prerequisites: ['Linux Basics', 'Command Line', 'Basic Programming'],
      features: ['AWS Certification Prep', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Live Labs'],
      estimatedStudents: '250+',
      earlyAccess: false
    },
    {
      id: 5,
      title: 'Full Stack Web Development',
      instructor: 'Sarah Chen',
      launchDate: 'April 20, 2025',
      duration: '30 hours',
      image: '/api/placeholder/300/180',
      level: 'Intermediate',
      description: 'Build complete web applications from frontend to backend',
      prerequisites: ['HTML/CSS/JS', 'Basic Programming', 'Database Concepts'],
      features: ['Full Stack Projects', 'API Development', 'Database Design', 'Deployment'],
      estimatedStudents: '600+',
      earlyAccess: true
    },
    {
      id: 6,
      title: 'Blockchain & Cryptocurrency',
      instructor: 'Dr. James Kim',
      launchDate: 'May 1, 2025',
      duration: '12 hours',
      image: '/api/placeholder/300/180',
      level: 'Advanced',
      description: 'Understand blockchain technology and develop smart contracts',
      prerequisites: ['Programming Experience', 'Cryptography Basics', 'Finance Knowledge'],
      features: ['Smart Contracts', 'DApp Development', 'Crypto Trading', 'Security Practices'],
      estimatedStudents: '200+',
      earlyAccess: false
    }
  ];

  const handleNotifyMe = (courseId) => {
    setNotifiedCourses(prev => new Set(prev).add(courseId));
    // Here you would typically make an API call to subscribe the user
    console.log(`Subscribed to notifications for course ${courseId}`);
  };

  const getDaysUntilLaunch = (launchDate) => {
    const today = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="upcoming-courses-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Upcoming Courses</h2>
          <p className="section-description">
            Get ready for our latest courses launching soon. Be the first to know and secure your spot!
          </p>
        </div>

        <div className="upcoming-info-banner">
          <AlertCircle className="info-icon" />
          <div className="info-content">
            <h3>Early Bird Benefits</h3>
            <p>Subscribe to get notified about course launches and receive exclusive early access and discounts!</p>
          </div>
        </div>

        <div className="courses-grid">
          {upcomingCourses.map((course) => {
            const daysUntilLaunch = getDaysUntilLaunch(course.launchDate);
            const isNotified = notifiedCourses.has(course.id);
            
            return (
              <div key={course.id} className="upcoming-course-card">
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                  <div className="course-overlay">
                    <div className="coming-soon-badge">Coming Soon</div>
                  </div>
                  {course.earlyAccess && (
                    <div className="early-access-badge">Early Access</div>
                  )}
                </div>
                
                <div className="course-content">
                  <div className="course-header">
                    <span className="course-level">{course.level}</span>
                    <div className="countdown">
                      {daysUntilLaunch > 0 ? `${daysUntilLaunch} days left` : 'Launching Soon!'}
                    </div>
                  </div>
                  
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-details">
                    <div className="detail-section">
                      <h4>Prerequisites:</h4>
                      <ul className="prerequisites-list">
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Course Features:</h4>
                      <div className="features-grid">
                        {course.features.map((feature, index) => (
                          <span key={index} className="feature-badge">{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="course-meta">
                    <div className="meta-item">
                      <Calendar className="meta-icon" />
                      <span>Launches: {course.launchDate}</span>
                    </div>
                    <div className="meta-item">
                      <Clock className="meta-icon" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="meta-item">
                      <Users className="meta-icon" />
                      <span>Expected: {course.estimatedStudents}</span>
                    </div>
                  </div>
                  
                  <div className="course-footer">
                    <button
                      className={`notify-btn ${isNotified ? 'notified' : ''}`}
                      onClick={() => handleNotifyMe(course.id)}
                      disabled={isNotified}
                    >
                      {isNotified ? (
                        <>
                          <Bell className="btn-icon" />
                          You'll be notified!
                        </>
                      ) : (
                        <>
                          <Bell className="btn-icon" />
                          Notify Me
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="newsletter-signup">
          <div className="newsletter-content">
            <h3>Never Miss a Course Launch</h3>
            <p>Subscribe to our newsletter and get notified about all upcoming courses, early bird offers, and exclusive content.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingCourses;