import React from 'react';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import './FullGallery.css';

const allDestinations = [
  {
    title: "Munnar Tea Valleys, Kerala",
    src: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Taj Mahal, Agra",
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Goa Coastal Beaches",
    src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Dubai Skyline & Marina",
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Bali Tropical Paradise",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Ooty Botanical Hills",
    src: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Maldives Luxury Overwater Stays",
    src: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Singapore Marina Bay Sands",
    src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop"
  }
];

const FullGallery = ({ onClose }) => {
  return (
    <div className="full-gallery-overlay animate-fade">
      <div className="full-gallery-container animate-slide-up">
        <header className="full-gallery-header">
          <div>
            <h2>SPOT <span>TOURS & TRAVELS</span> DESTINATIONS</h2>
            <p className="full-gallery-sub">Custom Holiday Packages & Tour Planning From Coimbatore</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close Gallery">
            <FaTimes />
          </button>
        </header>
        
        <div className="full-gallery-grid">
          {allDestinations.map((item, idx) => (
            <div key={idx} className="full-gallery-item">
              <img src={item.src} alt={item.title} />
              <div className="full-gallery-item-caption">
                <span><FaMapMarkerAlt /> {item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullGallery;

