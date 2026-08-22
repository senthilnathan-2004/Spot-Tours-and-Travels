import React from 'react';
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaDirections, FaCheckCircle } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import './MapSection.css';

const MapSection = () => {
  return (
    <section id="location" className="map-section">
      <div className="container">
        <div className="map-container">
          <AnimatedSection anim="fade-right" className="map-info">
            <div className="section-tag">VISIT OUR OFFICE</div>
            <h2>FIND <span>US IN COIMBATORE</span></h2>
            
            <div className="address-box">
              <div className="address-header">
                <FaMapMarkerAlt className="map-pin-icon" />
                <div>
                  <strong>Spot Tours and Travels</strong>
                  <span className="plus-code">Plus Code: XX53+GJ Coimbatore, Tamil Nadu</span>
                </div>
              </div>
              <p className="address-text">
                8/95, Palakkad - Coimbatore Rd,<br />
                near SBI Bank, Pulakadu, Kuniyamuthur,<br />
                Coimbatore, Tamil Nadu 641008
              </p>
            </div>

            <div className="info-row">
              <div className="info-block">
                <div className="info-title">
                  <FaClock className="info-icon-small" /> Working Hours
                </div>
                <p className="info-desc">
                  <strong>Mon - Sat:</strong> 9:00 AM – 8:30 PM<br />
                  <strong>Sunday:</strong> 9:00 AM – 2:00 PM<br />
                  <span className="status-open">Opens 9:00 AM</span>
                </p>
              </div>

              <div className="info-block">
                <div className="info-title">
                  <FaPhoneAlt className="info-icon-small" /> Phone & WhatsApp
                </div>
                <p className="info-desc">
                  <strong>095005 51404</strong><br />
                  <span>Available for 24/7 tour enquiry</span>
                </p>
              </div>
            </div>

            <div className="map-action-row">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Spot+Tours+and+Travels+Kuniyamuthur+Coimbatore" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-primary map-btn"
              >
                <FaDirections /> Get Directions
              </a>
              <a 
                href="tel:09500551404" 
                className="btn-secondary map-call-btn"
              >
                <FaPhoneAlt /> Call Office
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection anim="fade-left" delay="200" className="map-frame">
            <iframe
              title="Spot Tours and Travels Kuniyamuthur Coimbatore Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.890635446059!2d76.9535!3d10.9715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a0f0000001%3A0x1234567890abcdef!2sKuniyamuthur%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

