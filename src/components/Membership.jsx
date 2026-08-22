import React from 'react';
import { FaCheck, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import './Membership.css';

const tourPlans = [
  {
    name: "Hill Station Weekend",
    duration: "3 Days / 2 Nights",
    price: "₹5,999",
    destinations: "Ooty • Kodaikanal • Munnar",
    features: [
      "2 Nights in Verified 3-Star Hotel",
      "Daily Complimentary Breakfast",
      "Dedicated Private AC Tourist Cab",
      "Botanical Gardens & Viewpoints Sightseeing",
      "Toll, Parking & Driver Charges Included",
      "24/7 Travel Coordinator Assistance"
    ]
  },
  {
    name: "Kerala & Beach Splendour",
    duration: "5 Days / 4 Nights",
    price: "₹12,499",
    popular: true,
    destinations: "Munnar • Alleppey • Cochin",
    features: [
      "4 Nights in Deluxe Resort & Houseboat",
      "Daily Breakfast & Authentic Meals",
      "Alleppey Backwater Houseboat Cruise",
      "Dedicated AC Chauffeur-driven Vehicle",
      "Tea Museum & Spice Plantation Tour",
      "Airport / Railway Station Transfers",
      "Free Customized Trip Consultation"
    ]
  },
  {
    name: "Golden Triangle Heritage",
    duration: "6 Days / 5 Nights",
    price: "₹19,999",
    destinations: "Delhi • Agra (Taj Mahal) • Jaipur",
    features: [
      "5 Nights in 4-Star Heritage Hotels",
      "Daily Buffet Breakfast Included",
      "Sunrise Taj Mahal Guided Tour",
      "Jaipur Forts & Palaces Exploration",
      "Intercity AC Transportation",
      "Flight / Train Ticketing Assistance",
      "VIP Sightseeing Support"
    ]
  }
];

const whyChooseUs = [
  {
    number: "01",
    title: "100% Customized Plans",
    desc: "Every itinerary is tailored to your group, budget, and travel preferences."
  },
  {
    number: "02",
    title: "Transparent Pricing",
    desc: "Clear upfront quotes with zero hidden surcharges or surprise costs."
  },
  {
    number: "03",
    title: "Verified Safe Stays",
    desc: "Handpicked, hygienic hotels and resorts checked for family & couple safety."
  },
  {
    number: "04",
    title: "24/7 On-Trip Assistance",
    desc: "Our Coimbatore team stays connected with you throughout your holiday."
  }
];

const Membership = () => {
  return (
    <section id="membership" className="membership-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div className="section-tag">FEATURED ITINERARIES</div>
          <h2 className="section-title">POPULAR <span>TOUR PACKAGES</span></h2>
          <p className="membership-subtitle">
            Curated domestic & international holiday plans starting from Coimbatore. All plans can be custom-tailored!
          </p>
        </div>
        
        <div className="plans-grid">
          {tourPlans.map((plan, idx) => (
            <div key={idx} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular Choice</div>}
              <h3>{plan.name}</h3>
              <div className="plan-destinations">{plan.destinations}</div>
              <div className="plan-duration">{plan.duration}</div>
              <div className="price">
                {plan.price}<span>/person</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx}>
                    <FaCheck className="feature-check-icon" /> {feature}
                  </li>
                ))}
              </ul>
              
              <div className="plan-btn-group">
                <a 
                  href={`https://wa.me/919500551404?text=Hi%20Spot%20Tours,%20I%20am%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20package`}
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary plan-btn"
                >
                  <FaWhatsapp /> Book This Package
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="why-choose-us">
          <div style={{ textAlign: 'center' }}>
            <div className="section-tag">OUR PROMISE</div>
            <h2 className="section-title">WHY TRAVEL WITH <span>SPOT TOURS?</span></h2>
          </div>
          
          <div className="reasons-grid">
            {whyChooseUs.map((reason, idx) => (
              <div key={idx} className="reason-item">
                <div className="reason-number">{reason.number}</div>
                <div className="reason-text">
                  <h4>{reason.title}</h4>
                  <p>{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;

