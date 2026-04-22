import React from 'react';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FreeCourses from '../components/FreeCources';
import UpcomingCourses from '../components/Upcomingcources';
import Mentorship from '../components/Mentorship';
import { MessageCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Learn Better, Grow Smarter — You’re in the Right Place!</h1>
            <p className={styles.description}>
              Discover smarter ways to study with curated resources and proven strategies.
              Here, we help you learn efficiently and achieve more with less stress.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryBtn} onClick={() => document.getElementById('webinars')?.scrollIntoView({ behavior: 'smooth' })}>Start Learning</button>
              <button className={styles.secondaryBtn} onClick={() => document.getElementById('upcoming')?.scrollIntoView({ behavior: 'smooth' })}>Upcoming Sessions</button>
            </div>
          </div>
        </section>

        <FreeCourses />
        <UpcomingCourses />
        <Mentorship />

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

        <section className={styles.community}>
          <div className={styles.container}>
            <div className={styles.communityContent}>
              <div className={styles.communityIcon}>
                <MessageCircle size={48} color="#25D366" />
              </div>
              <div className={styles.communityText}>
                <h2>Join Our WhatsApp Community</h2>
                <p>Stay updated with the latest study resources, senior guidance, and live session alerts. Connect with like-minded learners instantly!</p>
              </div>
              <a href="https://chat.whatsapp.com/HAb3c1YWuse5WG24CQxeMv" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                Join Now
              </a>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>150+</h3>
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