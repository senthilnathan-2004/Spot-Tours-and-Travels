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
import { useData } from '../context/DataContext';
import AnimatedSection from './AnimatedSection';
import './Services.css';

const ICON_MAP = {
  plane: <FaPlaneArrival />,
  globe: <FaGlobeAmericas />,
  heart: <FaHeart />,
  om: <FaOm />,
  car: <FaCarSide />,
  ticket: <FaTicketAlt />,
  passport: <FaPassport />,
  hotel: <FaHotel />
};

const Services = () => {
  const { services: servicesData } = useData();

  const activeServices = (servicesData || []).map(s => ({
    ...s,
    icon: typeof s.icon === 'object' && s.icon ? s.icon : (ICON_MAP[s.iconKey] || <FaPlaneArrival />)
  }));

  const mid = Math.ceil(activeServices.length / 2);
  const row1 = activeServices.slice(0, mid);
  const row2 = activeServices.slice(mid);

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
