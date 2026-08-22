import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaShieldAlt, 
  FaAward, 
  FaUserCheck, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaCarSide, 
  FaHandshake, 
  FaCheck 
} from 'react-icons/fa';
import { teamMembers, agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import './AboutPage.css';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">ABOUT OUR AGENCY</AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">SPOT TOURS <span>&amp; TRAVELS</span></AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">The Spot For Need's — Coimbatore's Most Trusted Travel Companion for Domestic &amp; Overseas Holidays</AnimatedSection>
        </div>
      </div>

      <div className="container about-page-container">
        {/* Story Grid */}
        <div className="about-story-grid">
          <AnimatedSection anim="fade-right" className="story-content">
            <div className="section-tag">OUR JOURNEY</div>
            <h2>CREATING MEMORIES <span>THAT LAST A LIFETIME</span></h2>
            <p className="story-lead">
              Founded on the belief that travel should be enriching, transparent, and completely stress-free, <strong>Spot Tours and Travels</strong> has grown into one of Coimbatore's premier travel agencies and tour operators.
            </p>
            <p>
              Located conveniently on <strong>Palakkad - Coimbatore Road (near SBI Bank, Pulakadu, Kuniyamuthur)</strong>, we specialize in organizing customized family vacations, romantic honeymoons, spiritual temple pilgrimages, corporate outings, and reliable 24/7 outstation tourist cab rentals.
            </p>
            <p>
              Under our brand promise <em>"The Spot For Need's"</em>, we take care of every minute detail: flight/train ticketing, star hotel reservations, local sightseeing with experienced polite chauffeurs, and dedicated trip coordinator assistance.
            </p>

            <div className="story-highlights-list">
              <div><FaCheck className="check-icon" /> 100% Customized Itineraries to match your budget</div>
              <div><FaCheck className="check-icon" /> Transparent, upfront pricing with zero hidden surcharges</div>
              <div><FaCheck className="check-icon" /> Handpicked 3-Star, 4-Star &amp; 5-Star verified hygienic resorts</div>
              <div><FaCheck className="check-icon" /> Well-maintained AC Sedans, Innovas, and Tempo Travelers</div>
            </div>
          </AnimatedSection>

          <AnimatedSection anim="fade-left" delay="150" className="story-image-wrap">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop" 
              alt="Spot Tours and Travels Office and Travel Experience" 
            />
            <div className="story-floating-stat">
              <span className="stat-score">4.7★</span>
              <span className="stat-text">Google Rating (34+ Reviews)</span>
            </div>
          </AnimatedSection>
        </div>

        {/* Credentials & Trust Badges */}
        <div className="credentials-section">
          <AnimatedSection anim="fade-up">
            <div className="section-tag">OUR CREDENTIALS</div>
            <h2 className="section-title">WHY TRAVELERS <span>TRUST SPOT TOURS</span></h2>
          </AnimatedSection>

          <div className="credentials-grid">
            <AnimatedSection anim="flip-up" delay="100" className="credential-card">
              <FaAward className="credential-icon" />
              <h3>4.7 Google Rating</h3>
              <p>Consistently rated 4.7 stars across 34+ verified customer reviews for top-notch service and punctuality.</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="200" className="credential-card">
              <FaShieldAlt className="credential-icon" />
              <h3>Licensed Tour Operator</h3>
              <p>Government-registered travel agency with commercial passenger transport permits and safety assurance.</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="300" className="credential-card">
              <FaHandshake className="credential-icon" />
              <h3>Transparent Pricing</h3>
              <p>Clear, itemized billing including tolls, driver allowances, and taxes with zero surprise charges.</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="400" className="credential-card">
              <FaUserCheck className="credential-icon" />
              <h3>Senior &amp; Family Care</h3>
              <p>Special pacing, ground-floor room allocations, and patient drivers trained for elder comfort.</p>
            </AnimatedSection>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="team-section">
          <AnimatedSection anim="fade-up">
            <div className="section-tag">TRAVEL EXPERTS</div>
            <h2 className="section-title">MEET OUR <span>TOUR SPECIALISTS</span></h2>
            <p className="team-intro">
              Our Coimbatore team of experienced travel planners brings decades of combined tourism knowledge to make your holiday seamless.
            </p>
          </AnimatedSection>

          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <AnimatedSection key={idx} anim="zoom-in" delay={String((idx % 4) * 100 + 100)} className="team-card">
                <div className="team-img-wrap">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <span className="team-exp"><FaStar className="gold-star-inline" /> {member.experience}</span>
                  <p className="team-speciality">{member.speciality}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <AnimatedSection anim="zoom-in" dur="slow" className="about-cta-card">
          <h2>Ready to plan your next journey with Spot Tours?</h2>
          <p>Visit our Kuniyamuthur office or give us a call today for personalized advice and instant holiday quotes.</p>
          <div className="about-cta-btns">
            <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-primary">
              <FaPhoneAlt /> Call {agencyInfo.phone}
            </a>
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20would%20like%20to%20plan%20a%20vacation`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AboutPage;

