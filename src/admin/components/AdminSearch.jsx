import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdSearch,
  MdClose,
  MdOutlineCardTravel,
  MdOutlineBookmarkBorder,
  MdOutlineEmail,
  MdOutlineArticle,
  MdOutlineAdminPanelSettings,
  MdOutlineDashboard
} from 'react-icons/md';

const QUICK_LINKS = [
  { label: 'Dashboard Overview', path: '/admin/dashboard', category: 'Navigation', icon: MdOutlineDashboard },
  { label: 'Tour Packages Management', path: '/admin/packages', category: 'Tours', icon: MdOutlineCardTravel },
  { label: 'Customer Bookings', path: '/admin/bookings', category: 'Bookings', icon: MdOutlineBookmarkBorder },
  { label: 'Customer Enquiries & Leads', path: '/admin/enquiries', category: 'Leads', icon: MdOutlineEmail },
  { label: 'Website Content & Banner', path: '/admin/content', category: 'Content', icon: MdOutlineArticle },
  { label: 'Admin Team & Roles', path: '/admin/team', category: 'Settings', icon: MdOutlineAdminPanelSettings },
];

export default function AdminSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if (e.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? QUICK_LINKS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_LINKS;

  function handleSelect(path) {
    navigate(path);
    setFocused(false);
    setQuery('');
    inputRef.current?.blur();
  }

  return (
    <div className="adm-header-search-container" ref={searchRef}>
      <div className={`adm-header-search-box ${focused ? 'focused' : ''}`}>
        <MdSearch className="adm-header-search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search packages, bookings, customers..."
          className="adm-header-search-input"
          aria-label="Global Admin Search"
        />
        {query ? (
          <button
            type="button"
            className="adm-header-search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <MdClose />
          </button>
        ) : (
          <kbd className="adm-header-search-kbd">⌘K</kbd>
        )}
      </div>

      {focused && (
        <div className="adm-search-spotlight-dropdown">
          <div className="adm-spotlight-header">
            <span>{query ? `Results for "${query}"` : 'Quick Navigation'}</span>
            <span className="adm-spotlight-hint">ESC to close</span>
          </div>

          <div className="adm-spotlight-results">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    className="adm-spotlight-item"
                    onClick={() => handleSelect(item.path)}
                  >
                    <div className="adm-spotlight-icon-wrap">
                      <Icon />
                    </div>
                    <div className="adm-spotlight-text">
                      <span className="adm-spotlight-title">{item.label}</span>
                      <span className="adm-spotlight-cat">{item.category}</span>
                    </div>
                    <span className="adm-spotlight-arrow">→</span>
                  </button>
                );
              })
            ) : (
              <div className="adm-spotlight-empty">
                No sections found matching "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
