import React, { useState, useEffect } from 'react';
import { FaStar, FaGoogle, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import CustomSelect from '../components/CustomSelect';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const { reviews: reviewsList, submitReview, content } = useData();
  const revContent = content?.reviews_page || {};

  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // New Review Form State
  const [newReview, setNewReview] = useState({
    name: '',
    trip: '',
    category: 'Family',
    rating: 5,
    text: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [showSubmittedSuccess, setShowSubmittedSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const createdReview = {
      ...newReview,
      time: "Just now",
      rating: Number(newReview.rating)
    };
    await submitReview(createdReview);
    setShowSubmittedSuccess(true);
    setNewReview({ name: '', trip: '', category: 'Family', rating: 5, text: '' });
    setTimeout(() => setShowSubmittedSuccess(false), 5000);
  };

  const categories = ['All', 'Family', 'Honeymoon', 'Pilgrimage', 'Friends', 'International'];

  const filteredReviews = selectedFilter === 'All'
    ? (reviewsList || [])
    : (reviewsList || []).filter(r => r.category === selectedFilter);

  // Calculate rating stats dynamically
  const totalCount = reviewsList?.length || 1;
  const fiveStarsCount = (reviewsList || []).filter(r => r.rating === 5).length;
  const fourStarsCount = (reviewsList || []).filter(r => r.rating === 4).length;
  const threeStarsCount = (reviewsList || []).filter(r => r.rating === 3).length;
  const twoStarsCount = (reviewsList || []).filter(r => r.rating === 2).length;
  const oneStarCount = (reviewsList || []).filter(r => r.rating === 1).length;

  const fiveStarPct = Math.round((fiveStarsCount / totalCount) * 100);
  const fourStarPct = Math.round((fourStarsCount / totalCount) * 100);
  const threeStarPct = Math.round((threeStarsCount / totalCount) * 100);
  const twoStarPct = Math.round((twoStarsCount / totalCount) * 100);
  const oneStarPct = Math.round((oneStarCount / totalCount) * 100);

  return (
    <div className="reviews-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">
            {revContent.page_tag || "VERIFIED REVIEWS"}
          </AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">
            {revContent.page_title || "TRAVELER TESTIMONIALS"}
          </AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">
            {revContent.page_subtitle || "Read real experiences and reviews from our travelers across Coimbatore and South India."}
          </AnimatedSection>
        </div>
      </div>

      <div className="container reviews-page-container">
        {/* Rating Breakdown Card */}
        <AnimatedSection anim="fade-up" className="rating-overview-card">
          <div className="rating-left-box">
            <div className="big-score">{revContent.overall_rating || "4.7"}</div>
            <div className="score-stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <span className="total-reviews-count">
              {revContent.review_source || `Based on ${reviewsList?.length || 34}+ Google Reviews`}
            </span>
            <div className="google-partner-tag">
              <FaCheckCircle /> Verified Google Business Profile
            </div>
          </div>

          <div className="rating-bars-box">
            <div className="bar-row">
              <span>5 Stars</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${fiveStarPct}%` }}></div>
              </div>
              <span>{fiveStarPct}%</span>
            </div>

            <div className="bar-row">
              <span>4 Stars</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${fourStarPct}%` }}></div>
              </div>
              <span>{fourStarPct}%</span>
            </div>

            <div className="bar-row">
              <span>3 Stars</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${threeStarPct}%` }}></div>
              </div>
              <span>{threeStarPct}%</span>
            </div>

            <div className="bar-row">
              <span>2 Stars</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${twoStarPct}%` }}></div>
              </div>
              <span>{twoStarPct}%</span>
            </div>

            <div className="bar-row">
              <span>1 Star</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${oneStarPct}%` }}></div>
              </div>
              <span>{oneStarPct}%</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Filter Bar */}
        <div className="reviews-filter-tabs">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`review-tab-btn ${selectedFilter === cat ? 'active' : ''}`}
              onClick={(e) => {
                setSelectedFilter(cat);
                e.currentTarget?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
            >
              {cat === 'All' ? 'All Reviews' : `${cat} Trips`}
            </button>
          ))}
        </div>

        {/* Reviews Full Grid */}
        <div className="reviews-full-grid">
          {filteredReviews.map((rev, idx) => (
            <AnimatedSection key={rev._id || idx} anim="fade-up" delay={String((idx % 3) * 100 + 100)} className="review-full-card">
              <div className="review-card-top">
                <div className="avatar-circle">
                  {rev.name ? rev.name.charAt(0) : 'G'}
                </div>
                <div className="reviewer-meta">
                  <h4>{rev.name}</h4>
                  <span className="review-trip">{rev.trip}</span>
                  <span className="review-date">{rev.time}</span>
                </div>
                <FaGoogle style={{ color: '#4285F4', fontSize: '1.2rem' }} />
              </div>

              <div className="review-stars-row">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <p className="review-quote-text">
                <FaQuoteLeft className="quote-icon-small" />
                {rev.text}
              </p>
            </AnimatedSection>
          ))}
        </div>

        {/* Write a Review Section */}
        <AnimatedSection anim="zoom-in" dur="slow" className="write-review-card">
          <h2>Share Your Experience with Spot Tours and Travels</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Traveled with us recently? We would love to hear your feedback!
          </p>

          {showSubmittedSuccess && (
            <div style={{ background: '#ecfdf5', color: '#047857', padding: '12px 16px', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
              🎉 Thank you for your review! Your feedback has been published.
            </div>
          )}

          <form onSubmit={handleReviewSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ramesh Kumar" 
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-light)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Trip / Package Taken *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ooty Weekend Family Tour" 
                  value={newReview.trip}
                  onChange={(e) => setNewReview({ ...newReview, trip: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-light)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Category</label>
                <CustomSelect
                  value={newReview.category}
                  onChange={(val) => setNewReview({ ...newReview, category: val })}
                  options={[
                    { value: 'Family', label: 'Family Holiday' },
                    { value: 'Honeymoon', label: 'Honeymoon' },
                    { value: 'Pilgrimage', label: 'Pilgrimage' },
                    { value: 'Friends', label: 'Friends Group' },
                    { value: 'International', label: 'International' }
                  ]}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: star <= (hoverRating || newReview.rating) ? 'var(--accent)' : '#CBD5E1', padding: '0 2px' }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>Your Review & Feedback *</label>
              <textarea 
                rows="4" 
                required 
                placeholder="Tell us about the cab driver, hotel stay, tour coordination..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-light)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'block', width: '100%', padding: '12px' }}>
              Submit Your Review
            </button>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReviewsPage;
