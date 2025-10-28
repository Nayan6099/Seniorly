import React, { useState } from 'react';
import { Clock, Calendar, Bell, Users, Star, AlertCircle } from 'lucide-react';

const UpcomingCourses = () => {
  const [notifiedCourses, setNotifiedCourses] = useState(new Set());

   const [email, setEmail] = useState("");       // to track input
  const [isSubscribed, setIsSubscribed] = useState(false); // to track subscription


  const upcomingCourses = [
    {
      id: 1,
      title: 'Types of Development',
      instructor: '..',
      launchDate: 'soon',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Find your path in dev',
      prerequisites: ['What is Development', 'Types of Development', 'FAQ'],
      features: ['Live Session', 'Reviews', 'certification', 'Live Mentorship'],
      estimatedStudents: '500+',
      earlyAccess: true
    },
    {
      id: 2,
      title: 'Knowing Fundamentals',
      instructor: '..',
      launchDate: 'soon',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Dive a little more',
      prerequisites: ['..', '..', '..'],
      features: ['Live Session', 'Live Mentorship', '..', 'Certification'],
      estimatedStudents: '300+',
      earlyAccess: false
    },
    {
      id: 3,
      title: 'Revealing Soon',
      instructor: '..',
      launchDate: '..',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Beginner to Advanced',
      description: '..',
      prerequisites: ['Basic', 'Creative', '..'],
      features: ['LIve Session', 'Live Mentorship', 'certification', 'FAQ'],
      estimatedStudents: '400+',
      earlyAccess: true
    },
    {
      id: 4,
      title: 'Soon...',
      instructor: '..',
      launchDate: '..',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Intermediate',
      description: '..',
      prerequisites: ['.', '.', '.'],
      features: ['.', '.', '.', '.'],
      estimatedStudents: '250+',
      earlyAccess: false
    },
    {
      id: 5,
      title: 'Soon...',
      instructor: '',
      launchDate: '..',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Intermediate',
      description: '..',
      prerequisites: ['.', '.', '.'],
      features: ['.', '.', '.', '.'],
      estimatedStudents: '600+',
      earlyAccess: true
    },
    {
      id: 6,
      title: 'Soon...',
      instructor: '..',
      launchDate: '..',
      duration: '',
      image: '/api/placeholder/300/180',
      level: 'Advanced',
      description: '..',
      prerequisites: ['.', '.', '.'],
      features: ['.', '.', '.', '.'],
      estimatedStudents: '200+',
      earlyAccess: false
    }
  ];

  const handleNotifyMe = (courseId) => {
    setNotifiedCourses(prev => new Set(prev).add(courseId));
    // Here you would typically make an API call to subscribe the user
    console.log(`Subscribed to notifications for course ${courseId}`);
  };

   const handleSubscribe = () => {
    if (!email) return; // optional: ensure email is entered
    setIsSubscribed(true);
    // Optional: API call to save email here
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
          <h2 className="section-title">Upcoming Sessions</h2>
          <p className="section-description">
            Get ready for our latest Sessions comming soon. Be the first to know and secure your spot!
          </p>
        </div>

        <div className="upcoming-info-banner">
          <AlertCircle className="info-icon" />
          <div className="info-content">
            <h3>Early Bird Benefits</h3>
            <p>Subscribe to get notified about Session launches and receive exclusive early access!</p>
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
                      disabled={isNotified}>
                      {isNotified ? (<><Bell className="btn-icon" />You'll be notified!</>) : (<>
                        <Bell className="btn-icon" />Notify Me</>)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="newsletter-signup">
          <div className="newsletter-content">
            <h3>Never Miss an Event</h3>
            <p>Subscribe to our newsletter and get notified about all upcoming sessions, early bird offers, and exclusive content.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={email}
                 onChange={(e) => setEmail(e.target.value)}
            disabled={isSubscribed} // optional: disable input after subscribing
              />
              {/* <button className="newsletter-btn">Subscribe</button> */}
               <button
            className={`newsletter-btn ${isSubscribed ? 'subscribed' : ''}`}
            onClick={handleSubscribe}
            disabled={isSubscribed}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingCourses;