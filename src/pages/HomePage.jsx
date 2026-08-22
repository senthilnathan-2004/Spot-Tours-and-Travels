import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaMapMarkedAlt, 
  FaWhatsapp, 
  FaCheck, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaShieldAlt, 
  FaHeadset, 
  FaSuitcaseRolling,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { tourPackages, destinationsList, agencyInfo } from '../data/travelData';
import Services from '../components/Services';
import Reviews from '../components/Reviews';
import MapSection from '../components/MapSection';
import OrbitShowcase from '../components/OrbitShowcase';
import WaveGalleryScroll from '../components/WaveGalleryScroll';
import AnimatedSection from '../components/AnimatedSection';
import HeroGlobeFlight from '../components/HeroGlobeFlight';
import '../components/Hero.css';
import './HomePage.css';

const CountUpNumber = ({ target, duration = 2000, decimals = 0, suffix = '' }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(easeOut * target);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    const timer = setTimeout(() => {
      frameId = requestAnimationFrame(step);
    }, 250);

    return () => {
      clearTimeout(timer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return (
    <>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  const featuredDestinations = destinationsList.slice(0, 6);

  // Packages Slider state
  const [pkgIndex, setPkgIndex] = useState(0);
  const [isPkgHovered, setIsPkgHovered] = useState(false);
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

  const maxPkgIndex = Math.max(0, tourPackages.length - itemsPerPage);

  useEffect(() => {
    if (isPkgHovered) return;
    const timer = setInterval(() => {
      setPkgIndex((prev) => (prev >= maxPkgIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPkgHovered, maxPkgIndex]);

  const handlePrevPkg = () => {
    setPkgIndex((prev) => (prev <= 0 ? maxPkgIndex : prev - 1));
  };

  const handleNextPkg = () => {
    setPkgIndex((prev) => (prev >= maxPkgIndex ? 0 : prev + 1));
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <HeroGlobeFlight />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <AnimatedSection anim="fade-down" delay="100" className="hero-badge">
            <span>COIMBATORE'S PREMIER TRAVEL PARTNER</span>
          </AnimatedSection>

          <AnimatedSection as="h1" anim="fade-up" delay="200" className="hero-title">
            DISCOVER THE WORLD WITH <span>SPOT TOURS &amp; TRAVELS</span>
          </AnimatedSection>

          <AnimatedSection as="p" anim="fade-up" delay="300" className="hero-subtitle">
            Specializing in customized domestic tours, international holidays, honeymoon packages, flight/train ticketing, and premium cab rentals from Kuniyamuthur, Coimbatore.
          </AnimatedSection>

          <AnimatedSection anim="fade-up" delay="400" className="hero-stats glass-panel">
            <div className="stat">
              <span className="stat-number">
                <CountUpNumber target={4.7} decimals={1} duration={2000} /> <FaStar className="star-inline" />
              </span>
              <span className="stat-label">Google Rating (34 Reviews)</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                <CountUpNumber target={100} decimals={0} suffix="+" duration={2000} />
              </span>
              <span className="stat-label">Tour Destinations</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                <CountUpNumber target={100} decimals={0} suffix="%" duration={2000} />
              </span>
              <span className="stat-label">Customized Itineraries</span>
            </div>
          </AnimatedSection>

          <AnimatedSection anim="fade-up" delay="500" className="hero-cta-group">
            <Link to="/packages" className="btn-primary hero-btn">
              <FaMapMarkedAlt /> View All Tour Packages
            </Link>
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours%20and%20Travels,%20I%20would%20like%20to%20enquire%20about%20tour%20packages`}
              target="_blank" 
              rel="noreferrer" 
              className="btn-whatsapp hero-whatsapp-btn"
            >
              <FaWhatsapp /> WhatsApp Enquire
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Tour Packages Slider Section */}
      <section className="featured-packages-section">
        <div className="container">
          <AnimatedSection anim="fade-up" className="section-header-flex">
            <div>
              <div className="section-tag">CURATED HOLIDAYS</div>
              <h2 className="section-title section-title-left">
                POPULAR <span>TOUR PACKAGES</span>
              </h2>
              <p className="section-subtitle">
                Handcrafted itineraries starting directly from Coimbatore with verified hotels, private cabs, and 24/7 support.
              </p>
            </div>
            <Link to="/packages" className="btn-secondary view-all-link-btn">
              Browse All {tourPackages.length} Packages <FaArrowRight />
            </Link>
          </AnimatedSection>

          {/* Auto Scrolling Slider Track */}
          <div 
            className="slider-container"
            onMouseEnter={() => setIsPkgHovered(true)}
            onMouseLeave={() => setIsPkgHovered(false)}
            onTouchStart={() => setIsPkgHovered(true)}
            onTouchEnd={() => setIsPkgHovered(false)}
          >
            <div 
              className="slider-track"
              style={{ transform: `translateX(calc(-${pkgIndex} * (100% + 24px) / ${itemsPerPage}))` }}
            >
              {tourPackages.map((pkg) => (
                <div key={pkg.id} className="slider-card-item">
                  <div className={`package-card ${pkg.popular ? 'featured' : ''}`}>
                    {pkg.popular && <span className="package-popular-badge"><FaStar className="gold-star-inline" /> Most Popular</span>}
                    <div className="package-image-wrap">
                      <img src={pkg.image} alt={pkg.title} loading="lazy" />
                      <span className="package-duration-pill">{pkg.duration}</span>
                    </div>

                    <div className="package-body">
                      <div className="package-meta">
                        <span className="package-region"><FaMapMarkerAlt /> {pkg.region}</span>
                        <span className="package-rating"><FaStar className="gold-star-inline" /> {pkg.rating} ({pkg.reviews})</span>
                      </div>

                      <h3 className="package-title">{pkg.title}</h3>
                      <p className="package-destination-text">{pkg.destination}</p>

                      <ul className="package-highlights-list">
                        {pkg.highlights.slice(0, 2).map((h, i) => (
                          <li key={i}><FaCheck className="check-icon" /> {h}</li>
                        ))}
                      </ul>

                      <div className="package-footer">
                        <div className="package-pricing">
                          <span className="price-from">Starting From</span>
                          <div className="price-tag">
                            ₹{pkg.price.toLocaleString('en-IN')}
                            <span className="price-unit">/person</span>
                          </div>
                        </div>

                        <div className="package-actions">
                          <Link to={`/package/${pkg.id}`} className="btn-primary package-detail-btn">
                            View Itinerary
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Arrow Controls and Indicator Dots */}
          <div className="slider-controls-wrap">
            <button 
              className="slider-arrow-btn prev" 
              onClick={handlePrevPkg} 
              aria-label="Previous Package"
            >
              <FaChevronLeft />
            </button>
            <div className="slider-dots-list">
              {Array.from({ length: maxPkgIndex + 1 }).map((_, i) => (
                <button 
                  key={i} 
                  className={`slider-dot ${pkgIndex === i ? 'active' : ''}`}
                  onClick={() => setPkgIndex(i)}
                  aria-label={`Slide to package ${i + 1}`}
                />
              ))}
            </div>
            <button 
              className="slider-arrow-btn next" 
              onClick={handleNextPkg} 
              aria-label="Next Package"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Spot Tours */}
      <section className="why-us-section section-alt">
        <div className="container">
          <AnimatedSection anim="fade-up" className="section-header-left">
            <div className="section-tag">WHY TRAVEL WITH US</div>
            <h2 className="section-title section-title-left">THE <span>SPOT TOURS &amp; TRAVELS</span> ADVANTAGE</h2>
            <p className="section-subtitle">
              Headquartered in Kuniyamuthur, Coimbatore, we deliver genuine hospitality, transparent pricing, and 100% peace of mind.
            </p>
          </AnimatedSection>

          <div className="why-us-grid">
            <AnimatedSection anim="fade-up" delay="100" className="why-us-card">
              <div className="why-us-card-header">
                <div className="why-us-icon"><FaShieldAlt /></div>
                <h3>100% Verified &amp; Safe Stays</h3>
              </div>
              <p>We handpick only hygienic, top-reviewed 3-star to 5-star hotels and luxury houseboats checked for family and couple safety.</p>
            </AnimatedSection>

            <AnimatedSection anim="fade-up" delay="200" className="why-us-card">
              <div className="why-us-card-header">
                <div className="why-us-icon"><FaSuitcaseRolling /></div>
                <h3>Tailor-Made Flexible Plans</h3>
              </div>
              <p>Customise sightseeing spots, vehicle types, stay durations, and meal preferences exactly according to your group's budget.</p>
            </AnimatedSection>

            <AnimatedSection anim="fade-up" delay="300" className="why-us-card">
              <div className="why-us-card-header">
                <div className="why-us-icon"><FaHeadset /></div>
                <h3>24/7 Dedicated Trip Coordinator</h3>
              </div>
              <p>Our Coimbatore travel specialist is always one call away throughout your journey to ensure seamless travel from day one.</p>
            </AnimatedSection>

            <AnimatedSection anim="fade-up" delay="400" className="why-us-card">
              <div className="why-us-card-header">
                <div className="why-us-icon"><FaStar /></div>
                <h3>4.7★ Top Rated in Coimbatore</h3>
              </div>
              <p>Backed by 34+ verified Google reviews from satisfied families, honeymooners, and corporate clients.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 360 Degree Infinite Orbit Showcase (180° Visible Arc Window) */}
      <OrbitShowcase />

      {/* Destinations Grid */}
      <section className="home-destinations-section">
        <div className="container">
          <AnimatedSection anim="fade-up" className="section-header-flex">
            <div>
              <div className="section-tag">TOP ATTRACTIONS</div>
              <h2 className="section-title section-title-left">
                EXPLORE <span>POPULAR DESTINATIONS</span>
              </h2>
              <p className="section-subtitle">
                From misty Western Ghats to turquoise tropical beaches and sacred heritage sites.
              </p>
            </div>
            <Link to="/destinations" className="btn-secondary view-all-link-btn">
              View All Destinations <FaArrowRight />
            </Link>
          </AnimatedSection>

          <div className="destinations-grid-modern">
            {featuredDestinations.map((dest, idx) => (
              <AnimatedSection
                key={dest.id}
                anim="zoom-in"
                delay={String((idx % 3) * 100 + 100)}
                className="destination-modern-card"
                onClick={() => navigate(`/destinations?selected=${dest.id}`)}
              >
                <img src={dest.banner} alt={dest.name} loading="lazy" />
                <div className="destination-modern-overlay">
                  <span className="dest-category-pill">{dest.category}</span>
                  <h3>{dest.name}</h3>
                  <p className="dest-state">{dest.state}</p>
                  <div className="dest-footer-info">
                    <span>Best Time: {dest.bestTime}</span>
                    <span className="dest-price-badge">From {dest.startingPrice}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section Component */}
      <Services />

      {/* Reviews Section Component */}
      <Reviews />

      {/* CTA Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <AnimatedSection anim="zoom-in" dur="slow" className="cta-banner-content">
            <AnimatedSection anim="fade-down" delay="100" className="cta-badge">✈️ READY FOR YOUR NEXT ADVENTURE?</AnimatedSection>
            <AnimatedSection as="h2" anim="fade-up" delay="200">Need a Custom Tour Itinerary or Flight/Train Booking?</AnimatedSection>
            <AnimatedSection as="p" anim="fade-up" delay="300">
              Talk directly with our Coimbatore travel specialists today. We provide instant quotes, custom family itineraries, and vehicle bookings.
            </AnimatedSection>
            <AnimatedSection anim="fade-up" delay="400" className="cta-btn-group">
              <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-primary cta-call-btn">
                Call {agencyInfo.phone}
              </a>
              <a 
                href={`https://wa.me/${agencyInfo.whatsappRaw}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-whatsapp cta-wa-btn"
              >
                <FaWhatsapp /> WhatsApp Enquire
              </a>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Infinite Wave Travel Gallery (Dynamic Heights) */}
      <WaveGalleryScroll />

      {/* Map & Office Section */}
      <MapSection />
    </div>
  );
};

export default HomePage;
