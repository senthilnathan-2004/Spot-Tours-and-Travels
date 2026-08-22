import React from 'react';
import { 
  FaPlaneArrival, 
  FaGlobeAmericas, 
  FaHeart, 
  FaOm, 
  FaCarSide, 
  FaTicketAlt,
  FaPassport,
  FaHotel
} from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import './Services.css';

const servicesData = [
  {
    title: "Domestic Tour Packages",
    description: "Customized holiday packages across India including Ooty, Kodaikanal, Kerala, Goa, Kashmir, Himachal, and Rajasthan.",
    icon: <FaPlaneArrival />
  },
  {
    title: "International Holidays",
    description: "Exciting overseas vacation packages to Dubai, Bali, Singapore, Malaysia, Thailand, Sri Lanka, Maldives, and Europe.",
    icon: <FaGlobeAmericas />
  },
  {
    title: "Honeymoon Specials",
    description: "Romantic getaways with luxury resort stays, flower bed decoration, private sightseeing cabs, and candlelit dinners.",
    icon: <FaHeart />
  },
  {
    title: "Pilgrimage & Temple Tours",
    description: "Curated spiritual journeys to Rameswaram, Madurai, Tirupati, Varanasi, Chidambaram, Navagraha, and Kumbakonam.",
    icon: <FaOm />
  },
  {
    title: "AC Cab & Bus Rentals",
    description: "Comfortable sedans, Innova, Crysta, and Tempo Travelers for local Coimbatore transfers and outstation journeys.",
    icon: <FaCarSide />
  },
  {
    title: "Flight & Train Ticketing",
    description: "Quick, hassle-free domestic & international flight ticketing, tatkal train booking assistance, and bus seat reservations.",
    icon: <FaTicketAlt />
  },
  {
    title: "Visa & Passport Guidance",
    description: "End-to-end support for tourist visas, travel insurance, documentation, and passport appointment assistance.",
    icon: <FaPassport />
  },
  {
    title: "Hotel & Resort Bookings",
    description: "Handpicked verified 3-star, 4-star, 5-star hotels, homestays, and jungle resorts with complimentary breakfast.",
    icon: <FaHotel />
  }
];

const Services = () => {
  const row1 = servicesData.slice(0, 4);
  const row2 = servicesData.slice(4, 8);

  // Duplicating items for seamless infinite continuous scrolling
  const row1Items = [...row1, ...row1, ...row1, ...row1];
  const row2Items = [...row2, ...row2, ...row2, ...row2];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <AnimatedSection anim="fade-up" className="section-header-left">
          <div className="section-tag">WHAT WE OFFER</div>
          <h2 className="section-title section-title-left">OUR <span>TRAVEL SERVICES</span></h2>
          <p className="services-subtitle">
            Comprehensive travel management and customized tour solutions from Coimbatore
          </p>
        </AnimatedSection>
        
        {/* 2-Row Infinite Marquee Slider with Container Width Matching Other Sections */}
        <div className="services-marquee-wrapper">
          {/* Row 1 - Scrolling Left */}
          <div className="marquee-row">
            <div className="marquee-track scroll-left">
              {row1Items.map((service, idx) => (
                <div key={idx} className="service-card">
                  <div className="service-card-header">
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Scrolling Right */}
          <div className="marquee-row">
            <div className="marquee-track scroll-right">
              {row2Items.map((service, idx) => (
                <div key={idx} className="service-card">
                  <div className="service-card-header">
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
