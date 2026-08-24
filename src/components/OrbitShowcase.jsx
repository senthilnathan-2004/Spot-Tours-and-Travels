import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaPlay, 
  FaPause, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCompass 
} from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from './AnimatedSection';
import './OrbitShowcase.css';

const showcaseDestinations = [
  {
    id: "kerala-backwaters-munnar",
    name: "Alleppey & Munnar",
    state: "Kerala, India",
    tag: "Backwaters & Tea Hills",
    price: "₹12,499",
    rating: "4.9",
    category: "Nature & Honeymoon",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "dubai-desert-safari-delight",
    name: "Dubai & Abu Dhabi",
    state: "United Arab Emirates",
    tag: "Skyline & Desert Safari",
    price: "₹38,999",
    rating: "4.8",
    category: "International Luxury",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "ooty-kodaikanal-getaway",
    name: "Ooty & Kodaikanal",
    state: "Tamil Nadu, India",
    tag: "Queen of Hill Stations",
    price: "₹7,499",
    rating: "4.9",
    category: "Cool Hill Station",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "bali-tropical-paradise",
    name: "Bali Island",
    state: "Indonesia",
    tag: "Beaches & Waterfalls",
    price: "₹34,999",
    rating: "4.9",
    category: "Tropical Paradise",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "goa-beach-party-retreat",
    name: "Goa Beach Resort",
    state: "Goa, India",
    tag: "Beaches & Water Sports",
    price: "₹8,999",
    rating: "4.7",
    category: "Friends & Beach",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "rameswaram-madurai-spiritual",
    name: "Rameswaram & Madurai",
    state: "Tamil Nadu, India",
    tag: "Sacred Heritage Circuit",
    price: "₹6,999",
    rating: "4.8",
    category: "Spiritual Pilgrimage",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "malaysia-singapore-combo",
    name: "Kuala Lumpur & Genting",
    state: "Malaysia",
    tag: "Twin Towers & Theme Parks",
    price: "₹29,999",
    rating: "4.8",
    category: "International Holiday",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "wayanad-wildlife-escape",
    name: "Wayanad & Kabini",
    state: "Kerala, India",
    tag: "Rainforest & Waterfalls",
    price: "₹6,499",
    rating: "4.7",
    category: "Wildlife & Forest",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop"
  }
];

const OrbitShowcase = () => {
  const { content } = useData();
  const sc = content?.showcases || {};

  const [isPaused, setIsPaused] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const navigate = useNavigate();

  const totalCards = showcaseDestinations.length;

  const handleCardClick = (dest) => {
    navigate(`/package/${dest.id}`);
  };

  const handleNudge = (direction) => {
    setRotationOffset((prev) => prev + direction * (360 / totalCards));
  };

  return (
    <section className="orbit-showcase-section">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection anim="fade-up" className="section-header-left orbit-header-left">
          <div className="section-tag orbit-tag">
            <FaCompass className="orbit-tag-icon" /> {sc.orbit_tag || "360° IMMERSIVE EXPLORER"}
          </div>
          <h2 className="section-title section-title-left">
            {sc.orbit_title ? (
              (() => {
                const words = sc.orbit_title.trim().split(' ');
                if (words.length <= 1) return sc.orbit_title;
                const splitIdx = Math.ceil(words.length / 2);
                return <>{words.slice(0, splitIdx).join(' ')} <span>{words.slice(splitIdx).join(' ')}</span></>;
              })()
            ) : (
              <>DISCOVER THE WORLD IN <span>360° ORBIT</span></>
            )}
          </h2>
          <p className="section-subtitle">
            {sc.orbit_subtitle || "Glide through iconic global wonders. Hover over any destination card to pause the orbit and explore trip details."}
          </p>
        </AnimatedSection>
      </div>

      {/* Orbit Stage (180° visible arc window) */}
      <div 
        className="orbit-stage-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Glowing Rings & Atmosphere */}
        <div className="orbit-ambient-glow"></div>
        <div className="orbit-decorative-ring ring-outer"></div>
        <div className="orbit-decorative-ring ring-inner"></div>
        <div className="orbit-horizon-line"></div>

        {/* Center Hub Display */}
        <div className="orbit-center-hub">
          <div className="hub-pulse-core"></div>
          <div className="hub-inner-badge">
            <span className="hub-tag">180° PANORAMA</span>
            <span className="hub-title">SPOT TOURS</span>
          </div>
        </div>

        {/* 360 Degree Infinite Rotating Wheel */}
        <div 
          className={`orbit-wheel ${isPaused ? 'is-paused' : ''}`}
          style={{
            '--user-offset': `${rotationOffset}deg`,
            '--animation-state': isPaused ? 'paused' : 'running'
          }}
        >
          {showcaseDestinations.map((dest, idx) => {
            const angle = (idx * 360) / totalCards;
            return (
              <div
                key={dest.id}
                className="orbit-card-slot"
                style={{
                  '--slot-angle': `${angle}deg`
                }}
              >
                {/* Counter-rotating card container to keep content upright */}
                <div 
                  className={`orbit-card-container ${activeCardIndex === idx ? 'is-focused' : ''}`}
                  onMouseEnter={() => setActiveCardIndex(idx)}
                  onMouseLeave={() => setActiveCardIndex(null)}
                  onClick={() => handleCardClick(dest)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View tour package for ${dest.name}`}
                >
                  <div className="orbit-card-media">
                    <img src={dest.image} alt={dest.name} loading="lazy" />
                    <div className="orbit-card-overlay"></div>
                    <span className="orbit-category-pill">{dest.category}</span>
                    <span className="orbit-rating-pill">
                      <FaStar className="orbit-star-icon" /> {dest.rating}
                    </span>
                  </div>

                  <div className="orbit-card-info">
                    <span className="orbit-dest-state">
                      <FaMapMarkerAlt /> {dest.state}
                    </span>
                    <h3 className="orbit-dest-title">{dest.name}</h3>
                    <p className="orbit-dest-tag">{dest.tag}</p>

                    <div className="orbit-card-footer">
                      <div className="orbit-price-box">
                        <span className="orbit-price-label">Starting</span>
                        <strong className="orbit-price-val">{dest.price}</strong>
                      </div>
                      <button 
                        type="button" 
                        className="orbit-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(dest);
                        }}
                      >
                        Explore <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Bottom Control Toolbar */}
        <div className="orbit-controls-toolbar">
          <button 
            type="button" 
            className="orbit-control-btn" 
            onClick={() => handleNudge(-1)}
            aria-label="Rotate Orbit Counter-Clockwise"
            title="Rotate Left"
          >
            <FaChevronLeft />
          </button>

          <button 
            type="button" 
            className={`orbit-control-btn orbit-play-btn ${isPaused ? 'paused' : 'playing'}`}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume 360 Rotation" : "Pause 360 Rotation"}
            title={isPaused ? "Resume Rotation" : "Pause Rotation"}
          >
            {isPaused ? <FaPlay /> : <FaPause />}
            <span className="play-btn-text">{isPaused ? 'Resume Orbit' : 'Pause Orbit'}</span>
          </button>

          <button 
            type="button" 
            className="orbit-control-btn" 
            onClick={() => handleNudge(1)}
            aria-label="Rotate Orbit Clockwise"
            title="Rotate Right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrbitShowcase;
