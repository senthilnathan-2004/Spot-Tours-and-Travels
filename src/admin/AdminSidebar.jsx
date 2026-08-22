import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdOutlineCardTravel,
  MdOutlineBookmarkBorder,
  MdOutlineEmail,
  MdOutlineArticle,
  MdOutlineAdminPanelSettings,
  MdOutlinePublic,
  MdOutlineTravelExplore,
  MdOutlineStarOutline,
  MdOutlinePlace,
  MdOutlineRateReview,
  MdOutlineMiscellaneousServices,
  MdOutlineAutoStories
} from 'react-icons/md';
import AdminNavSection from './components/AdminNavSection.jsx';
import AdminNavItem from './components/AdminNavItem.jsx';
import AdminUserMenu from './components/AdminUserMenu.jsx';
import AdminMobileSidebar from './components/AdminMobileSidebar.jsx';
import './AdminSidebar.css';

export default function AdminSidebar({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
  admin,
  notifCounts = { bookings: 0, enquiries: 0 }
}) {
  const location = useLocation();

  const handleNavClick = () => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="adm-sidebar-inner">
      {/* ── Brand Section ── */}
      <div className="adm-sidebar-brand">
        <Link to="/admin/dashboard" className="adm-brand-link" onClick={handleNavClick}>
          <div className="adm-brand-logo-frame">
            <img
              src="/logo.jpg"
              alt="Spot Tours and Travels"
              className="adm-brand-logo-img"
              onError={(e) => {
                // Fallback mark if logo image not found
                e.target.style.display = 'none';
              }}
            />
            <div className="adm-brand-logo-fallback">ST</div>
          </div>
          <div className="adm-brand-text">
            <div className="adm-brand-name">
              SPOT <span>TOURS</span>
            </div>
            <div className="adm-brand-badge">ADMIN SUITE</div>
          </div>
        </Link>
      </div>

      <div className="adm-sidebar-divider" />

      {/* ── Navigation Sections ── */}
      <nav className="adm-sidebar-nav" aria-label="Admin Navigation">
        {/* MAIN SECTION */}
        <AdminNavSection title="MAIN">
          <AdminNavItem
            to="/admin/dashboard"
            icon={MdOutlineDashboard}
            label="Dashboard"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/bookings"
            icon={MdOutlineBookmarkBorder}
            label="Bookings"
            badge={notifCounts.bookings}
            badgeType="warning"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/enquiries"
            icon={MdOutlineEmail}
            label="Enquiries & Leads"
            badge={notifCounts.enquiries}
            badgeType="danger"
            onClick={handleNavClick}
          />
        </AdminNavSection>

        {/* CMS & CONTENT SECTION */}
        <AdminNavSection title="CONTENT & CATALOG">
          <AdminNavItem
            to="/admin/packages"
            icon={MdOutlineCardTravel}
            label="Tour Packages"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/destinations"
            icon={MdOutlinePlace}
            label="Destinations"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/blogs"
            icon={MdOutlineAutoStories}
            label="Blogs & Guides"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/reviews"
            icon={MdOutlineRateReview}
            label="Guest Reviews"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/services"
            icon={MdOutlineMiscellaneousServices}
            label="Travel Services"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/content"
            icon={MdOutlineArticle}
            label="Page Content CMS"
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/admin/team"
            icon={MdOutlineAdminPanelSettings}
            label="Team & Staff"
            onClick={handleNavClick}
          />
        </AdminNavSection>

        {/* PUBLIC SECTION */}
        <AdminNavSection title="PUBLIC PAGES">
          <AdminNavItem
            to="/"
            icon={MdOutlinePublic}
            label="Live Website"
            external
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/packages"
            icon={MdOutlineTravelExplore}
            label="Public Packages"
            external
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/destinations"
            icon={MdOutlinePlace}
            label="Destinations"
            external
            onClick={handleNavClick}
          />
          <AdminNavItem
            to="/reviews"
            icon={MdOutlineStarOutline}
            label="Reviews Page"
            external
            onClick={handleNavClick}
          />
        </AdminNavSection>
      </nav>

      {/* ── Pinned Bottom Profile Area ── */}
      <div className="adm-sidebar-footer">
        <AdminUserMenu
          variant="sidebar"
          admin={admin}
          onNavigate={handleNavClick}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`adm-sidebar ${collapsed ? 'collapsed' : ''}`}
        aria-label="Sidebar Navigation"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      <AdminMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </AdminMobileSidebar>
    </>
  );
}
