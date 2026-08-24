import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaCamera, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from './AnimatedSection';
import './WaveGalleryScroll.css';

const galleryItems = [
  {
    id: 1,
    location: "Munnar, Kerala",
    title: "Misty Tea Plantations",
    tag: "Nature & Hills",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 2,
    location: "Dubai Marina, UAE",
    title: "Illuminated Skyline",
    tag: "Luxury Holiday",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 3,
    location: "Ooty, Tamil Nadu",
    title: "Nilgiri Mountain Views",
    tag: "Hill Station",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 4,
    location: "Alleppey, Kerala",
    title: "Luxury Houseboat Cruise",
    tag: "Backwaters",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 5,
    location: "Bali, Indonesia",
    title: "Tropical Temple Haven",
    tag: "Island Getaway",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 6,
    location: "Kodaikanal, Tamil Nadu",
    title: "Pine Forest Trails",
    tag: "Forest Trek",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 7,
    location: "Rameswaram, Tamil Nadu",
    title: "Pamban Sea Bridge",
    tag: "Sacred Heritage",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: 8,
    location: "Jaipur, Rajasthan",
    title: "Amber Fort & Palaces",
    tag: "Royal Heritage",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=900&auto=format&fit=crop"
  }
];

const WaveGalleryScroll = () => {
  const { content } = useData();
  const sc = content?.showcases || {};

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = galleryItems.length;

  // Auto progression
  useEffect(() => {
    if (isPaused) return;
    autoPlayTimer.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(autoPlayTimer.current);
  }, [isPaused, total]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setIsPaused(false);
  };

  // Calculate circular offset distance (-total/2 to +total/2)
  const getCardOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="wave-gallery-section">
      <div className="container">
        {/* Section Header */}
        <AnimatedSection anim="fade-up" className="section-header-left wave-header-left">
          <div className="section-tag wave-tag">
            <FaCamera className="wave-tag-icon" /> {sc.gallery_tag || "3D PERSPECTIVE GALLERY"}
          </div>
          <h2 className="section-title section-title-left">
            {sc.gallery_title ? (
              (() => {
                const words = sc.gallery_title.trim().split(' ');
                if (words.length <= 1) return sc.gallery_title;
                const splitIdx = Math.ceil(words.length / 2);
                return <>{words.slice(0, splitIdx).join(' ')} <span>{words.slice(splitIdx).join(' ')}</span></>;
              })()
            ) : (
              <>CAPTURING REAL <span>TRAVEL EXPERIENCES</span></>
            )}
          </h2>
          <p className="section-subtitle">
            {sc.gallery_subtitle || "Immerse yourself in dynamic 3D moments captured across our signature tours. Click or swipe any card to focus."}
          </p>
        </AnimatedSection>
      </div>

      {/* 3D CoverFlow Stage */}
      <div 
        className="coverflow-stage"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="coverflow-carousel">
          {galleryItems.map((item, index) => {
            const offset = getCardOffset(index);
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 3;

            // Compute 3D state class
            let stateClass = 'card-hidden';
            if (offset === 0) stateClass = 'card-center';
            else if (offset === -1) stateClass = 'card-left-1';
            else if (offset === 1) stateClass = 'card-right-1';
            else if (offset === -2) stateClass = 'card-left-2';
            else if (offset === 2) stateClass = 'card-right-2';
            else if (offset === -3) stateClass = 'card-left-3';
            else if (offset === 3) stateClass = 'card-right-3';

            return (
              <div 
                key={item.id}
                className={`coverflow-card-wrapper ${stateClass}`}
                onClick={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title}`}
                aria-hidden={!isVisible}
              >
                <div className="coverflow-card-inner">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    loading="lazy" 
                    className="coverflow-card-img" 
                  />

                  {/* Top Rating Badge */}
                  <div className="coverflow-rating-badge">
                    <FaStar className="coverflow-star-icon" /> {item.rating}
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="coverflow-card-overlay">
                    <span className="coverflow-item-tag">{item.tag}</span>
                    <h3 className="coverflow-item-title">{item.title}</h3>
                    <p className="coverflow-item-location">
                      <FaMapMarkerAlt className="coverflow-pin-icon" /> {item.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left / Right Arrow Controls */}
        <button 
          type="button" 
          className="coverflow-nav-btn btn-prev"
          onClick={prevSlide}
          aria-label="Previous 3D Slide"
        >
          <FaChevronLeft />
        </button>

        <button 
          type="button" 
          className="coverflow-nav-btn btn-next"
          onClick={nextSlide}
          aria-label="Next 3D Slide"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="coverflow-dots-row">
        {galleryItems.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`coverflow-dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default WaveGalleryScroll;
