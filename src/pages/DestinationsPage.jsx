import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaCheck, 
  FaInfoCircle, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaArrowRight,
  FaTimes
} from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import './DestinationsPage.css';

const DestinationsPage = () => {
  const { destinations: destinationsList, agencyInfo, content } = useData();
  const destContent = content?.destinations_page || {};

  const [searchParams] = useSearchParams();
  const initialSelectedId = searchParams.get('selected');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalDest, setActiveModalDest] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialSelectedId && destinationsList?.length) {
      const found = destinationsList.find(d => d.id === initialSelectedId);
      if (found) setActiveModalDest(found);
    }
  }, [initialSelectedId, destinationsList]);

  const categories = ['All', 'Hill Station', 'Beach', 'Spiritual', 'International', 'Heritage', 'Wildlife'];

  const filteredDestinations = selectedCategory === 'All'
    ? (destinationsList || [])
    : (destinationsList || []).filter(d => d.category === selectedCategory);

  return (
    <div className="destinations-page">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">
            {destContent.page_tag || "EXPLORE THE WORLD"}
          </AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">
            {destContent.page_title || "POPULAR DESTINATIONS"}
          </AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">
            {destContent.page_subtitle || "From misty hill tops in the Nilgiris to turquoise tropical waters and grand world heritage sites. Discover your next journey starting from Coimbatore."}
          </AnimatedSection>
        </div>
      </div>

      <div className="container destinations-container">
        {/* Category Tabs */}
        <div className="destination-tabs-bar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`dest-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={(e) => {
                setSelectedCategory(cat);
                e.currentTarget?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
            >
              {cat === 'All' ? 'All Destinations' : cat + 's'}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="destinations-large-grid">
          {filteredDestinations.map((dest, idx) => (
            <AnimatedSection 
              key={dest.id || dest._id} 
              anim="fade-up" 
              delay={String((idx % 3) * 100 + 100)} 
              className="destination-large-card" 
              onClick={() => setActiveModalDest(dest)}
            >
              <div className="dest-image-wrap">
                <img src={dest.banner} alt={dest.name} loading="lazy" />
                <span className="dest-cat-badge">{dest.category}</span>
                <span className="dest-price-pill">From {dest.startingPrice}</span>
              </div>

              <div className="dest-body">
                <div className="dest-location-tag">
                  <FaMapMarkerAlt /> {dest.state}
                </div>
                <h3>{dest.name}</h3>
                {dest.tagline && <p className="dest-tagline">"{dest.tagline}"</p>}
                <p className="dest-desc-snippet">{dest.description ? dest.description.substring(0, 120) + '...' : ''}</p>

                <div className="dest-quick-stats">
                  <div><FaCalendarAlt /> Best Time: <strong>{dest.bestTime}</strong></div>
                  <div><FaClock /> Ideal: <strong>{dest.idealDuration}</strong></div>
                </div>

                <div className="dest-card-action">
                  <button className="btn-primary dest-view-btn">
                    Explore Destination Details <FaArrowRight />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Destination Detail Modal / Drawer */}
      {activeModalDest && (
        <div className="dest-modal-overlay animate-fade" onClick={() => setActiveModalDest(null)}>
          <div className="dest-modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalDest(null)} aria-label="Close">
              <FaTimes />
            </button>

            <div className="modal-banner">
              <img src={activeModalDest.banner} alt={activeModalDest.name} />
              <div className="modal-banner-overlay">
                <span className="dest-cat-badge">{activeModalDest.category}</span>
                <h2>{activeModalDest.name}</h2>
                <p>{activeModalDest.tagline} • {activeModalDest.state}</p>
              </div>
            </div>

            <div className="modal-body-scroll">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span>Best Time to Visit</span>
                  <strong>{activeModalDest.bestTime}</strong>
                </div>
                <div className="modal-info-item">
                  <span>Ideal Trip Duration</span>
                  <strong>{activeModalDest.idealDuration}</strong>
                </div>
                <div className="modal-info-item">
                  <span>Packages Starting</span>
                  <strong>{activeModalDest.startingPrice}</strong>
                </div>
              </div>

              <div className="modal-section">
                <h3>About {activeModalDest.name}</h3>
                <p>{activeModalDest.description}</p>
              </div>

              {activeModalDest.topAttractions && activeModalDest.topAttractions.length > 0 && (
                <div className="modal-section">
                  <h3>Top Attractions & Sightseeing</h3>
                  <div className="attractions-pill-grid">
                    {activeModalDest.topAttractions.map((attr, i) => (
                      <span key={i} className="attr-pill"><FaCheck className="check-icon" /> {attr}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeModalDest.travelTips && (
                <div className="modal-section">
                  <h3>Spot Tours Travel Tips</h3>
                  <div className="travel-tip-box">
                    <FaInfoCircle className="tip-icon" />
                    <p>{activeModalDest.travelTips}</p>
                  </div>
                </div>
              )}

              <div className="modal-cta-box">
                <div className="cta-left">
                  <h4>Ready to travel to {activeModalDest.name}?</h4>
                  <p>Our Coimbatore specialists can customize a private itinerary with hotel and AC cab.</p>
                </div>
                <div className="cta-right">
                  <Link 
                    to={`/packages?destination=${encodeURIComponent(activeModalDest.name)}`}
                    className="btn-primary"
                    onClick={() => setActiveModalDest(null)}
                  >
                    View Tour Packages
                  </Link>
                  <a 
                    href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20am%20interested%20in%20visiting%20${encodeURIComponent(activeModalDest.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp Enquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
