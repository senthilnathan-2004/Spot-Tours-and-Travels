import React, { useState, useEffect } from 'react';
import { MdSave, MdEdit, MdClose, MdRefresh, MdSettings, MdInfoOutline } from 'react-icons/md';
import { api } from '../utils/api.js';
import { agencyInfo } from '../../data/travelData.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';

const DEFAULT_SECTIONS = {
  agency: {
    name: agencyInfo.name,
    tagline: agencyInfo.tagline,
    phone: agencyInfo.phone,
    email: agencyInfo.email,
    address: agencyInfo.address,
    whatsapp: agencyInfo.whatsapp,
    weekdays: agencyInfo.workingHours.weekdays,
    sunday: agencyInfo.workingHours.sunday
  },
  hero: {
    title: 'Explore India & Beyond',
    subtitle: 'The Spot For Need\'s',
    tagline: 'Premier Tour Operator & Cab Services in Coimbatore'
  },
  announcement: {
    banner_active: 'true',
    banner_message: 'Summer Holiday Packages Open! Call 095005 51404 or WhatsApp for Customized Itineraries.'
  },
  highlights: {
    years_experience: '12+ Years',
    happy_travelers: '15,000+ Happy Guests',
    fleet_vehicles: '25+ Modern Fleet Cabs',
    customer_satisfaction: '99.4% Satisfaction Rate'
  },
  seo: {
    meta_title: 'Spot Tours and Travels | Premier Travel Agency in Coimbatore',
    meta_description: 'Spot Tours and Travels — Premium tour packages from Coimbatore. Ooty, Kodaikanal, Kerala, and International holidays.',
    meta_keywords: 'Spot Tours and Travels, Coimbatore tour packages, Ooty cab packages, Kodaikanal tours, Kerala holidays'
  }
};

export default function Content() {
  const [content, setContent] = useState({});
  const [editingKey, setEditingKey] = useState(null); // 'section.key'
  const [editVal, setEditVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    setLoading(true);
    try {
      const data = await api.getContent();
      const merged = { ...DEFAULT_SECTIONS };
      Object.entries(data.content || {}).forEach(([section, keys]) => {
        if (!merged[section]) merged[section] = {};
        Object.entries(keys).forEach(([key, val]) => {
          merged[section][key] = val;
        });
      });
      setContent(merged);
    } catch {
      setContent(DEFAULT_SECTIONS);
    } finally {
      setLoading(false);
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
      setContent(c => ({
        ...c,
        [section]: { ...(c[section] || {}), [key]: editVal }
      }));
      setEditingKey(null);
      setSuccess('Content updated in database!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      alert('Failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  const SECTION_CONFIG = {
    agency:       { title: '🏢 Agency Contact & Operating Hours', badge: 'BUSINESS INFO' },
    hero:         { title: '🖼️ Hero & Homepage Headings', badge: 'BRAND MESSAGING' },
    announcement: { title: '📢 Announcement & Offer Banner', badge: 'PROMOTION' },
    highlights:   { title: '⭐ Agency Stats & Key Highlights', badge: 'METRICS' },
    seo:          { title: '🔍 Search Engine Optimization (SEO)', badge: 'SEARCH & SOCIAL' }
  };

  if (loading) return <div className="adm-loading"><div className="adm-spinner" /> Loading site content…</div>;

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">CMS SETTINGS</div>
          <h1 className="adm-page-title">
            WEBSITE <span>CONTENT</span>
          </h1>
          <p className="adm-page-subtitle">
            Configure live contact information, agency operating hours, and SEO metadata.
          </p>
        </div>
        <button className="adm-btn adm-btn-ghost" onClick={loadContent}>
          <MdRefresh /> Refresh
        </button>
      </div>

      {success && <div className="adm-alert adm-alert-success">✅ {success}</div>}

      <div className="adm-alert adm-alert-info">
        <MdInfoOutline style={{ fontSize: '1.25rem', flexShrink: 0 }} />
        <div>
          Content modifications are stored directly in your MongoDB database under the <code>SiteContent</code> collection.
        </div>
      </div>

      {Object.entries(content).map(([section, fields]) => {
        const meta = SECTION_CONFIG[section] || { title: section, badge: 'SECTION' };

        return (
          <div key={section} className="adm-card" style={{ marginBottom: 24 }}>
            <div className="adm-card-header">
              <h2 className="adm-card-title">{meta.title}</h2>
              <span className="adm-badge adm-badge-confirmed" style={{ fontSize: '0.7rem' }}>
                {meta.badge}
              </span>
            </div>

            <div className="adm-card-body" style={{ padding: '8px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(fields).map(([key, val]) => {
                  const ek = `${section}.${key}`;
                  const isEditing = editingKey === ek;

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: isEditing ? 'flex-start' : 'center',
                        gap: 16,
                        padding: '16px 0',
                        borderBottom: '1px solid #F1F5F9'
                      }}
                    >
                      <div style={{ width: 180, flexShrink: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Oswald, sans-serif' }}>
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
                            {key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('banner') || key.toLowerCase().includes('logo') || (val && (val.startsWith('http') || val.startsWith('data:image'))) ? (
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
                                style={{ minHeight: 80, flex: 1, minWidth: 240 }}
                                autoFocus
                              />
                            )}
                            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                              <button
                                className="adm-btn adm-btn-success adm-btn-sm"
                                onClick={() => saveField(section, key)}
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
                            {val && (val.startsWith('http') || val.startsWith('data:image')) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={val} alt="Preview" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300, whiteSpace: 'nowrap' }}>
                                  {val.startsWith('data:') ? 'Uploaded Device Image (Base64)' : val}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.92rem', color: 'var(--adm-text-main)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                                {val || <em style={{ color: 'var(--adm-text-light)' }}>Not configured</em>}
                              </span>
                            )}
                            <button
                              className="adm-btn adm-btn-ghost adm-btn-icon adm-btn-sm"
                              onClick={() => startEdit(section, key, val)}
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
        );
      })}
    </div>
  );
}
