import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose, MdPerson, MdRefresh, MdShield } from 'react-icons/md';
import { api } from '../utils/api.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';
import AdminAlert from '../components/AdminAlert.jsx';

const EMPTY = { name: '', role: '', experience: '', speciality: '', image: '' };

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { members } = await api.getTeam();
      setMembers(members || []);
    } catch {}
    finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(m) { setForm({ name: m.name, role: m.role, experience: m.experience || '', speciality: m.speciality || '', image: m.image || '' }); setSelected(m); setError(''); setModal('edit'); }
  function openDelete(m) { setSelected(m); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); setError(''); }

  async function handleSave() {
    setError(''); setSaving(true);
    try {
      if (modal === 'add') await api.createTeamMember(form);
      else await api.updateTeamMember(selected._id, form);
      setSuccess(modal === 'add' ? 'Team member added!' : 'Team member updated!');
      setTimeout(() => setSuccess(''), 3000);
      closeModal();
      load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await api.deleteTeamMember(selected._id);
      setSuccess('Team member removed');
      setTimeout(() => setSuccess(''), 3000);
      closeModal();
      load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">ABOUT US TEAM</div>
          <h1 className="adm-page-title">
            TOUR <span>SPECIALISTS</span>
          </h1>
          <p className="adm-page-subtitle">
            Manage your company founders, tour planners, and logistics coordinators displayed on the About page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="adm-btn adm-btn-ghost" onClick={load} title="Refresh team list">
            <MdRefresh />
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openAdd}>
            <MdAdd /> Add Specialist
          </button>
        </div>
      </div>

      <AdminAlert 
        alert={success ? { type: 'success', msg: success } : (error ? { type: 'error', msg: error } : null)} 
        onClose={() => { setSuccess(''); setError(''); }} 
      />

      {loading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Loading team specialists…</div>
      ) : members.length === 0 ? (
        <div className="adm-card">
          <div className="adm-empty">
            <div className="adm-empty-icon">👤</div>
            <h3>No Specialists Configured</h3>
            <p>Click "Add Specialist" to add a member to your team roster.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
          {members.map(m => (
            <div key={m._id} className="adm-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Photo Frame */}
              <div style={{ height: 220, width: '100%', position: 'relative', overflow: 'hidden', background: '#E2E8F0' }}>
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#94A3B8' }}>
                    <MdPerson style={{ fontSize: '3.5rem' }} />
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                  <span style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>
                    {m.experience || 'Specialist'}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: '1.25rem', color: 'var(--adm-text-main)', letterSpacing: '0.4px' }}>
                  {m.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--adm-primary)', fontWeight: 700, marginTop: 2 }}>
                  {m.role}
                </div>

                {m.speciality && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--adm-text-muted)', marginTop: 8, lineHeight: 1.5, flex: 1 }}>
                    🎯 {m.speciality}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(m)}>
                  <MdEdit /> Edit
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => openDelete(m)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">
                {modal === 'add' ? <><MdAdd /> Add Team Specialist</> : <><MdEdit /> Edit Team Specialist</>}
              </h3>
              <button className="adm-modal-close" onClick={closeModal}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}

              <div className="adm-form-group">
                <label className="adm-label">Full Name *</label>
                <input className="adm-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Senthil Nathan" />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Designation / Role *</label>
                <input className="adm-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Founder & Chief Tour Planner" />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Experience Badge</label>
                <input className="adm-input" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 15+ Years in Tourism" />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Speciality / Bio Note</label>
                <input className="adm-input" value={form.speciality} onChange={e => setForm(p => ({ ...p, speciality: e.target.value }))} placeholder="e.g. Domestic Holiday Packages & Group Tours" />
              </div>

              <AdminImageUpload
                label="Specialist Photo / Avatar"
                value={form.image}
                onChange={v => setForm(p => ({ ...p, image: v }))}
                helpText="Upload a photo from your device or paste a web URL."
                previewHeight={140}
              />
            </div>

            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Specialist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === 'delete' && selected && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header" style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B)' }}>
              <h3 className="adm-modal-title" style={{ color: '#FFFFFF' }}>⚠️ Remove Specialist</h3>
              <button className="adm-modal-close" onClick={closeModal}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>{selected.name}</strong> from your team specialists?
              </p>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting…' : 'Yes, Remove Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
