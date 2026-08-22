import React, { useState, useEffect } from 'react';
import { 
  MdSave, 
  MdEdit, 
  MdRefresh, 
  MdInfoOutline, 
  MdBusiness, 
  MdHome, 
  MdStar, 
  MdInfo, 
  MdCardTravel, 
  MdPublic, 
  MdRateReview, 
  MdArticle, 
  MdContactMail, 
  Md3dRotation, 
  MdSearch,
  MdCheckCircle
} from 'react-icons/md';
import { api } from '../utils/api.js';
import { agencyInfo } from '../../data/travelData.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';
import AdminAlert from '../components/AdminAlert.jsx';

const DEFAULT_SECTIONS = {
  agency: {
    name: agencyInfo.name || "Spot Tours and Travels",
    tagline: agencyInfo.tagline || "The Spot For Need's",
    phone: agencyInfo.phone || "095005 51404",
    phoneRaw: agencyInfo.phoneRaw || "09500551404",
    whatsapp: agencyInfo.whatsapp || "+91 95005 51404",
    whatsappRaw: agencyInfo.whatsappRaw || "919500551404",
    email: agencyInfo.email || "spottoursandtravels@gmail.com",
    address: agencyInfo.address || "8/95, Palakkad - Coimbatore Rd, near SBI Bank, Pulakadu, Kuniyamuthur, Coimbatore, Tamil Nadu 641008",
    plusCode: agencyInfo.plusCode || "XX53+GJ Coimbatore, Tamil Nadu",
    weekdays: agencyInfo.workingHours?.weekdays || "Mon - Sat: 9:00 AM – 8:30 PM",
    sunday: agencyInfo.workingHours?.sunday || "Sunday: 9:00 AM – 2:00 PM"
  },
  hero: {
    hero_badge: "COIMBATORE'S PREMIER TRAVEL PARTNER",
    hero_title: "DISCOVER THE WORLD WITH SPOT TOURS & TRAVELS",
    hero_subtitle: "Specializing in customized domestic tours, international holidays, honeymoon packages, flight/train ticketing, and premium cab rentals from Kuniyamuthur, Coimbatore.",
    stat_rating: "4.7",
    stat_reviews: "Google Rating (34 Reviews)",
    stat_destinations: "100+",
    stat_destinations_label: "Tour Destinations",
    stat_customized: "100%",
    stat_customized_label: "Customized Itineraries",
    cta_primary: "View All Tour Packages",
    cta_secondary: "WhatsApp Enquire"
  },
  why_us: {
    section_tag: "WHY TRAVEL WITH US",
    section_title: "THE SPOT TOURS & TRAVELS ADVANTAGE",
    section_subtitle: "Headquartered in Kuniyamuthur, Coimbatore, we deliver genuine hospitality, transparent pricing, and 100% peace of mind.",
    card1_title: "100% Verified & Safe Stays",
    card1_desc: "We handpick only hygienic, top-reviewed 3-star to 5-star hotels and luxury houseboats checked for family and couple safety.",
    card2_title: "Tailor-Made Flexible Plans",
    card2_desc: "Customise sightseeing spots, vehicle types, stay durations, and meal preferences exactly according to your group's budget.",
    card3_title: "24/7 Dedicated Trip Coordinator",
    card3_desc: "Our Coimbatore travel specialist is always one call away throughout your journey to ensure seamless travel from day one.",
    card4_title: "4.7★ Top Rated in Coimbatore",
    card4_desc: "Backed by 34+ verified Google reviews from satisfied families, honeymooners, and corporate clients."
  },
  about: {
    page_tag: "ABOUT OUR AGENCY",
    page_title: "SPOT TOURS & TRAVELS",
    page_subtitle: "The Spot For Need's — Coimbatore's Most Trusted Travel Companion for Domestic & Overseas Holidays",
    journey_tag: "OUR JOURNEY",
    journey_title: "CREATING MEMORIES THAT LAST A LIFETIME",
    lead_paragraph: "Founded on the belief that travel should be enriching, transparent, and completely stress-free, Spot Tours and Travels has grown into one of Coimbatore's premier travel agencies and tour operators.",
    story_paragraph_1: "Located conveniently on Palakkad - Coimbatore Road (near SBI Bank, Pulakadu, Kuniyamuthur), we specialize in organizing customized family vacations, romantic honeymoons, spiritual temple pilgrimages, corporate outings, and reliable 24/7 outstation tourist cab rentals.",
    story_paragraph_2: "Under our brand promise 'The Spot For Need's', we take care of every minute detail: flight/train ticketing, star hotel reservations, local sightseeing with experienced polite chauffeurs, and dedicated trip coordinator assistance.",
    highlight_1: "100% Customized Itineraries to match your budget",
    highlight_2: "Transparent, upfront pricing with zero hidden surcharges",
    highlight_3: "Handpicked 3-Star, 4-Star & 5-Star verified hygienic resorts",
    highlight_4: "Well-maintained AC Sedans, Innovas, and Tempo Travelers",
    office_photo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop",
    floating_stat_score: "4.7★",
    floating_stat_text: "Google Rating (34+ Reviews)",
    credential_1_title: "4.7 Google Rating",
    credential_1_desc: "Consistently rated 4.7 stars across 34+ verified customer reviews for top-notch service and punctuality.",
    credential_2_title: "Licensed Tour Operator",
    credential_2_desc: "Government-registered travel agency with commercial passenger transport permits and safety assurance.",
    credential_3_title: "Transparent Pricing",
    credential_3_desc: "Clear, itemized billing including tolls, driver allowances, and taxes with zero surprise charges.",
    credential_4_title: "Senior & Family Care",
    credential_4_desc: "Special pacing, ground-floor room allocations, and patient drivers trained for elder comfort."
  },
  packages_page: {
    page_tag: "TOUR ITINERARIES",
    page_title: "ALL TOUR PACKAGES",
    page_subtitle: "Explore handcrafted domestic & international tour packages starting from Coimbatore. 100% customizable to your schedule and budget.",
    custom_box_title: "Want a customized trip tailored specifically for your group?",
    custom_box_desc: "We arrange private tourist cabs, flight tickets, hotel reservations, and custom day-by-day plans from Coimbatore."
  },
  destinations_page: {
    page_tag: "EXPLORE THE WORLD",
    page_title: "POPULAR DESTINATIONS",
    page_subtitle: "From misty hill tops in the Nilgiris to turquoise tropical waters and grand world heritage sites. Discover your next journey starting from Coimbatore."
  },
  reviews_page: {
    page_tag: "VERIFIED REVIEWS",
    page_title: "TRAVELER TESTIMONIALS",
    page_subtitle: "Read real experiences and reviews from our travelers across Coimbatore and South India.",
    overall_rating: "4.7",
    review_source: "Based on 34+ Google Reviews"
  },
  blog_page: {
    page_tag: "TRAVEL GUIDES & TIPS",
    page_title: "SPOT TOURS TRAVEL BLOG",
    page_subtitle: "Expert travel advice, custom itinerary guides, temple circuits, and packing tips from Coimbatore travel specialists."
  },
  contact_page: {
    page_tag: "GET IN TOUCH",
    page_title: "CONTACT OUR OFFICE",
    page_subtitle: "Visit our Kuniyamuthur office or reach out via phone, email, or WhatsApp for quick holiday quotes.",
    office_details_heading: "OUR OFFICE DETAILS",
    office_details_sub: "We are located directly on Palakkad - Coimbatore Road, next to SBI Bank in Kuniyamuthur. Drop in anytime or call for prompt trip quotes!",
    enquiry_form_heading: "SEND US AN ENQUIRY",
    enquiry_form_sub: "Fill out this form and our team will get back to you with custom itinerary and pricing within 30 minutes!"
  },
  showcases: {
    orbit_tag: "360° IMMERSIVE EXPLORER",
    orbit_title: "DISCOVER THE WORLD IN 360° ORBIT",
    orbit_subtitle: "Glide through iconic global wonders. Hover over any destination card to pause the orbit and explore trip details.",
    gallery_tag: "3D PERSPECTIVE GALLERY",
    gallery_title: "CAPTURING REAL TRAVEL EXPERIENCES",
    gallery_subtitle: "Immerse yourself in dynamic 3D moments captured across our signature tours. Click or swipe any card to focus."
  },
  seo: {
    meta_title: "Spot Tours and Travels | Premier Travel Agency in Coimbatore",
    meta_description: "Spot Tours and Travels — Premium tour packages from Coimbatore. Ooty, Kodaikanal, Kerala, and International holidays.",
    meta_keywords: "Spot Tours and Travels, Coimbatore tour packages, Ooty cab packages, Kodaikanal tours, Kerala holidays",
    announcement_active: "true",
    announcement_message: "Summer Holiday Packages Open! Call 095005 51404 or WhatsApp for Customized Itineraries."
  }
};

