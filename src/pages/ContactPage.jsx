import React, { useState, useEffect } from 'react';
import { api } from '../admin/utils/api.js';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaDirections, 
  FaCheckCircle, 
  FaPaperPlane,
  FaInstagram,
  FaFacebookF
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import CustomDatePicker from '../components/CustomDatePicker';
import './ContactPage.css';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    travelDate: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Save enquiry to MongoDB & trigger email notification (fire-and-forget)
    api.createEnquiry(formState).catch(err => console.warn('Enquiry API save failed:', err.message));
    // Format WhatsApp message to send as fallback
    const waText = `Hi Spot Tours, I am ${formState.name} (${formState.phone}). I want to enquire about trip to ${formState.destination || 'a vacation'} on ${formState.travelDate || 'flexible dates'}. Notes: ${formState.message}`;
    window.open(`https://wa.me/${agencyInfo.whatsappRaw}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">CONNECT WITH US</AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">CONTACT <span>SPOT TOURS &amp; TRAVELS</span></AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">Get in touch for custom holiday packages, flight &amp; train tickets, cab bookings, or visit our Kuniyamuthur office.</AnimatedSection>
        </div>
      </div>

      <div className="container contact-page-container">
        <div className="contact-main-grid">
          {/* Left Column: Direct Info */}
          <AnimatedSection anim="fade-right" className="contact-info-column">
            <h2>OUR <span>OFFICE DETAILS</span></h2>
            <p className="contact-info-desc">
              We are located directly on Palakkad - Coimbatore Road, next to SBI Bank in Kuniyamuthur. Drop in anytime or call for prompt trip quotes!
            </p>

            <div className="contact-info-cards-stack">
              <AnimatedSection anim="fade-up" delay="100" className="c-info-card">
                <div className="c-icon-box"><FaMapMarkerAlt /></div>
                <div>
                  <h4>Office Address</h4>
                  <p>{agencyInfo.address}</p>
                  <span className="c-plus-code">Plus Code: {agencyInfo.plusCode}</span>
                </div>
              </AnimatedSection>

              <AnimatedSection anim="fade-up" delay="200" className="c-info-card">
                <div className="c-icon-box"><FaPhoneAlt /></div>
                <div>
                  <h4>Phone &amp; 24/7 Enquiries</h4>
                  <a href={`tel:${agencyInfo.phoneRaw}`} className="c-phone-link">{agencyInfo.phone}</a>
                  <p className="c-subtext">Instant booking assistance available 24/7</p>
                </div>
              </AnimatedSection>

              <AnimatedSection anim="fade-up" delay="300" className="c-info-card">
                <div className="c-icon-box whatsapp"><FaWhatsapp /></div>
                <div>
                  <h4>WhatsApp Chat</h4>
                  <a 
                    href={`https://wa.me/${agencyInfo.whatsappRaw}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="c-wa-link"
                  >
                    {agencyInfo.whatsapp}
                  </a>
                  <p className="c-subtext">Click to chat directly with a tour specialist</p>
                </div>
              </AnimatedSection>
            </div>

            <div className="contact-social-wrap">
              <h4>Follow Our Travel Adventures</h4>
              <div className="contact-social-row">
                <a href={`https://wa.me/${agencyInfo.whatsappRaw}`} target="_blank" rel="noreferrer" className="c-social-btn wa"><FaWhatsapp /></a>
                <a href="#" className="c-social-btn ig"><FaInstagram /></a>
                <a href="#" className="c-social-btn fb"><FaFacebookF /></a>
                <a href="#" className="c-social-btn tw"><FaXTwitter /></a>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Contact & Enquiry Form */}
          <AnimatedSection anim="fade-left" delay="150" className="contact-form-column">
            <div className="enquiry-card">
              <h2>SEND US AN <span>ENQUIRY</span></h2>
              <p>Fill out this form and our team will get back to you with custom itinerary and pricing within 30 minutes!</p>

              {submitted && (
                <div className="form-success-banner">
                  <FaCheckCircle /> Thank you! Your enquiry has been forwarded. A tour specialist will contact you shortly.
                </div>
              )}

              <form className="main-contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Anand Kumar" 
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="e.g. 095005 51404" 
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. you@gmail.com" 
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Destination of Interest</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ooty, Kerala, Dubai, Bali..." 
                      value={formState.destination}
                      onChange={(e) => setFormState({ ...formState, destination: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Expected Travel Date</label>
                    <CustomDatePicker
                      name="travelDate"
                      value={formState.travelDate}
                      onChange={(e) => setFormState({ ...formState, travelDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Requirements / Message</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about your group size, hotel preferences, or cab requirements..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary form-submit-btn">
                  <FaPaperPlane /> Send Travel Enquiry
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>

        {/* Embedded Google Map */}
        <AnimatedSection anim="fade-up" className="contact-map-wrapper">
          <div className="map-title-row">
            <div>
              <h3>Find Spot Tours & Travels on Map</h3>
              <p>8/95, Palakkad - Coimbatore Rd, near SBI Bank, Pulakadu, Kuniyamuthur, Coimbatore - 641008</p>
            </div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Spot+Tours+and+Travels+Kuniyamuthur+Coimbatore" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary"
            >
              <FaDirections /> Open in Google Maps
            </a>
          </div>

          <div className="map-embed-frame">
            <iframe
              title="Spot Tours Kuniyamuthur Coimbatore Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.890635446059!2d76.9535!3d10.9715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a0f0000001%3A0x1234567890abcdef!2sKuniyamuthur%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactPage;
