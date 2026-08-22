import React, { useState, useEffect } from 'react';
import { FaStar, FaGoogle, FaQuoteLeft, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import { agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import CustomSelect from '../components/CustomSelect';
import './ReviewsPage.css';

const initialReviews = [
  {
    name: "Praveen Kumar",
    time: "2 weeks ago",
    rating: 5,
    trip: "Family Kerala Tour",
    category: "Family",
    text: "Booked our family Kerala tour (Munnar & Alleppey) with Spot Tours and Travels Coimbatore. Excellent vehicle condition, hygienic resorts, and punctual driver. The entire trip coordination was seamless and stress-free. Highly recommended in Kuniyamuthur!"
  },
  {
    name: "Ananya & Karthik",
    time: "a month ago",
    rating: 5,
    trip: "Bali Honeymoon Package",
    category: "Honeymoon",
    text: "We planned our honeymoon to Bali through Spot Tours and Travels. From flight ticketing and visa guidance to romantic candlelit dinner and private sightseeing, everything was executed flawlessly. Best travel agency in Coimbatore!"
  },
  {
    name: "Suresh Sundaram",
    time: "3 weeks ago",
    rating: 5,
    trip: "Rameswaram Temple Tour",
    category: "Pilgrimage",
    text: "Organized a spiritual pilgrimage trip to Rameswaram & Madurai for my elderly parents. The AC tourist cab was spotless and the driver was extremely patient and courteous with senior citizens. Truly 'The Spot For Needs'!"
  },
  {
    name: "Deepak Raj",
    time: "2 months ago",
    rating: 5,
    trip: "Goa Friends Vacation",
    category: "Friends",
    text: "Spot Tours and Travels gave us the best transparent pricing for our Goa trip with friends. No hidden charges, great resort right next to the beach, and constant support from their Coimbatore office."
  },
  {
    name: "Divya Ramesh",
    time: "1 month ago",
    rating: 5,
    trip: "Ooty & Kodaikanal Tour",
    category: "Family",
    text: "Top-notch travel agency near Kuniyamuthur SBI Bank. Prompt train ticket reservations and a fantastic customized hill station itinerary. The resort stay in Ooty was breathtaking."
  },
  {
    name: "Mohammed Farooq",
    time: "3 months ago",
    rating: 5,
    trip: "Dubai Holiday Package",
    category: "International",
    text: "Booked a Dubai holiday for our family. Smooth tourist visa processing, hotel stays, desert safari, and Burj Khalifa tickets. Spot Tours handled everything end-to-end with high professionalism."
  }
];

const ReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState(initialReviews);
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const createdReview = {
      ...newReview,
      time: "Just now",
      rating: Number(newReview.rating)
    };
    setReviewsList([createdReview, ...reviewsList]);
    setShowSubmittedSuccess(true);
    setNewReview({ name: '', trip: '', category: 'Family', rating: 5, text: '' });
    setTimeout(() => setShowSubmittedSuccess(false), 5000);
  };

  const categories = ['All', 'Family', 'Honeymoon', 'Pilgrimage', 'Friends', 'International'];

  const filteredReviews = selectedFilter === 'All'
    ? reviewsList
    : reviewsList.filter(r => r.category === selectedFilter);

  return (
    <div className="reviews-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">VERIFIED REVIEWS</AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">TRAVELER <span>TESTIMONIALS</span></AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">Read real experiences and reviews from our travelers across Coimbatore and South India.</AnimatedSection>
        </div>
      </div>

      <div className="container reviews-page-container">
        {/* Rating Breakdown Card */}
        <AnimatedSection anim="fade-up" className="rating-overview-card">
          <div className="rating-left-box">
            <div className="big-score">4.7</div>
            <div className="score-stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <span className="total-reviews-count">Based on 34+ Google Reviews</span>
            <div className="google-partner-tag">
              <FaGoogle /> Verified Google Business Profile
            </div>
          </div>

          <div className="rating-bars-box">
            <div className="bar-row">
              <span>5 Stars</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: '92%' }}></div></div>
              <span>92%</span>
            </div>
            <div className="bar-row">
              <span>4 Stars</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: '8%' }}></div></div>
              <span>8%</span>
            </div>
            <div className="bar-row">
              <span>3 Stars</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div>
              <span>0%</span>
            </div>
            <div className="bar-row">
              <span>2 Stars</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div>
              <span>0%</span>
            </div>
            <div className="bar-row">
              <span>1 Star</span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div>
              <span>0%</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Filter Tabs */}
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
              {cat === 'All' ? 'All Reviews' : cat + ' Trips'}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="reviews-full-grid">
          {filteredReviews.map((review, idx) => (
            <AnimatedSection key={idx} anim="fade-up" delay={String((idx % 3) * 100 + 100)} className="review-full-card">
              <div className="review-card-top">
                <div className="avatar-circle">{review.name.charAt(0)}</div>
                <div className="reviewer-meta">
                  <h4>{review.name}</h4>
                  <span className="review-trip">{review.trip}</span>
                  <span className="review-date">{review.time}</span>
                </div>
                <div className="verified-badge" title="Verified Traveler">
                  <FaCheckCircle />
                </div>
              </div>

              <div className="review-stars-row">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <p className="review-quote-text">
                <FaQuoteLeft className="quote-icon-small" />
                {review.text}
              </p>
            </AnimatedSection>
          ))}
        </div>

        {/* Interactive "Write a Review" Form */}
        <AnimatedSection anim="fade-up" className="write-review-card">
          <h2>Share Your Experience with <span>Spot Tours and Travels</span></h2>
          <p>Traveled with us recently? We would love to hear your feedback!</p>

          {showSubmittedSuccess && (
            <div className="review-success-alert">
              🎉 Thank you for your review! Your feedback has been published below.
            </div>
          )}

          <form className="write-review-form" onSubmit={handleReviewSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ramesh Kumar" 
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Trip / Package Taken *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ooty Weekend Family Tour" 
                  value={newReview.trip}
                  onChange={(e) => setNewReview({ ...newReview, trip: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <CustomSelect
                  value={newReview.category}
                  onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
                  options={[
                    { value: 'Family', label: 'Family Holiday' },
                    { value: 'Honeymoon', label: 'Honeymoon' },
                    { value: 'Pilgrimage', label: 'Pilgrimage' },
                    { value: 'Friends', label: 'Friends Group' },
                    { value: 'International', label: 'International' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating-picker" role="radiogroup" aria-label="Rating Selection">
                  <div className="star-buttons-group">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-pick-btn ${star <= (hoverRating || newReview.rating) ? 'active' : ''}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        aria-label={`${star} Stars`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <span className="rating-desc-label">
                    {({
                      5: '(5 - Exceptional)',
                      4: '(4 - Very Good)',
                      3: '(3 - Good)',
                      2: '(2 - Fair)',
                      1: '(1 - Poor)'
                    })[hoverRating || newReview.rating]}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Your Review & Feedback *</label>
              <textarea 
                rows="4" 
                required 
                placeholder="Tell us about the cab driver, hotel stay, tour coordination..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary submit-review-btn">
              Submit Your Review
            </button>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReviewsPage;
