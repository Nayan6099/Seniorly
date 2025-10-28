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
          <h1 className={styles.title}>Learn Better, Grow Smarter — You’re in the Right Place!</h1>
          <p className={styles.description}>
            Discover smarter ways to study with curated resources and proven strategies.
Here, we help you learn efficiently and achieve more with less stress.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>Start</button>
            <button className={styles.secondaryBtn}>Upcoming</button>
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
                <h3>Academic & Professional</h3>
                <p>Your one-stop destination for Smart study methods and senior guidance.
Because learning the right way makes all the difference.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📱</div>
                <h3>Inspiring & Vision-Driven</h3>
                <p>Seniorly is here to help you study better, not harder.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏆</div>
                <h3>Certificates</h3>
                <p>Earn certificates upon tasks completion</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💬</div>
                <h3>Community</h3>
                <p>Join a vibrant community of learners , professionals and seniors</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>50+</h3>
                <p>Active Students</p>
              </div>
              <div className={styles.statCard}>
                <h3>20+</h3>
                <p>Expert Seniors</p>
              </div>
              <div className={styles.statCard}>
                <h3>24hrs</h3>
                <p>Availability</p>
              </div>
              <div className={styles.statCard}>
                <h3>95%</h3>
                <p>Networking Rate</p>
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