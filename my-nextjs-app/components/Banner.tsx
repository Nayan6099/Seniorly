import React, { useState } from 'react';

const slides = [
  '/Slide1.png',
  '/Poster1.jpg',
  '/Poster2.jpg',
  '/Poster3.jpg'
];

const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="banner-slideshow">
      <div className="slideshow-container">
        {slides.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Slide ${idx + 1}`}
            className={`slide${idx === current ? ' active' : ''}`}
            style={{ display: idx === current ? 'block' : 'none' }}
          />
        ))}
        <button className="prev" onClick={prevSlide}>&#10094;</button>
        <button className="next" onClick={nextSlide}>&#10095;</button>
      </div>
      <div className="banner-content">
        <a href="#footer" className="banner-btn" onClick={(e) => { e.preventDefault(); scrollTo('footer'); }}>Contact</a>
        <a href="#webinars" className="banner-btn" onClick={(e) => { e.preventDefault(); scrollTo('webinars'); }}>Explore</a>
      </div>
    </div>
  );
};

export default Banner;