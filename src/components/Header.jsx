import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaBars, 
  FaTimes, 
  FaMapMarkedAlt 
} from 'react-icons/fa';
import { useData } from '../context/DataContext';
import logoImg from '../assets/logo.jpg';
import './Header.css';

const Header = () => {
  const { agencyInfo } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change & unlock scroll
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location.pathname]);

  // Lock body scroll and blur full page when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'About Us', path: '/about' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          {/* Brand Logo & Clean Title */}
          <Link to="/" className="brand-logo">
            <img src={logoImg} alt="Spot Tours and Travels Logo" className="brand-logo-img" />
            <span className="brand-name">SPOT TOURS & TRAVELS</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <a 
              href={`tel:${agencyInfo.phoneRaw}`} 
              className="header-phone-icon-btn" 
              title={`Call Spot Tours: ${agencyInfo.phone}`}
              aria-label={`Call ${agencyInfo.phone}`}
            >
              <FaPhoneAlt />
            </a>

            <Link to="/packages" className="btn-primary header-book-btn">
              <FaMapMarkedAlt /> Book Tour
            </Link>

            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Full Page Blur & Dim Overlay across entire screen */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-brand-box">
            <img src={logoImg} alt="Spot Tours Logo" className="mobile-logo-img" />
            <span className="mobile-logo-text">SPOT TOURS & TRAVELS</span>
          </div>
          <button 
            className="mobile-close-btn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-drawer-footer">
          <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-secondary mobile-drawer-call">
            <FaPhoneAlt /> Call {agencyInfo.phone}
          </a>
          <a 
            href={`https://wa.me/${agencyInfo.whatsappRaw}`} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-whatsapp mobile-drawer-wa"
          >
            <FaWhatsapp /> WhatsApp Enquire
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
