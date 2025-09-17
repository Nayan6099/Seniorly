// import React from 'react';
// import styles from '../styles/Home.module.css';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Banner from '../components/Banner';
// import FreeCourses from '../components/FreeCources';
// import Upcomingcourses from '../components/Upcomingcources';

// const Home: React.FC = () => {
//   return (
//     <div className={styles.container}>
//       <Header />
//       <Banner />
//       <main>
//       <h1 className={styles.title}>Welcome to My Next.js App!</h1>
//       <p className={styles.description}>
//         This is the homepage of your Next.js application.
//       </p>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Home;
import React from 'react';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import FreeCourses from '../components/FreeCources';
import UpcomingCourses from '../components/Upcomingcources';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Banner />
      <main>
        <section className={styles.hero}>
          <h1 className={styles.title}>Transform Your Future with Quality Education</h1>
          <p className={styles.description}>
            Discover world-class courses, expert instructors, and hands-on learning experiences 
            designed to accelerate your career growth.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>Explore Courses</button>
            <button className={styles.secondaryBtn}>Start Free Trial</button>
          </div>
        </section>
        
        <FreeCourses />
        <UpcomingCourses />
        
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose Our Platform?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎓</div>
                <h3>Expert Instructors</h3>
                <p>Learn from industry professionals with years of real-world experience</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📱</div>
                <h3>Mobile Learning</h3>
                <p>Access your courses anywhere, anytime on any device</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏆</div>
                <h3>Certificates</h3>
                <p>Earn industry-recognized certificates upon course completion</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💬</div>
                <h3>Community</h3>
                <p>Join a vibrant community of learners and professionals</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>50,000+</h3>
                <p>Active Students</p>
              </div>
              <div className={styles.statCard}>
                <h3>200+</h3>
                <p>Expert Instructors</p>
              </div>
              <div className={styles.statCard}>
                <h3>500+</h3>
                <p>Courses Available</p>
              </div>
              <div className={styles.statCard}>
                <h3>95%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;