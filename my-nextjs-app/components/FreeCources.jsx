import React from 'react';
import { Star, Users, Clock, Play } from 'lucide-react';

const FreeCourses = () => {
  const freeCourses = [
    {
      id: 1,
      title: 'Introduction to HTML & CSS',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      students: 2540,
      duration: '8 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Learn the basics of web development with HTML and CSS',
      topics: ['HTML Fundamentals', 'CSS Styling', 'Responsive Design', 'Flexbox & Grid'],
      certificate: true
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      instructor: 'Mike Chen',
      rating: 4.7,
      students: 1890,
      duration: '12 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Master JavaScript basics and start building interactive websites',
      topics: ['Variables & Functions', 'DOM Manipulation', 'Events', 'ES6 Features'],
      certificate: true
    },
    {
      id: 3,
      title: 'Digital Marketing Basics',
      instructor: 'Emma Wilson',
      rating: 4.6,
      students: 1450,
      duration: '6 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Learn fundamental digital marketing strategies',
      topics: ['SEO Basics', 'Social Media Marketing', 'Content Marketing', 'Analytics'],
      certificate: true
    },
    {
      id: 4,
      title: 'Python Programming Basics',
      instructor: 'Dr. Alex Kumar',
      rating: 4.9,
      students: 3200,
      duration: '10 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Start your programming journey with Python',
      topics: ['Python Syntax', 'Data Types', 'Control Structures', 'Functions'],
      certificate: true
    },
    {
      id: 5,
      title: 'Graphic Design Essentials',
      instructor: 'Lisa Rodriguez',
      rating: 4.5,
      students: 1120,
      duration: '8 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Learn design principles and create stunning graphics',
      topics: ['Design Principles', 'Color Theory', 'Typography', 'Adobe Tools'],
      certificate: true
    },
    {
      id: 6,
      title: 'Introduction to Data Analysis',
      instructor: 'James Park',
      rating: 4.7,
      students: 980,
      duration: '9 hours',
      image: '/api/placeholder/300/180',
      level: 'Beginner',
      description: 'Discover the world of data analysis and visualization',
      topics: ['Data Collection', 'Excel Basics', 'Charts & Graphs', 'Statistical Analysis'],
      certificate: true
    }
  ];

  return (
    <div className="free-courses-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Free Courses</h2>
          <p className="section-description">
            Start your learning journey with our completely free courses. No hidden costs, just quality education.
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