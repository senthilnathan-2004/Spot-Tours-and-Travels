import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaClock, 
  FaMapMarkerAlt, 
  FaStar, 
  FaArrowRight, 
  FaSearch, 
  FaPhoneAlt, 
  FaWhatsapp,
  FaFilter,
  FaUndo,
  FaChevronDown,
  FaChevronUp,
  FaCheck
} from 'react-icons/fa';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import CustomSelect from '../components/CustomSelect';
import './PackagesPage.css';

const PackagesPage = () => {
  const { packages: tourPackages, agencyInfo, content } = useData();
  const pkgContent = content?.packages_page || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPackages = (tourPackages || []).filter((pkg) => {
    const matchesSearch = searchTerm === '' || 
      (pkg.title && pkg.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pkg.destination && pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || pkg.region === selectedRegion;

    let matchesDuration = true;
    if (selectedDuration === 'weekend') {
      matchesDuration = pkg.durationDays <= 3;
    } else if (selectedDuration === 'medium') {
      matchesDuration = pkg.durationDays >= 4 && pkg.durationDays <= 5;
    } else if (selectedDuration === 'long') {
      matchesDuration = pkg.durationDays >= 6;
    }

    const matchesTheme = selectedTheme === 'All' || pkg.theme === selectedTheme;

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
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">
            {pkgContent.page_tag || "TOUR ITINERARIES"}
          </AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">
            {pkgContent.page_title || "ALL TOUR PACKAGES"}
          </AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">
            {pkgContent.page_subtitle || "Explore handcrafted domestic & international tour packages starting from Coimbatore. 100% customizable to your schedule and budget."}
          </AnimatedSection>
        </div>
      </div>

      <div className="container packages-container">
        {/* Filters Wrapper */}
        <div className="packages-filter-wrapper">
          <div className="filter-header">
            <div className="filter-title-wrap" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <h3><FaFilter /> FILTER PACKAGES</h3>
              <span className="mobile-filter-toggle-badge">
                {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            <button className="reset-btn" onClick={resetFilters} title="Reset All Filters">
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

            {/* Region Select */}
            <div className="filter-item">
              <label>Region / Circuit</label>
              <CustomSelect
                value={selectedRegion}
                onChange={setSelectedRegion}
                options={[
                  { value: 'All', label: 'All Regions' },
                  { value: 'South India', label: 'South India' },
                  { value: 'North India', label: 'North India' },
                  { value: 'International', label: 'International' },
                  { value: 'Spiritual', label: 'Spiritual' }
                ]}
              />
            </div>

            {/* Duration Select */}
            <div className="filter-item">
              <label>Duration</label>
              <CustomSelect
                value={selectedDuration}
                onChange={setSelectedDuration}
                options={[
                  { value: 'All', label: 'All Durations' },
                  { value: 'weekend', label: 'Weekend (1-3 Days)' },
                  { value: 'medium', label: 'Standard (4-5 Days)' },
                  { value: 'long', label: 'Grand Tour (6+ Days)' }
                ]}
              />
            </div>

            {/* Price Select */}
            <div className="filter-item">
              <label>Budget Per Person</label>
              <CustomSelect
                value={selectedPrice}
                onChange={setSelectedPrice}
                options={[
                  { value: 'All', label: 'All Budgets' },
                  { value: 'under-10k', label: 'Under ₹10,000' },
                  { value: '10k-25k', label: '₹10,000 - ₹25,000' },
                  { value: 'above-25k', label: 'Above ₹25,000' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-counter">
          Showing <strong>{filteredPackages.length}</strong> available travel packages
        </div>

        {/* Packages Cards Grid */}
        {filteredPackages.length > 0 ? (
          <div className="packages-grid">
            {filteredPackages.map((pkg, idx) => (
              <AnimatedSection key={pkg._id || pkg.id} anim="fade-up" delay={String((idx % 3) * 150 + 100)}>
                <div className={`package-card ${pkg.popular ? 'featured' : ''}`}>
                  {pkg.popular && (
                    <span className="package-popular-badge">
                      Popular
                    </span>
                  )}
                  <div className="package-image-wrap">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" />
                    <span className="package-duration-pill"><FaClock /> {pkg.duration}</span>
                  </div>

                  <div className="package-body">
                    <div className="package-meta">
                      <span className="package-region"><FaMapMarkerAlt /> {pkg.region}</span>
                      <span className="package-rating"><FaStar className="gold-star-inline" /> {pkg.rating} ({pkg.reviews})</span>
                    </div>

                    <h3 className="package-title">{pkg.title}</h3>
                    <p className="package-destination-text">{pkg.destination}</p>

                    <ul className="package-highlights-list">
                      {(pkg.highlights || []).slice(0, 3).map((h, i) => (
                        <li key={i}><FaCheck className="check-icon" /> {h}</li>
                      ))}
                    </ul>

                    <div className="package-footer">
                      <div className="package-pricing">
                        <span className="price-from">Starting From</span>
                        <div className="price-tag">
                          ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                          <span className="price-unit">/person</span>
                        </div>
                      </div>

                      <div className="package-actions">
                        <Link to={`/package/${pkg.id || pkg._id}`} className="btn-primary package-detail-btn">
                          View Itinerary <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="no-packages-found">
            <h3>No packages match your search</h3>
            <p>Try adjusting your search query, region, or price filters to see more results.</p>
            <button className="btn-secondary" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        )}

        {/* Custom Itinerary Callout Box */}
        <AnimatedSection anim="zoom-in" dur="slow" className="custom-plan-box">
          <div className="custom-plan-text">
            <h3>{pkgContent.custom_box_title || "WANT A CUSTOMIZED TRIP TAILORED SPECIFICALLY FOR YOUR GROUP?"}</h3>
            <p>{pkgContent.custom_box_desc || "We arrange private tourist cabs, flight tickets, hotel reservations, and custom day-by-day plans from Coimbatore."}</p>
          </div>
          <div className="custom-plan-cta">
            <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-secondary">
              <FaPhoneAlt /> Call {agencyInfo.phone}
            </a>
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20want%20a%20customized%20tour%20plan`} 
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
