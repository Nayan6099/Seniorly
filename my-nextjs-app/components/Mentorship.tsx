import React from 'react';
import { UserCheck, Calendar, Award, MessageSquare } from 'lucide-react';

const mentors = [
  {
    id: 1,
    name: 'Er. Nayan Mishra',
    role: 'Full Stack Developer',
    specialty: 'web3',
    experience: '1+ Years',
    image: 'https://placehold.co/150x150?text=NM',
    bio: 'Expert in medical education and research methodology. Helping students excel in competitive exams.'
  },
  {
    id: 2,
    name: 'Er. Mukul Pundir',
    role: 'AI/ML Engineer',
    specialty: 'AI/ML',
    experience: '1+ Years',
    image: 'https://placehold.co/150x150?text=PS',
    bio: 'Industry professional specializing in React and Node.js. Guided 500+ students into top tech companies.'
  },
  {
    id: 3,
    name: 'Er. Sakshi Tripathi ',
    role: 'Devops Engineer & Web Developer',
    specialty: 'Devops',
    experience: '1+ Years',
    image: 'https://placehold.co/150x150?text=RK',
    bio: 'Strategic career planning and interview preparation expert for global opportunities.'
  }
];

const Mentorship: React.FC = () => {
  return (
    <section className="mentorship-section" id="mentorship">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Senior Mentorship Portal</h2>
          <p className="section-description">
            Connect with experienced seniors and industry experts for personalized guidance on your learning journey.
          </p>
        </div>

        <div className="mentors-grid">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-image-container">
                <img src={mentor.image} alt={mentor.name} className="mentor-image" />
                <div className="mentor-badge">
                  <UserCheck size={14} />
                  <span>Verified</span>
                </div>
              </div>

              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <p className="mentor-role">{mentor.role}</p>

                <div className="mentor-stats">
                  <div className="mentor-stat">
                    <Award size={16} />
                    <span>{mentor.experience} Exp.</span>
                  </div>
                  <div className="mentor-stat">
                    <MessageSquare size={16} />
                    <span>{mentor.specialty}</span>
                  </div>
                </div>

                <p className="mentor-bio">{mentor.bio}</p>

                <button className="book-session-btn">
                  <Calendar size={18} />
                  <span>Book 1-on-1 Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mentorship-section {
          padding: 80px 0;
          background: var(--bg-secondary);
        }
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .section-title {
          font-size: 2.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        .section-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }
        .mentors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .mentor-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 30px;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .mentor-card:hover {
          transform: translateY(-10px);
        }
        .mentor-image-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
        }
        .mentor-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent-primary);
        }
        .mentor-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
        }
        .mentor-info {
          text-align: center;
        }
        .mentor-info h3 {
          color: var(--text-primary);
          margin-bottom: 5px;
          font-size: 1.25rem;
        }
        .mentor-role {
          color: var(--accent-primary);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }
        .mentor-stats {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        .mentor-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .mentor-bio {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .book-session-btn {
          width: 100%;
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .book-session-btn:hover {
          background: var(--accent-secondary);
        }
        @media (max-width: 768px) {
          .mentorship-section {
            padding: 40px 0;
          }
          .section-title {
            font-size: 2rem;
          }
          .mentors-grid {
            grid-template-columns: 1fr;
            padding: 0 20px;
          }
          .mentor-card {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default Mentorship;
