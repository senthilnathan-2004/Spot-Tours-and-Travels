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
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import './AboutPage.css';

const AboutPage = () => {
  const { teamMembers, agencyInfo, content } = useData();
  const about = content?.about || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">
            {about.page_tag || "ABOUT OUR AGENCY"}
          </AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">
            {about.page_title || "SPOT TOURS & TRAVELS"}
          </AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">
            {about.page_subtitle || "The Spot For Need's — Coimbatore's Most Trusted Travel Companion for Domestic & Overseas Holidays"}
          </AnimatedSection>
        </div>
      </div>

      <div className="container about-page-container">
        {/* Story Grid */}
        <div className="about-story-grid">
          <AnimatedSection anim="fade-right" className="story-content">
            <div className="section-tag">{about.journey_tag || "OUR JOURNEY"}</div>
            <h2>{about.journey_title || "CREATING MEMORIES THAT LAST A LIFETIME"}</h2>
            <p className="story-lead">
              {about.lead_paragraph || "Founded on the belief that travel should be enriching, transparent, and completely stress-free, Spot Tours and Travels has grown into one of Coimbatore's premier travel agencies and tour operators."}
            </p>
            <p>
              {about.story_paragraph_1 || "Located conveniently on Palakkad - Coimbatore Road (near SBI Bank, Pulakadu, Kuniyamuthur), we specialize in organizing customized family vacations, romantic honeymoons, spiritual temple pilgrimages, corporate outings, and reliable 24/7 outstation tourist cab rentals."}
            </p>
            <p>
              {about.story_paragraph_2 || "Under our brand promise 'The Spot For Need's', we take care of every minute detail: flight/train ticketing, star hotel reservations, local sightseeing with experienced polite chauffeurs, and dedicated trip coordinator assistance."}
            </p>

            <div className="story-highlights-list">
              <div><FaCheck className="check-icon" /> {about.highlight_1 || "100% Customized Itineraries to match your budget"}</div>
              <div><FaCheck className="check-icon" /> {about.highlight_2 || "Transparent, upfront pricing with zero hidden surcharges"}</div>
              <div><FaCheck className="check-icon" /> {about.highlight_3 || "Handpicked 3-Star, 4-Star & 5-Star verified hygienic resorts"}</div>
              <div><FaCheck className="check-icon" /> {about.highlight_4 || "Well-maintained AC Sedans, Innovas, and Tempo Travelers"}</div>
            </div>
          </AnimatedSection>

          <AnimatedSection anim="fade-left" delay="150" className="story-image-wrap">
            <img 
              src={about.office_photo || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop"} 
              alt="Spot Tours and Travels Office and Travel Experience" 
            />
            <div className="story-floating-stat">
              <span className="stat-score">{about.floating_stat_score || "4.7★"}</span>
              <span className="stat-text">{about.floating_stat_text || "Google Rating (34+ Reviews)"}</span>
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
              <h3>{about.credential_1_title || "4.7 Google Rating"}</h3>
              <p>{about.credential_1_desc || "Consistently rated 4.7 stars across 34+ verified customer reviews for top-notch service and punctuality."}</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="200" className="credential-card">
              <FaShieldAlt className="credential-icon" />
              <h3>{about.credential_2_title || "Licensed Tour Operator"}</h3>
              <p>{about.credential_2_desc || "Government-registered travel agency with commercial passenger transport permits and safety assurance."}</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="300" className="credential-card">
              <FaHandshake className="credential-icon" />
              <h3>{about.credential_3_title || "Transparent Pricing"}</h3>
              <p>{about.credential_3_desc || "Clear, itemized billing including tolls, driver allowances, and taxes with zero surprise charges."}</p>
            </AnimatedSection>

            <AnimatedSection anim="flip-up" delay="400" className="credential-card">
              <FaUserCheck className="credential-icon" />
              <h3>{about.credential_4_title || "Senior & Family Care"}</h3>
              <p>{about.credential_4_desc || "Special pacing, ground-floor room allocations, and patient drivers trained for elder comfort."}</p>
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
            {(teamMembers || []).map((member, idx) => (
              <AnimatedSection key={member._id || member.id || idx} anim="zoom-in" delay={String((idx % 4) * 100 + 100)} className="team-card">
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
