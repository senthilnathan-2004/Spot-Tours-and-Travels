import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaStar, 
  FaCheck, 
  FaPhoneAlt, 
  FaWhatsapp,
  FaUndo,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { tourPackages, agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import CustomSelect from '../components/CustomSelect';
import './PackagesPage.css';


const PackagesPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('destination') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'All');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || 'All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const regions = ['All', 'South India', 'North India', 'International', 'Spiritual'];
  const themes = ['All', 'Hill Station / Family', 'Honeymoon / Nature', 'Heritage / Wonders of World', 'Pilgrimage / Heritage', 'International / Luxury', 'Honeymoon / Beach'];

  const filteredPackages = tourPackages.filter((pkg) => {
    // Search match
    const matchesSearch = searchTerm === '' || 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());

    // Region match
    const matchesRegion = selectedRegion === 'All' || pkg.region === selectedRegion;

    // Duration match
    let matchesDuration = true;
    if (selectedDuration === 'weekend') {
      matchesDuration = pkg.durationDays <= 3;
    } else if (selectedDuration === 'medium') {
      matchesDuration = pkg.durationDays >= 4 && pkg.durationDays <= 5;
    } else if (selectedDuration === 'long') {
      matchesDuration = pkg.durationDays >= 6;
    }

    // Theme match
    const matchesTheme = selectedTheme === 'All' || pkg.theme === selectedTheme;

    // Price match
    let matchesPrice = true;
    if (selectedPrice === 'under-10k') {
      matchesPrice = pkg.price < 10000;
    } else if (selectedPrice === '10k-25k') {
      matchesPrice = pkg.price >= 10000 && pkg.price <= 25000;
    } else if (selectedPrice === 'above-25k') {
      matchesPrice = pkg.price > 25000;
    }

    return matchesSearch && matchesRegion && matchesDuration && matchesTheme && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('All');
    setSelectedDuration('All');
    setSelectedTheme('All');
    setSelectedPrice('All');
  };

  return (
    <div className="packages-page">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">TOUR ITINERARIES</AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">ALL TOUR <span>PACKAGES</span></AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">
            Explore handcrafted domestic &amp; international tour packages starting from Coimbatore. 100% customizable to your schedule and budget.
          </AnimatedSection>
        </div>
      </div>

      <div className="container packages-container">
        {/* Filters Sidebar / Bar */}
        <div className={`packages-filter-wrapper ${isFilterOpen ? 'is-open' : 'is-closed'}`}>
          <div className="filter-header">
            <div className="filter-title-wrap" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <h3><FaFilter /> Filter Packages</h3>
              <span className="mobile-filter-toggle-badge">
                {isFilterOpen ? 'Hide' : 'Show'} {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            <button className="reset-btn" onClick={resetFilters}>
              <FaUndo /> Reset All
            </button>
          </div>

          <div className={`filter-grid ${isFilterOpen ? 'is-open' : 'is-closed'}`}>
            {/* Search Input */}
            <div className="filter-item">
              <label>Search Destination</label>
              <div className="input-with-icon">
                <FaSearch className="input-icon" />
                <input 
                  type="text" 
                  placeholder="e.g. Ooty, Kerala, Dubai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Region Filter */}
            <div className="filter-item">
              <label>Region / Circuit</label>
              <CustomSelect
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                options={regions.map((r) => ({ value: r, label: r === 'All' ? 'All Regions' : r }))}
              />
            </div>

            {/* Duration Filter */}
            <div className="filter-item">
              <label>Duration</label>
              <CustomSelect
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                options={[
                  { value: 'All', label: 'All Durations' },
                  { value: 'weekend', label: 'Weekend (2 - 3 Days)' },
                  { value: 'medium', label: '4 - 5 Days' },
                  { value: 'long', label: '6+ Days' }
                ]}
              />
            </div>

            {/* Price Filter */}
            <div className="filter-item">
              <label>Budget Per Person</label>
              <CustomSelect
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                options={[
                  { value: 'All', label: 'All Budgets' },
                  { value: 'under-10k', label: 'Under ₹10,000' },
                  { value: '10k-25k', label: '₹10,000 – ₹25,000' },
                  { value: 'above-25k', label: 'Above ₹25,000' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="results-counter">
          <span>Showing <strong>{filteredPackages.length}</strong> of {tourPackages.length} Tour Packages</span>
        </div>

        {/* Package Grid */}
        {filteredPackages.length > 0 ? (
          <div className="packages-grid">
            {filteredPackages.map((pkg, idx) => (
              <AnimatedSection key={pkg.id} anim="fade-up" delay={String((idx % 3) * 100 + 100)} className={`package-card ${pkg.popular ? 'featured' : ''}`}>
                {pkg.popular && <span className="package-popular-badge"><FaStar className="gold-star-inline" /> Recommended</span>}
                <div className="package-image-wrap">
                  <img src={pkg.image} alt={pkg.title} loading="lazy" />
                  <span className="package-duration-pill">{pkg.duration}</span>
                </div>

                <div className="package-body">
                  <div className="package-meta">
                    <span className="package-region"><FaMapMarkerAlt /> {pkg.region}</span>
                    <span className="package-rating"><FaStar className="gold-star-inline" /> {pkg.rating} ({pkg.reviews} reviews)</span>
                  </div>

                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-destination-text">{pkg.destination}</p>
                  
                  <p className="package-overview-snippet">
                    {pkg.overview.substring(0, 110)}...
                  </p>

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
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="no-packages-found">
            <h3>No tour packages found matching your criteria</h3>
            <p>Try resetting the search filters or contact our Coimbatore team directly for a tailor-made holiday itinerary.</p>
            <button className="btn-primary" onClick={resetFilters}>Reset All Filters</button>
          </div>
        )}

        {/* Custom Plan Enquiry Box */}
        <AnimatedSection anim="zoom-in" dur="slow" className="custom-plan-box">
          <div className="custom-plan-text">
            <h3>Want a customized trip tailored specifically for your group?</h3>
            <p>We arrange private tourist cabs, flight tickets, hotel reservations, and custom day-by-day plans from Coimbatore.</p>
          </div>
          <div className="custom-plan-cta">
            <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-secondary">
              <FaPhoneAlt /> Call {agencyInfo.phone}
            </a>
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20would%20like%20a%20custom%20tour%20plan`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <FaWhatsapp /> WhatsApp Custom Request
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PackagesPage;
