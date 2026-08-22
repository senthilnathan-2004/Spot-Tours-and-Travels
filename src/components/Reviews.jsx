import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from './AnimatedSection';
import './Reviews.css';

const Reviews = () => {
  const { reviews: reviewData } = useData();
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 680) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const reviewsList = reviewData || [];
  const maxReviewIndex = Math.max(0, reviewsList.length - itemsPerPage);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, maxReviewIndex]);

  const handlePrev = () => {
    setReviewIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
  };

  const handleNext = () => {
    setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="reviews-section section-alt">
      <div className="container" style={{ padding: '0 20px' }}>
        <AnimatedSection anim="fade-up" className="section-header-left">
          <div className="section-tag">TESTIMONIALS</div>
          <h2 className="section-title section-title-left">WHAT OUR <span>TRAVELERS SAY</span></h2>
          
          <div className="google-rating-summary">
            <div className="google-badge">
              <div className="google-badge-header">
                <FaStar className="gold-star-icon" />
                <div className="rating-score">4.7</div>
              </div>
              <div className="stars-summary">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span className="rating-count">Based on {reviewsList.length || 34}+ Google Reviews</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Auto Scrolling Slider */}
        <div 
          className="slider-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div 
            className="slider-track"
            style={{ transform: `translateX(calc(-${reviewIndex} * (100% + 24px) / ${itemsPerPage}))` }}
          >
            {reviewsList.map((review, idx) => (
              <div key={review._id || idx} className="slider-card-item">
                <div className="review-card">
                  <div className="review-header">
                    <div className="avatar">{review.name ? review.name.charAt(0) : 'G'}</div>
                    <div className="reviewer-info">
                      <h4>{review.name}</h4>
                      <div className="review-trip-tag">{review.trip}</div>
                      <span className="review-time">{review.time}</span>
                    </div>
                  </div>
                  
                  <div className="stars">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  
                  <p className="review-text">
                    <FaQuoteLeft className="quote-icon" />
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Navigation Controls */}
        <div className="slider-controls-wrap">
          <button 
            className="slider-arrow-btn prev" 
            onClick={handlePrev} 
            aria-label="Previous Review"
          >
            <FaChevronLeft />
          </button>
          <div className="slider-dots-list">
            {Array.from({ length: maxReviewIndex + 1 }).map((_, i) => (
              <button 
                key={i} 
                className={`slider-dot ${reviewIndex === i ? 'active' : ''}`}
                onClick={() => setReviewIndex(i)}
                aria-label={`Slide to review ${i + 1}`}
              />
            ))}
          </div>
          <button 
            className="slider-arrow-btn next" 
            onClick={handleNext} 
            aria-label="Next Review"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
