import React from 'react';
import { FaCheckCircle, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content animate-slide-up">
            <div className="section-tag">ABOUT OUR AGENCY</div>
            <h2 className="section-title">WHY CHOOSE <span>SPOT TOURS & TRAVELS</span></h2>
            <h3 className="about-subtitle">The Spot For Need's — Creating Memorable Journeys Across the Globe</h3>
            
            <p className="about-text">
              Based in <strong>Kuniyamuthur, Coimbatore</strong> (near SBI Bank, Palakkad - Coimbatore Rd), <strong>Spot Tours and Travels</strong> is your one-stop travel companion for crafting seamless and unforgettable vacations. 
            </p>
            
            <p className="about-text">
              With a stellar <strong>4.7-Star Google Rating (34+ Reviews)</strong>, we take pride in delivering personalized domestic & international holiday packages, romantic honeymoon trips, temple & pilgrimage circuits, reliable cab rentals, and hassle-free flight/train ticketing at the best competitive prices.
            </p>
            
            <div className="about-features-grid">
              <div className="about-feature-item">
                <FaCheckCircle className="feature-icon" />
                <div>
                  <strong>Customized Tour Itineraries</strong>
                  <span>Domestic & International holiday plans tailored to your budget</span>
                </div>
              </div>
              
              <div className="about-feature-item">
                <FaCheckCircle className="feature-icon" />
                <div>
                  <strong>Verified Hotels & Resorts</strong>
                  <span>Comfortable, hygienic stays with top amenities & meals</span>
                </div>
              </div>

              <div className="about-feature-item">
                <FaCheckCircle className="feature-icon" />
                <div>
                  <strong>Clean AC Tourist Vehicles</strong>
                  <span>Sedans, SUVs & Tempo Travelers with experienced drivers</span>
                </div>
              </div>

              <div className="about-feature-item">
                <FaCheckCircle className="feature-icon" />
                <div>
                  <strong>24/7 Dedicated Trip Coordinator</strong>
                  <span>Constant support throughout your trip for complete peace of mind</span>
                </div>
              </div>
            </div>

            <div className="about-action-bar">
              <a href="tel:09500551404" className="btn-primary">
                <FaPhoneAlt /> Call 095005 51404
              </a>
              <div className="about-location-badge">
                <FaMapMarkerAlt /> Kuniyamuthur, Coimbatore
              </div>
            </div>
          </div>
          
          <div className="about-images">
            <div className="img-wrapper main-img">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop" 
                alt="Tropical Holiday Destination" 
              />
              <div className="image-floating-badge">
                <span className="badge-rating">4.7★</span>
                <span className="badge-text">Top Rated in Coimbatore</span>
              </div>
            </div>
            <div className="img-wrapper sub-img">
              <img 
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop" 
                alt="Taj Mahal Tour" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

