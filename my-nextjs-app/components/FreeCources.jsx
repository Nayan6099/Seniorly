import React, { useState, useEffect } from 'react';
import { Star, Users, Clock, Play } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8888';

const FreeCourses = () => {
  const [freeCourses, setFreeCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses?status=published&isFree=true`);
        const result = await response.json();
        if (result.success) {
          setFreeCourses(result.data);
        }
      } catch (error) {
        console.error('Error fetching free courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeCourses();
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading sessions...</div>;

  return (
    <div className="free-courses-container" id="webinars">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Free Smart Sessions</h2>
          <p className="section-description">
            Access our high-quality study sessions for free and start your journey to smarter learning today.
          </p>
        </div>

        <div className="courses-grid">
          {freeCourses.length > 0 ? (
            freeCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img src={course.image?.url || 'https://placehold.co/300x180?text=Session'} alt={course.title} />
                  <div className="course-overlay">
                    <Play className="play-icon" />
                  </div>
                  <div className="free-badge">FREE</div>
                </div>
                
                <div className="course-content">
                  <div className="course-header">
                    <span className="course-level">{course.level}</span>
                    <div className="course-rating">
                      <Star className="star-icon" fill="currentColor" />
                      <span>{course.averageRating} ({course.numberOfRatings})</span>
                    </div>
                  </div>
                  
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                  <p className="course-description">{course.shortDescription}</p>
                  
                  <div className="course-topics">
                    <h4>What you'll learn:</h4>
                    <ul>
                      {course.whatYouWillLearn?.slice(0, 3).map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="course-meta">
                    <div className="meta-item">
                      <Clock className="meta-icon" />
                      <span>{course.duration?.hours} hours</span>
                    </div>
                    <div className="meta-item">
                      <Users className="meta-icon" />
                      <span>{course.studentsEnrolled} students</span>
                    </div>
                  </div>
                  
                  <div className="course-footer">
                    <span className="certificate-badge">✓ Certificate Included</span>
                    <button className="enroll-btn" onClick={() => window.location.href = `/login`}>Enroll Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{gridColumn: '1/-1', textAlign: 'center'}}>No free sessions available at the moment. Check back soon!</p>
          )}
        </div>

        <div className="view-all">
          <button className="view-all-btn">View All Sessions</button>
        </div>
      </div>
    </div>
  );
};

export default FreeCourses;