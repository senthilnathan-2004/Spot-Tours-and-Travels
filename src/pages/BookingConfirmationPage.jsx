import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaCarSide, 
  FaHotel, 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaPrint, 
  FaMapMarkedAlt, 
  FaShieldAlt,
  FaArrowLeft
} from 'react-icons/fa';
import { agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import './BookingConfirmationPage.css';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const savedBooking = localStorage.getItem('latestBooking');
  const booking = location.state || (savedBooking ? JSON.parse(savedBooking) : {
    bookingRef: 'SPOT-' + Math.floor(100000 + Math.random() * 900000),
    packageTitle: 'Ooty & Kodaikanal Queen of Hills',
    destination: 'Ooty & Kodaikanal, Tamil Nadu',
    duration: '4 Days / 3 Nights',
    fullName: 'Valued Guest',
    phone: '095005 51404',
    travelDate: 'Upcoming Vacation',
    adults: 2,
    children: 0,
    vehicleType: 'Private AC Sedan',
    hotelCategory: '3-Star Deluxe',
    totalAmount: 14998,
    bookedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `*New Booking Request from Spot Tours Website* ✈️
Booking Reference: ${booking.bookingRef}
Package: ${booking.packageTitle}
Destination: ${booking.destination}
Duration: ${booking.duration}
Name: ${booking.fullName}
Mobile: ${booking.phone}
Travel Date: ${booking.travelDate}
Guests: ${booking.adults} Adults, ${booking.children} Kids
Vehicle: ${booking.vehicleType}
Hotel: ${booking.hotelCategory}
Estimated Total: ₹${booking.totalAmount?.toLocaleString('en-IN')}

Please confirm our itinerary and send hotel confirmation voucher.`;

  return (
    <div className="confirmation-page">
      <div className="container confirmation-container">
        {/* Success Card */}
        <AnimatedSection anim="fade-up" dur="slow" className="confirmation-card">
          <div className="confirmation-header">
            <div className="success-icon-badge">
              <FaCheckCircle />
            </div>
            <h1>BOOKING REQUEST <span>RECEIVED!</span></h1>
            <p className="conf-sub">
              Thank you, <strong>{booking.fullName}</strong>. Your tour booking request has been submitted to <strong>Spot Tours and Travels Coimbatore</strong>.
            </p>
            <div className="booking-ref-badge">
              <span>Booking Reference ID</span>
              <strong>{booking.bookingRef}</strong>
            </div>
          </div>

          {/* Booking Summary Box */}
          <div className="conf-details-grid">
            <div className="conf-section">
              <h3>Tour Package Details</h3>
              <div className="conf-item">
                <span className="conf-label">Package Name:</span>
                <span className="conf-val highlight">{booking.packageTitle}</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Destination:</span>
                <span className="conf-val">{booking.destination}</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Duration:</span>
                <span className="conf-val">{booking.duration}</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Booked Date:</span>
                <span className="conf-val">{booking.bookedAt}</span>
              </div>
            </div>

            <div className="conf-section">
              <h3>Traveler & Stay Preferences</h3>
              <div className="conf-item">
                <span className="conf-label">Lead Traveler:</span>
                <span className="conf-val">{booking.fullName} ({booking.phone})</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Travel Date:</span>
                <span className="conf-val">{booking.travelDate}</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Guests:</span>
                <span className="conf-val">{booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Kids` : ''}</span>
              </div>
              <div className="conf-item">
                <span className="conf-label">Vehicle & Stay:</span>
                <span className="conf-val">{booking.vehicleType} • {booking.hotelCategory}</span>
              </div>
            </div>
          </div>

          {/* Pricing Total Box */}
          <div className="conf-total-banner">
            <div>
              <span className="total-title">Total Estimated Package Price</span>
              <p className="total-note">Includes AC Cab, Hotel stay, Daily Breakfast, and 24/7 Coordinator Support</p>
            </div>
            <div className="conf-final-price">
              ₹{booking.totalAmount?.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="next-steps-box">
            <h3>What Happens Next?</h3>
            <div className="steps-row">
              <div className="step-col">
                <div className="step-num">1</div>
                <h4>Coordinator Verification</h4>
                <p>Our tour specialist will call you within 30 minutes to verify pickup location and timings.</p>
              </div>
              <div className="step-col">
                <div className="step-num">2</div>
                <h4>Hotel & Cab Vouchers</h4>
                <p>We issue your verified hotel reservation vouchers and driver contact details.</p>
              </div>
              <div className="step-col">
                <div className="step-num">3</div>
                <h4>Seamless Journey</h4>
                <p>Your chauffeur arrives at your Coimbatore doorstep on travel morning for a blissful vacation.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="conf-action-buttons">
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp conf-wa-btn"
            >
              <FaWhatsapp className="conf-btn-icon" />
              <span>Send to WhatsApp for Instant Confirmation</span>
            </a>

            <button onClick={handlePrint} className="btn-secondary conf-print-btn">
              <FaPrint className="conf-btn-icon" />
              <span>Print / Save Voucher Slip</span>
            </button>

            <Link to="/" className="conf-home-link">
              <FaArrowLeft /> Return to Home
            </Link>
          </div>

          {/* Support Guarantee */}
          <div className="conf-support-footer">
            <div><FaShieldAlt /> 100% Guaranteed Booking Assurance</div>
            <div>
              <FaPhoneAlt /> Immediate Assistance: <a href={`tel:${agencyInfo.phoneRaw}`}>095005 51404</a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
