import React, { useState, useEffect } from 'react';
import { api } from '../admin/utils/api.js';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaStar, 
  FaCheck, 
  FaTimes, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaCarSide, 
  FaHotel, 
  FaUserFriends, 
  FaShieldAlt, 
  FaClock, 
  FaShareAlt,
  FaArrowLeft
} from 'react-icons/fa';
import { tourPackages, agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import './PackageDetailPage.css';


const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const pkg = tourPackages.find((p) => p.id === id) || tourPackages[0];
  const [activeImage, setActiveImage] = useState(pkg.image);

  // Booking Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    travelDate: '',
    adults: 2,
    children: 0,
    vehicleType: 'Private AC Sedan',
    hotelCategory: '3-Star Deluxe',
    specialNotes: ''
  });

  const [activeDayTab, setActiveDayTab] = useState(0);

  // Calculate live estimate
  const basePricePerPerson = pkg.price;
  let vehicleMultiplier = formData.vehicleType === 'Innova / Crysta' ? 2500 : formData.vehicleType === 'Tempo Traveler (12+ Seater)' ? 5000 : 0;
  let hotelMultiplier = formData.hotelCategory === '4-Star Premium' ? 2000 * (pkg.durationDays - 1) : formData.hotelCategory === '5-Star Luxury' ? 5000 * (pkg.durationDays - 1) : 0;
  const estimatedTotal = (basePricePerPerson * formData.adults) + (basePricePerPerson * 0.6 * formData.children) + vehicleMultiplier + hotelMultiplier;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const bookingRef = 'SPOT-' + Math.floor(100000 + Math.random() * 900000);
    const bookingData = {
      bookingRef,
      packageId: pkg.id,
      packageTitle: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration,
      ...formData,
      totalAmount: estimatedTotal,
      bookedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Store in localStorage for confirmation page
    localStorage.setItem('latestBooking', JSON.stringify(bookingData));

    // Save to MongoDB & trigger email notification (fire-and-forget — never block booking flow)
    api.createBooking(bookingData).catch(err => console.warn('Booking API save failed:', err.message));

    navigate('/booking-confirmation', { state: bookingData });
  };

  return (
    <div className="package-detail-page">
      {/* Breadcrumb & Navigation */}
      <div className="detail-top-nav">
        <div className="container">
          <Link to="/packages" className="back-link">
            <FaArrowLeft /> Back to All Packages
          </Link>
        </div>
      </div>

      <div className="container package-detail-container">
        {/* Main Content Column */}
        <div className="detail-main-content">
          {/* Header Box */}
          <div className="package-main-header">
            <div className="header-badges">
              <span className="region-pill"><FaMapMarkerAlt /> {pkg.region}</span>
              <span className="theme-pill">{pkg.theme}</span>
              <span className="rating-pill"><FaStar className="gold-star-inline" /> {pkg.rating} ({pkg.reviews} Reviews)</span>
            </div>

            <h1>{pkg.title}</h1>
            <p className="detail-destination"><FaMapMarkerAlt /> {pkg.destination}</p>
          </div>

          {/* Image Gallery */}
          <div className="package-gallery-box">
            <div className="active-img-wrapper">
              <img src={activeImage} alt={pkg.title} />
              <span className="gallery-duration-pill"><FaClock /> {pkg.duration}</span>
            </div>
            
            {pkg.gallery && pkg.gallery.length > 1 && (
              <div className="gallery-thumbnails">
                {pkg.gallery.map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumb-item ${activeImage === img ? 'selected' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Overview Highlights */}
          <div className="detail-section-card">
            <h2>TRIP <span>OVERVIEW</span></h2>
            <p className="overview-paragraph">{pkg.overview}</p>

            <h3 className="sub-heading">Tour Highlights</h3>
            <ul className="detail-highlights-grid">
              {pkg.highlights.map((h, i) => (
                <li key={i}><FaCheck className="check-icon" /> {h}</li>
              ))}
            </ul>
          </div>

          {/* Day by Day Itinerary */}
          <div className="detail-section-card">
            <h2>DAY-BY-DAY <span>ITINERARY</span></h2>
            <p className="itinerary-intro">Customizable schedule curated by Spot Tours local specialists:</p>

            <div className="itinerary-timeline">
              {pkg.itinerary.map((item, idx) => (
                <div key={idx} className="itinerary-item">
                  <div className="itinerary-header-row">
                    <div className="itinerary-badge">{item.day}</div>
                    <h4>{item.title}</h4>
                  </div>
                  <p className="itinerary-details-text">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="detail-section-card">
            <h2>WHAT'S <span>INCLUDED & EXCLUDED</span></h2>
            
            <div className="inclusions-grid">
              <div className="inc-box">
                <h3><FaCheck className="green-icon" /> What's Included</h3>
                <ul>
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i}><FaCheck className="check-icon" /> {inc}</li>
                  ))}
                </ul>
              </div>

              <div className="exc-box">
                <h3><FaTimes className="red-icon" /> What's Excluded</h3>
                <ul>
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i}><FaTimes className="times-icon" /> {exc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Transport & Stay Details */}
          <div className="detail-section-card">
            <h2>ACCOMMODATION & <span>TRANSPORT</span></h2>
            <div className="stay-cab-grid">
              <div className="stay-cab-item">
                <div className="stay-cab-header-row">
                  <FaHotel className="stay-cab-icon" />
                  <h4>Verified Hotel & Resort Stays</h4>
                </div>
                <p className="stay-cab-desc">Handpicked 3-star to 4-star properties with hygienic rooms, 24/7 hot water, complimentary breakfast, and scenic viewpoints.</p>
              </div>

              <div className="stay-cab-item">
                <div className="stay-cab-header-row">
                  <FaCarSide className="stay-cab-icon" />
                  <h4>Dedicated AC Tourist Vehicle</h4>
                </div>
                <p className="stay-cab-desc">Private Sedan, Innova, or Tempo Traveler with commercial tourist permit, experienced polite chauffeur, and all toll/parking covered.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card">
            <div className="booking-card-header">
              <span className="price-label">Price Per Person</span>
              <div className="booking-price">
                ₹{pkg.price.toLocaleString('en-IN')}
                {pkg.originalPrice && <span className="original-price">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>}
              </div>
              <span className="booking-sub">Zero Hidden Fees • Guaranteed Best Rate</span>
            </div>

            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <h3>Book This Tour Package</h3>

              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  placeholder="e.g. Anand Kumar" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="e.g. 9876543210" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="e.g. yourname@gmail.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Travel Start Date *</label>
                <CustomDatePicker
                  name="travelDate"
                  required
                  value={formData.travelDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adults (12+ yrs)</label>
                  <CustomSelect
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map((n) => ({
                      value: n,
                      label: `${n} Adults`
                    }))}
                  />
                </div>

                <div className="form-group">
                  <label>Children (5-11 yrs)</label>
                  <CustomSelect
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    options={[0, 1, 2, 3, 4, 5].map((n) => ({
                      value: n,
                      label: `${n} Kids`
                    }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Vehicle</label>
                <CustomSelect
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Private AC Sedan', label: 'Private AC Sedan (Dzire / Etios - 4 Pax)' },
                    { value: 'Innova / Crysta', label: 'Toyota Innova / Crysta (6-7 Pax)' },
                    { value: 'Tempo Traveler (12+ Seater)', label: 'Force Tempo Traveler (12-16 Pax)' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label>Hotel Category</label>
                <CustomSelect
                  name="hotelCategory"
                  value={formData.hotelCategory}
                  onChange={handleInputChange}
                  options={[
                    { value: '3-Star Deluxe', label: '3-Star Deluxe (Standard Included)' },
                    { value: '4-Star Premium', label: '4-Star Premium (+₹2,000/night)' },
                    { value: '5-Star Luxury', label: '5-Star Luxury / Pool Villa (+₹5,000/night)' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label>Special Requests / Pickup Address</label>
                <textarea 
                  name="specialNotes" 
                  rows="2" 
                  placeholder="e.g. Need baby cot, pickup from Coimbatore Railway Station..."
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="estimated-total-box">
                <span>Estimated Total:</span>
                <strong>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
              </div>

              <button type="submit" className="btn-primary booking-submit-btn">
                Confirm & Request Booking
              </button>

              <div className="quick-contact-divider">
                <span>or book directly</span>
              </div>

              <a 
                href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20want%20to%20book%20${encodeURIComponent(pkg.title)}%20package`}
                target="_blank" 
                rel="noreferrer" 
                className="btn-whatsapp booking-wa-btn"
              >
                <FaWhatsapp /> Instant Book via WhatsApp
              </a>

              <div className="booking-guarantees">
                <div><FaShieldAlt /> 100% Verified Safe Booking</div>
                <div><FaPhoneAlt /> Call Support: 095005 51404</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
