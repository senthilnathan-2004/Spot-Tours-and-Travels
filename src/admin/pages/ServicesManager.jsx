import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdRefresh, 
  MdClose, 
  MdSave,
  MdMiscellaneousServices
} from 'react-icons/md';
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
import { api } from '../utils/api.js';
import AdminAlert from '../components/AdminAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

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

const initialStaticServices = [
  {
    title: "Domestic Tour Packages",
    description: "Customized holiday packages across India including Ooty, Kodaikanal, Kerala, Goa, Kashmir, Himachal, and Rajasthan.",
    iconKey: "plane",
    order: 0,
    active: true
  },
  {
    title: "International Holiday Trips",
    description: "All-inclusive tour packages to Dubai, Singapore, Malaysia, Thailand, Bali, Sri Lanka, Europe, and Maldives.",
    iconKey: "globe",
    order: 1,
    active: true
  },
  {
    title: "Honeymoon Packages",
    description: "Romantic getaways with candlelit dinners, flower bed decorations, premium resort stays, and private sightseeing.",
    iconKey: "heart",
    order: 2,
    active: true
  },
  {
    title: "Pilgrimage & Spiritual Tours",
    description: "Dedicated spiritual yatras covering Varanasi, Rameswaram, Madurai, Tirupati, Char Dham, and Chidambaram.",
    iconKey: "om",
    order: 3,
    active: true
  },
  {
    title: "Tourist Taxi & Cab Rental",
    description: "AC & Non-AC sedan, SUV (Innova, Ertiga), and Tempo Traveller rentals with licensed, courteous chauffeurs in Coimbatore.",
    iconKey: "car",
    order: 4,
    active: true
  },
  {
    title: "Flight & Train Ticketing",
    description: "Instant flight booking, Tatkal train reservation assistance, and group ticketing support at best corporate rates.",
    iconKey: "ticket",
    order: 5,
    active: true
  },
  {
    title: "Visa & Passport Assistance",
    description: "Hassle-free tourist visa processing, document verification, appointment scheduling, and travel insurance assistance.",
    iconKey: "passport",
    order: 6,
    active: true
  },
  {
    title: "Hotel & Resort Bookings",
    description: "Verified budget, deluxe, luxury, and heritage resort bookings with complimentary breakfast and special deals.",
    iconKey: "hotel",
    order: 7,
    active: true
  }
];

const EMPTY_SERVICE = {
  title: '',
  description: '',
  iconKey: 'plane',
  order: 0,
  active: true
};

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await api.getAllServices();
      if (data.services && data.services.length > 0) {
        setServices(data.services);
      } else {
        setServices(initialStaticServices);
      }
    } catch {
      setServices(initialStaticServices);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingService(null);
    setForm(EMPTY_SERVICE);
    setModalOpen(true);
  }

  function openEdit(s) {
    setEditingService(s);
    setForm({ ...s });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService && editingService._id) {
        await api.updateService(editingService._id, form);
        showAlert('success', `Service "${form.title}" updated!`);
      } else {
        await api.createService(form);
        showAlert('success', `Service "${form.title}" created!`);
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      showAlert('error', `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmItem) return;
    setDeleting(true);
    try {
      if (deleteConfirmItem._id) await api.deleteService(deleteConfirmItem._id);
      showAlert('success', `Service "${deleteConfirmItem.title}" deleted.`);
      setDeleteConfirmItem(null);
      loadServices();
    } catch (err) {
      showAlert('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  }

  function showAlert(type, msg) {
    setAlert({ type, msg });
  }

  return (
    <div>
      <AdminAlert alert={alert} onClose={() => setAlert(null)} />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        title={`Delete Service?`}
        message={`Are you sure you want to permanently delete "${deleteConfirmItem?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmItem(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">SERVICES CMS</div>
          <h1 className="adm-page-title">
            TRAVEL <span>OFFERINGS &amp; SERVICES</span>
          </h1>
          <p className="adm-page-subtitle">
            Manage travel solutions, packages, vehicle rentals, and booking services displayed in the animated scrolling section.
          </p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-btn adm-btn-ghost" onClick={loadServices}>
            <MdRefresh /> Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <MdAdd /> Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Loading services…</div>
      ) : services.length === 0 ? (
        <div className="adm-empty-state">
          <MdMiscellaneousServices style={{ fontSize: '3rem', color: 'var(--adm-text-light)' }} />
          <h3>No services found</h3>
          <p>Add the travel and booking services your agency offers.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {services.map((s, idx) => (
            <div key={s._id || idx} className="adm-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EFF6FF', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {ICON_MAP[s.iconKey] || <FaPlaneArrival />}
                </div>
                <span className="adm-badge adm-badge-confirmed" style={{ fontSize: '0.7rem' }}>
                  Order #{s.order !== undefined ? s.order : idx}
                </span>
              </div>

              <h3 style={{ margin: '0 0 8px', color: 'var(--adm-text-main)', fontSize: '1.1rem', fontFamily: 'Oswald, sans-serif' }}>
                {s.title}
              </h3>

              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--adm-text-muted)', lineHeight: 1.5, flex: 1 }}>
                {s.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(s)}>
                  <MdEdit /> Edit
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteConfirmItem(s)}>
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3 className="adm-modal-title">
                  {editingService ? `Edit Service: ${editingService.title}` : 'Add Travel Service'}
                </h3>
              </div>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="adm-label">Service Title *</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    required
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Flight & Train Ticketing"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="adm-label">Icon Type</label>
                    <select 
                      className="adm-input"
                      value={form.iconKey}
                      onChange={e => setForm({ ...form, iconKey: e.target.value })}
                    >
                      <option value="plane">✈️ Plane (Domestic/Tours)</option>
                      <option value="globe">🌍 Globe (International)</option>
                      <option value="heart">💖 Heart (Honeymoon)</option>
                      <option value="om">🕉️ Om (Pilgrimage/Temple)</option>
                      <option value="car">🚗 Car / Cab Rentals</option>
                      <option value="ticket">🎫 Ticket (Flights/Trains)</option>
                      <option value="passport">🛂 Passport & Visas</option>
                      <option value="hotel">🏨 Hotel & Resorts</option>
                    </select>
                  </div>

                  <div>
                    <label className="adm-label">Display Order</label>
                    <input 
                      type="number" 
                      className="adm-input" 
                      value={form.order} 
                      onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="adm-label">Service Description *</label>
                  <textarea 
                    className="adm-textarea" 
                    rows={3}
                    required
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what is offered in this service..."
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  <MdSave /> {saving ? 'Saving…' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
