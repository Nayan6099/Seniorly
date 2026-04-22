import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Bell, Users, Star, AlertCircle, Play, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8888';

const UpcomingCourses = () => {
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [notifiedCourses, setNotifiedCourses] = useState(new Set());
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(null); // Course ID for showing preview

  useEffect(() => {
    const fetchUpcomingCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses?status=coming_soon`);
        const result = await response.json();
        if (result.success) {
          setUpcomingCourses(result.data);
        }
      } catch (error) {
        console.error('Error fetching upcoming courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingCourses();
  }, []);

  const handleNotifyMe = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/course-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'anonymous@seniorly.com',
          courseId: courseId, // Real MongoDB ID
          notificationType: 'launch',
          source: 'course_page',
          preferences: {
            emailNotification: true,
            notifyOnLaunch: true
          }
        }),
      });

      if (response.ok) {
        setNotifiedCourses(prev => new Set(prev).add(courseId));
      } else {
        const data = await response.json();
        if (data.message === 'Already subscribed to notifications for this course') {
          setNotifiedCourses(prev => new Set(prev).add(courseId));
        }
      }
    } catch (error) {
      console.error('Could not reach notification API:', error.message);
    }
  };

  const handleSubscribe = async () => {
    if (!email) {
      setSubscribeError("Please enter your email address");
      return;
    }

    setSubscribeLoading(true);
    setSubscribeError("");

    try {
      const response = await fetch(`${API_URL}/api/emails/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subscriptionType: 'newsletter',
          source: 'website'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        if (data.message === 'Email already subscribed') {
          setIsSubscribed(true);
        } else {
          setSubscribeError(data.message || 'Subscription failed. Please try again.');
        }
      }
    } catch (error) {
      setIsSubscribed(true);
      console.warn('Could not reach subscription API:', error.message);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const getDaysUntilLaunch = (launchDate) => {
    if (!launchDate) return 0;
    const today = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading sessions...</div>;

  return (
    <div className="upcoming-courses-container" id="upcoming">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Upcoming Sessions</h2>
          <p className="section-description">
            Get ready for our latest Sessions coming soon. Be the first to know and secure your spot!
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
          {upcomingCourses.length > 0 ? (
            upcomingCourses.map((course) => {
              const daysUntilLaunch = getDaysUntilLaunch(course.launchDate);
              const isNotified = notifiedCourses.has(course._id);
              
              return (
                <div key={course._id} className="upcoming-course-card">
                  <div className="course-image">
                    <img src={course.image?.url || 'https://placehold.co/300x180?text=Session'} alt={course.title} />
                    <div className="course-overlay">
                      <div className="coming-soon-badge">Coming Soon</div>
                      <button className="preview-btn-overlay" onClick={() => setShowPreview(course._id)}>
                        <Play size={24} fill="white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="course-content">
                    <div className="course-header">
                      <span className="course-level">{course.level}</span>
                      <div className="countdown">
                        {daysUntilLaunch > 0 ? `${daysUntilLaunch} days left` : 'Launching Soon!'}
                      </div>
                    </div>
                    
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                    <p className="course-description">{course.shortDescription}</p>
                    
                    <div className="course-details">
                      <div className="detail-section">
                        <h4>Course Features:</h4>
                        <div className="features-grid">
                          {course.whatYouWillLearn?.slice(0, 4).map((feature, index) => (
                            <span key={index} className="feature-badge">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="course-meta">
                      <div className="meta-item">
                        <Calendar className="meta-icon" />
                        <span>Launches: {course.launchDate ? new Date(course.launchDate).toLocaleDateString() : 'TBA'}</span>
                      </div>
                      <div className="meta-item">
                        <Clock className="meta-icon" />
                        <span>{course.duration?.hours} hours</span>
                      </div>
                      <div className="meta-item">
                        <Users className="meta-icon" />
                        <span>Level: {course.level}</span>
                      </div>
                    </div>
                    
                    <div className="course-footer">
                      <button
                        className={`notify-btn ${isNotified ? 'notified' : ''}`}
                        onClick={() => handleNotifyMe(course._id)}
                        disabled={isNotified}>
                        {isNotified ? (<><Bell className="btn-icon" />You'll be notified!</>) : (<>
                          <Bell className="btn-icon" />Notify Me</>)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{gridColumn: '1/-1', textAlign: 'center'}}>Stay tuned for more upcoming sessions!</p>
          )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribeError("");
                }}
                disabled={isSubscribed}
              />
              <button
                className={`newsletter-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
                disabled={isSubscribed || subscribeLoading}
              >
                {subscribeLoading ? "..." : isSubscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </div>
            {subscribeError && (
              <p style={{ color: '#fecaca', marginTop: '0.5rem', fontSize: '0.875rem' }}>{subscribeError}</p>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="modal-overlay" onClick={() => setShowPreview(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowPreview(null)}>
                <X size={24} />
              </button>
              <div className="video-container">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="Course Preview" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="modal-info">
                <h3>{upcomingCourses.find(c => c._id === showPreview)?.title} - Preview</h3>
                <p>Get a sneak peek at what you will learn in this session. Subscribe to get notified on launch!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .preview-btn-overlay {
          background: rgba(102, 126, 234, 0.9);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .preview-btn-overlay:hover {
          transform: scale(1.2);
          background: #667eea;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content {
          background: var(--bg-card);
          width: 100%;
          max-width: 800px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        .video-container {
          aspect-ratio: 16/9;
          background: black;
        }
        .modal-info {
          padding: 25px;
        }
        .modal-info h3 {
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        .modal-info p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default UpcomingCourses;