const TAB_CONFIG = [
  { id: 'agency', label: 'Agency & Contacts', icon: MdBusiness },
  { id: 'hero', label: 'Hero & Home Stats', icon: MdHome },
  { id: 'why_us', label: 'Why Travel With Us', icon: MdStar },
  { id: 'about', label: 'About Us & Story', icon: MdInfo },
  { id: 'packages_page', label: 'Packages Page', icon: MdCardTravel },
  { id: 'destinations_page', label: 'Destinations Page', icon: MdPublic },
  { id: 'reviews_page', label: 'Reviews Page', icon: MdRateReview },
  { id: 'blog_page', label: 'Blog Page', icon: MdArticle },
  { id: 'contact_page', label: 'Contact Page', icon: MdContactMail },
  { id: 'showcases', label: '360° Orbit & 3D Gallery', icon: Md3dRotation },
  { id: 'seo', label: 'SEO & Announcement', icon: MdSearch }
];

export default function Content() {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('spot_admin_content_cache');
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_SECTIONS;
  });
  const [activeTab, setActiveTab] = useState('agency');
  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    setSyncing(true);
    try {
      const data = await api.getContent();
      const merged = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
      if (data.content) {
        Object.entries(data.content).forEach(([section, keys]) => {
          if (!merged[section]) merged[section] = {};
          Object.entries(keys).forEach(([k, v]) => {
            merged[section][k] = v;
          });
        });
      }
      setContent(merged);
      try {
        localStorage.setItem('spot_admin_content_cache', JSON.stringify(merged));
      } catch {}
    } catch {
      // keep current cached / default content
    } finally {
      setSyncing(false);
    }
  }

  function startEdit(section, key, val) {
    setEditingKey(`${section}.${key}`);
    setEditVal(val || '');
  }

  async function saveField(section, key) {
    setSaving(true);
    try {
      await api.updateContent(section, key, editVal);
      setContent(c => {
        const next = {
          ...c,
          [section]: { ...(c[section] || {}), [key]: editVal }
        };
        try {
          localStorage.setItem('spot_admin_content_cache', JSON.stringify(next));
        } catch {}
        return next;
      });
      setEditingKey(null);
      showAlert('success', `Updated "${key.replace(/_/g, ' ')}" in live database!`);
    } catch (e) {
      showAlert('error', 'Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAllInActiveSection() {
    setSaving(true);
    try {
      const currentFields = content[activeTab] || {};
      const updates = Object.entries(currentFields).map(([key, val]) => ({
        section: activeTab,
        key,
        value: val
      }));
      await api.updateBulkContent(updates);
      try {
        localStorage.setItem('spot_admin_content_cache', JSON.stringify(content));
      } catch {}
      showAlert('success', `All fields in "${activeTab.replace(/_/g, ' ')}" saved to database!`);
    } catch (e) {
      showAlert('error', 'Batch save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  function showAlert(type, msg) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  }

  const activeFields = content[activeTab] || {};

  return (
    <div>
      <AdminAlert alert={alert} onClose={() => setAlert(null)} />

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">GLOBAL CMS</div>
          <h1 className="adm-page-title">
            WEBSITE <span>CONTENT &amp; TEXT</span>
          </h1>
          <p className="adm-page-subtitle">
            Update headings, descriptions, stats counters, trust badges, story texts, and contact details across all public pages in real time.
          </p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-btn adm-btn-ghost" onClick={loadContent}>
            <MdRefresh /> Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={saveAllInActiveSection} disabled={saving}>
            <MdSave /> {saving ? 'Saving...' : 'Save Current Section'}
          </button>
        </div>
      </div>

      {/* Modern Tabs Bar */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {TAB_CONFIG.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setEditingKey(null);
              }}
              className={`adm-btn ${isActive ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
            >
              <Icon style={{ fontSize: '1.1rem' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Section Editor Card */}
      <div className="adm-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">
            {TAB_CONFIG.find(t => t.id === activeTab)?.label}
          </h2>
          <span className={`adm-badge ${syncing ? 'adm-badge-pending' : 'adm-badge-confirmed'}`} style={{ textTransform: 'uppercase' }}>
            {syncing ? 'Syncing...' : 'Live Sync Active'}
          </span>
        </div>

          <div className="adm-card-body" style={{ padding: '12px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.entries(activeFields).map(([key, val]) => {
                const ek = `${activeTab}.${key}`;
                const isEditing = editingKey === ek;
                const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('banner') || (val && typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:image')));

                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: isEditing ? 'flex-start' : 'center',
                      gap: 20,
                      padding: '16px 0',
                      borderBottom: '1px solid #F1F5F9',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ width: 220, flexShrink: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Oswald, sans-serif' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 280 }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
                          {isImage ? (
                            <div style={{ flex: 1, minWidth: 260 }}>
                              <AdminImageUpload
                                label={key.replace(/_/g, ' ')}
                                value={editVal}
                                onChange={setEditVal}
                                helpText="Upload a file or paste image URL."
                                previewHeight={140}
                              />
                            </div>
                          ) : (
                            <textarea
                              className="adm-textarea"
                              value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              style={{ minHeight: val && val.length > 80 ? 100 : 60, flex: 1, minWidth: 240 }}
                              autoFocus
                            />
                          )}
                          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                            <button
                              className="adm-btn adm-btn-success adm-btn-sm"
                              onClick={() => saveField(activeTab, key)}
                              disabled={saving}
                            >
                              <MdSave /> {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              className="adm-btn adm-btn-ghost adm-btn-sm"
                              onClick={() => setEditingKey(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          {isImage ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img 
                                src={val} 
                                alt="Preview" 
                                style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0' }} 
                              />
                              <span style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 360, whiteSpace: 'nowrap' }}>
                                {val.startsWith('data:') ? 'Uploaded Device Image' : val}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.92rem', color: 'var(--adm-text-main)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                              {val || <em style={{ color: 'var(--adm-text-light)' }}>Not configured</em>}
                            </span>
                          )}
                          <button
                            className="adm-btn adm-btn-ghost adm-btn-icon adm-btn-sm"
                            onClick={() => startEdit(activeTab, key, val)}
                            title="Edit Field"
                          >
                            <MdEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}
