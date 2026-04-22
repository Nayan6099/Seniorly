import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="footer-container" id="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-info">
          {/* <img src="/Logo-removebg-preview.png" alt="Seniorly Logo" className="footer-logo" /> */}
          <p>Helping you study better, grow smarter, and achieve more with senior guidance.</p>
        </div>

        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <ul>
            <li><MapPin size={18} /> New Delhi, India (Online Global)</li>
            <li><Mail size={18} /> seniorlyofficial@gmail.com</li>
            <li><Phone size={18} /> +91 9871040470</li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#webinars">Explore Webinars</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} With love from Team Seniorly</p>
      </div>
    </div>

    <style jsx>{`
      .footer-container {
        background: var(--bg-secondary);
        padding: 4rem 0 2rem;
        border-top: 1px solid var(--border-color);
        margin-top: 5rem;
        transition: background-color 0.3s ease;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
      }
      .footer-logo {
        height: 40px;
        margin-bottom: 1rem;
      }
      .footer-info p {
        color: var(--text-secondary);
        max-width: 300px;
      }
      .footer-contact h3, .footer-links h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
      }
      .footer-contact ul, .footer-links ul {
        list-style: none;
        padding: 0;
      }
      .footer-contact li {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-secondary);
        margin-bottom: 1rem;
      }
      .footer-links a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.2s;
        display: block;
        margin-bottom: 0.75rem;
      }
      .footer-links a:hover {
        color: var(--accent-primary);
      }
      .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
      @media (max-width: 768px) {
        .footer-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }
    `}</style>
  </footer>
);

export default Footer;