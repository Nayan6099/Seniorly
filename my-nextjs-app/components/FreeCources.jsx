import React from 'react';
import { Star, Users, Clock, Play } from 'lucide-react';

const FreeCourses = () => {
  const freeCourses = [
    {
      id: 1,
      title: 'Introduction to Seniorly',
      instructor: 'Mukul Pundir',
      rating: 4.8,
      students: 2540,
      duration: '1 hour',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Let us know each other better',
      topics: ['Who are we', 'What we aim', 'What you get', 'FAQ'],
      certificate: true
    },
    {
      id: 2,
      title: 'The Beginners',
      instructor: 'Priyanshu Singh',
      rating: 4.7,
      students: 1890,
      duration: '2 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'start your college journey on the right foot.',
      topics: ['Resource Guidance', 'Mentor Insights', 'Management Tips', 'FAQ'],
      certificate: true
    },
    {
      id: 3,
      title: 'Upcoming..',
      instructor: '...',
      rating: 4.6,
      students: 0,
      duration: '0 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: '...',
      topics: ['..', '..', '..', '..'],
      certificate: true
    },
    // {
    //   id: 4,
    //   title: 'Python Programming Basics',
    //   instructor: 'Dr. Alex Kumar',
    //   rating: 4.9,
    //   students: 3200,
    //   duration: '10 hours',
    //   image: '/api/placeholder/300/180',
    //   level: 'Beginner',
    //   description: 'Start your programming journey with Python',
    //   topics: ['Python Syntax', 'Data Types', 'Control Structures', 'Functions'],
    //   certificate: true
    // },
    // {
    //   id: 5,
    //   title: 'Graphic Design Essentials',
    //   instructor: 'Lisa Rodriguez',
    //   rating: 4.5,
    //   students: 1120,
    //   duration: '8 hours',
    //   image: '/api/placeholder/300/180',
    //   level: 'Beginner',
    //   description: 'Learn design principles and create stunning graphics',
    //   topics: ['Design Principles', 'Color Theory', 'Typography', 'Adobe Tools'],
    //   certificate: true
    // },
    // {
    //   id: 6,
    //   title: 'Introduction to Data Analysis',
    //   instructor: 'James Park',
    //   rating: 4.7,
    //   students: 980,
    //   duration: '9 hours',
    //   image: '/api/placeholder/300/180',
    //   level: 'Beginner',
    //   description: 'Discover the world of data analysis and visualization',
    //   topics: ['Data Collection', 'Excel Basics', 'Charts & Graphs', 'Statistical Analysis'],
    //   certificate: true
    // }
  ];

  return (
    <div className="free-courses-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Webinars</h2>
          <p className="section-description">
            Guidance you can trust, from those who’ve walked the path. We share what works, so you can focus on what matters most.
          </p>
        </div>

        <div className="courses-grid">
          {freeCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-overlay">
                  <Play className="play-icon" />
                </div>
                <div className="free-badge">FREE</div>
              </div>
              
              <div className="course-content">
                <div className="course-header">
                  <span className="course-level">{course.level}</span>
                  <div className="course-rating">
                    <Star className="star-icon" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">by {course.instructor}</p>
                <p className="course-description">{course.description}</p>
                
                <div className="course-topics">
                  <h4>What you'll learn:</h4>
                  <ul>
                    {course.topics.slice(0, 3).map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                    {course.topics.length > 3 && (
                      <li>+ {course.topics.length - 3} more topics</li>
                    )}
                  </ul>
                </div>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <Users className="meta-icon" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="meta-item">
                    <Clock className="meta-icon" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="course-footer">
                  <div className="course-features">
                    {course.certificate && (
                      <span className="certificate-badge">📜 Certificate Included</span>
                    )}
                  </div>
                  <button className="enroll-btn">Start Learning</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all">
          <button className="view-all-btn">View All Free Courses</button>
        </div>
      </div>
    </div>
  );
};

export default FreeCourses;