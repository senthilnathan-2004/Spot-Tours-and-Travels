import React from 'react';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-content">
            <div className="section-tag">GET IN TOUCH</div>
            <h2 className="section-title">START PLANNING YOUR <span>DREAM VACATION</span></h2>
            <p className="contact-text">
              Have questions about tour packages, custom itineraries, flight tickets, or vehicle rentals? Reach out to our Coimbatore travel specialists today via WhatsApp, Call, or visit our office.
            </p>

            <div className="contact-quick-info">
              <a href="tel:09500551404" className="quick-info-box">
                <div className="info-icon"><FaPhoneAlt /></div>
                <div className="info-text">
                  <span>Direct Call</span>
                  <strong>095005 51404</strong>
                </div>
              </a>

              <a 
                href="https://wa.me/919500551404?text=Hi%20Spot%20Tours%20and%20Travels,%20I%20would%20like%20to%20plan%20a%20trip" 
                target="_blank" 
                rel="noreferrer" 
                className="quick-info-box whatsapp-box"
              >
                <div className="info-icon whatsapp-icon"><FaWhatsapp /></div>
                <div className="info-text">
                  <span>Chat on WhatsApp</span>
                  <strong>+91 95005 51404</strong>
                </div>
              </a>

              <div className="quick-info-box">
                <div className="info-icon"><FaMapMarkerAlt /></div>
                <div className="info-text">
                  <span>Office Location</span>
                  <strong>Kuniyamuthur, Coimbatore</strong>
                </div>
              </div>
            </div>
            
            <div className="social-connect-bar">
              <span className="social-label">Connect with us:</span>
              <div className="social-buttons">
                <a 
                  href="https://wa.me/919500551404" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn whatsapp" 
                  title="WhatsApp"
                >
                  <span className="icon"><FaWhatsapp /></span>
                </a>
                <a href="tel:09500551404" className="social-btn phone" title="Call Us">
                  <span className="icon"><FaPhoneAlt /></span>
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="social-btn instagram" title="Instagram">
                  <span className="icon"><FaInstagram /></span>
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="social-btn facebook" title="Facebook">
                  <span className="icon"><FaFacebookF /></span>
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="social-btn twitter" title="X (Twitter)">
                  <span className="icon"><FaXTwitter /></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

