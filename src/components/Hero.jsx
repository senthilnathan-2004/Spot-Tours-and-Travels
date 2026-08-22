import React, { useState, useEffect } from 'react';
import { FaStar, FaPlane, FaPlaneDeparture, FaMapMarkedAlt, FaWhatsapp } from 'react-icons/fa';
import './Hero.css';

const CountUpNumber = ({ target, duration = 2000, decimals = 0, suffix = '' }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(easeOut * target);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    const timer = setTimeout(() => {
      frameId = requestAnimationFrame(step);
    }, 250);

    return () => {
      clearTimeout(timer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return (
    <>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container hero-content animate-slide-up">
        <div className="hero-badge">
          <FaPlaneDeparture className="hero-badge-icon" />
          <span>Coimbatore's Premier Travel Partner</span>
        </div>

        <h1 className="hero-title">
          EXPLORE THE WORLD WITH <br />
          <span className="text-glow">SPOT TOURS & TRAVELS</span>
        </h1>
        
        <p className="hero-subtitle">
          Experience unforgettable journeys with customized domestic & international tour packages, comfortable hotel stays, hassle-free ticketing, and dedicated 24/7 travel support.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-star-group">
              <span className="stat-number">
                <CountUpNumber target={4.7} decimals={1} duration={2000} />
              </span>
              <div className="star-icons">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
            <span className="stat-label">Google Rating (34 Reviews)</span>
          </div>

          <div className="stat">
            <span className="stat-number">
              <CountUpNumber target={100} decimals={0} suffix="+" duration={2000} />
            </span>
            <span className="stat-label">Tour Destinations</span>
          </div>

          <div className="stat">
            <span className="stat-number">
              <CountUpNumber target={100} decimals={0} suffix="%" duration={2000} />
            </span>
            <span className="stat-label">Customized Itineraries</span>
          </div>
        </div>

        <div className="hero-cta-group">
          <a href="#membership" className="btn-primary hero-btn">
            <FaMapMarkedAlt /> Explore Tour Packages
          </a>
          <a 
            href="https://wa.me/919500551404?text=Hi%20Spot%20Tours%20and%20Travels,%20I%20would%20like%20to%20enquire%20about%20tour%20packages" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-whatsapp hero-whatsapp-btn"
          >
            <FaWhatsapp /> WhatsApp Enquire
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

