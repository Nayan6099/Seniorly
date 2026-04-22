import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="custom-navbar-container">
        <Link href="/" legacyBehavior>
          <a className="logo-right">
            <img
              src="/Logo-removebg-preview.png"
              alt="Logo"
              className="logo-img"
            />
          </a>
        </Link>
        <button
          className="navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggle-icon">&#9776;</span>
        </button>
        <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
          <ul className="custom-navbar-links">
            <li><a href="#webinars" onClick={(e) => { e.preventDefault(); scrollTo('webinars'); }}>Explore</a></li>
            <li>
              <form className="custom-search-form" role="search" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="custom-search-input"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="custom-search-btn" type="submit">
                  Search
                </button>
              </form>
            </li>
            <li>
              <Link href="/" legacyBehavior>
                <a>Home</a>
              </Link>
            </li>
            <li><a href="#footer" onClick={(e) => { e.preventDefault(); scrollTo('footer'); }}>Contact</a></li>
          </ul>
          <div className="custom-auth-buttons">
            {user ? (
              <div className="user-profile-nav">
                <span className="welcome-text">Hi, {user.firstName}</span>
                <button className="custom-logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link href="/login" legacyBehavior>
                  <a className="custom-login-btn">Login</a>
                </Link>
                <Link href="/signup" legacyBehavior>
                  <a className="custom-signup-btn">Sign Up</a>
                </Link>
              </>
            )}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 10px;
        }
        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(15deg);
        }
        .user-profile-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .welcome-text {
          font-weight: 500;
          color: white;
        }
        .custom-logout-btn {
          background: #ef4444;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .custom-logout-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </nav>
  );
};

export default Header;