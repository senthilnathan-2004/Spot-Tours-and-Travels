import React, { useState } from 'react';
import { FaEye, FaMapMarkerAlt } from 'react-icons/fa';
import FullGallery from './FullGallery';
import './Gallery.css';

const featuredDestinations = [
  {
    title: "Munnar, Kerala",
    tag: "Hill Station & Tea Valleys",
    src: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Taj Mahal, Agra",
    tag: "Heritage & Wonders of World",
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Goa Beaches",
    tag: "Coastal Holidays & Sunsets",
    src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Dubai, UAE",
    tag: "Luxury Cityscape & Desert Safari",
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Bali, Indonesia",
    tag: "Tropical Paradise & Culture",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Ooty & Nilgiris",
    tag: "Queen of Hill Stations",
    src: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop"
  }
];

const Gallery = () => {
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);

  return (
    <>
      <section id="gallery" className="gallery-section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-tag">POPULAR DESTINATIONS</div>
            <h2 className="section-title">TOP <span>TRAVEL ATTRACTIONS</span></h2>
            <p className="gallery-subtitle">
              Explore breathtaking domestic and international destinations curated by Spot Tours and Travels
            </p>
          </div>

          <div className="gallery-grid">
            {featuredDestinations.map((item, idx) => (
              <div key={idx} className="gallery-card animate-fade" onClick={() => setIsFullGalleryOpen(true)}>
                <div className="gallery-img-box">
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <div className="gallery-overlay">
                    <span className="view-btn"><FaEye /> View Gallery</span>
                  </div>
                </div>
                <div className="gallery-info">
                  <span className="gallery-tag">{item.tag}</span>
                  <h3><FaMapMarkerAlt className="pin-icon" /> {item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-actions">
            <button
              id="view-all-btn"
              className="btn-primary"
              onClick={() => setIsFullGalleryOpen(true)}
            >
              Explore All Destinations & Gallery
            </button>
          </div>
        </div>
      </section>

      {isFullGalleryOpen && <FullGallery onClose={() => setIsFullGalleryOpen(false)} />}
    </>
  );
};

export default Gallery;

