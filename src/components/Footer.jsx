import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebookF, FaStar } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useData } from '../context/DataContext';
import logoImg from '../assets/logo.jpg';
import AnimatedSection from './AnimatedSection';
import './Footer.css';

const Footer = () => {
  const { agencyInfo, content } = useData();
  const agency = content?.agency || {};
  return (
    <footer className="footer">
      <div className="container footer-content">
        <AnimatedSection anim="fade-right" className="footer-brand">
          <div className="footer-logo">
            <img src={logoImg} alt="Spot Tours Logo" className="footer-logo-img" />
            <span>SPOT <strong>TOURS & TRAVELS</strong></span>
          </div>
          <p className="footer-tagline">
            <strong>The Spot For Need's</strong> — Coimbatore's premier travel agency for customized domestic & international tour packages, hotel reservations, flight ticketing, and comfortable cab rentals.
          </p>
          <div className="footer-rating-badge">
            <FaStar className="footer-gold-star" /> <strong>4.7 / 5.0 Rating</strong> on Google (34+ Happy Travelers)
          </div>
        </AnimatedSection>

        <AnimatedSection anim="fade-up" delay="200" className="footer-links">
          <h3>Explore Website</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/packages">Tour Packages</Link></li>
            <li><Link to="/destinations">Popular Destinations</Link></li>
            <li><Link to="/about">About Agency & Team</Link></li>
            <li><Link to="/reviews">Customer Reviews (4.7★)</Link></li>
            <li><Link to="/blog">Travel Blog & Guides</Link></li>
            <li><Link to="/contact">Contact Office & Map</Link></li>
          </ul>
        </AnimatedSection>

        <AnimatedSection anim="fade-left" delay="300" className="footer-contact-info">
          <h3>Coimbatore Office</h3>
          <p className="footer-address">
            <FaMapMarkerAlt className="footer-icon" />
            <span>{agencyInfo.address}</span>
          </p>
          <p className="footer-phone">
            <FaPhoneAlt className="footer-icon" />
            <a href={`tel:${agencyInfo.phoneRaw}`}>{agencyInfo.phone}</a>
          </p>
          <p className="footer-whatsapp">
            <FaWhatsapp className="footer-icon" />
            <a href={`https://wa.me/${agencyInfo.whatsappRaw}`} target="_blank" rel="noreferrer">{agencyInfo.whatsapp}</a>
          </p>
          <p className="footer-hours">
            <strong>Hours:</strong> {agencyInfo.workingHours.weekdays}
          </p>

          <div className="social-icons">
            <a href={`https://wa.me/${agencyInfo.whatsappRaw}`} target="_blank" rel="noreferrer" className="social-icon whatsapp-icon" title="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="#" className="social-icon" title="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon" title="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon" title="X (Twitter)">
              <FaXTwitter />
            </a>
          </div>
        </AnimatedSection>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Spot Tours and Travels (The Spot For Need's). All Rights Reserved.</p>
          <p className="footer-sub-text">8/95, Palakkad - Coimbatore Rd, Kuniyamuthur, Coimbatore • {agencyInfo.phone}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
