import React, { useState } from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="custom-navbar">
      <div className="custom-navbar-container">
        <a className="logo-right" href="#">
          <img
            src="/Logo-removebg-preview.png"
            alt="Logo"
            className="logo-img"
          />
        </a>
        <button
          className="navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggle-icon">&#9776;</span>
        </button>
        <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
          <ul className="custom-navbar-links">
            <li><a href="#">Explore</a></li>
            <li>
              <form className="custom-search-form" role="search">
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
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
          <div className="custom-auth-buttons">
            <a className="custom-login-btn" href="#">Login</a>
            <a className="custom-signup-btn" href="#">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;