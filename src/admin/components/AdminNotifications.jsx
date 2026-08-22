import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdNotificationsNone,
  MdBookmark,
  MdEmail,
  MdCheckCircle,
  MdArrowForward
} from 'react-icons/md';

export default function AdminNotifications({ notifCounts = { bookings: 0, enquiries: 0 } }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalUnread = (notifCounts.bookings || 0) + (notifCounts.enquiries || 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="adm-header-notif-wrap" ref={dropdownRef}>
      <button
        type="button"
        className={`adm-header-btn adm-header-btn-icon ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={`Notifications (${totalUnread} unread)`}
        aria-expanded={open}
      >
        <MdNotificationsNone />
        {totalUnread > 0 && (
          <span className="adm-header-badge-dot">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="adm-header-notif-dropdown">
          <div className="adm-notif-header">
            <div className="adm-notif-title">Notifications</div>
            {totalUnread > 0 ? (
              <span className="adm-notif-count-tag">{totalUnread} new</span>
            ) : (
              <span className="adm-notif-count-tag clear">All caught up</span>
            )}
          </div>

          <div className="adm-notif-list">
            {/* Bookings alert */}
            <Link
              to="/admin/bookings"
              className="adm-notif-item"
              onClick={() => setOpen(false)}
            >
              <div className="adm-notif-icon-box booking">
                <MdBookmark />
              </div>
              <div className="adm-notif-content">
                <div className="adm-notif-item-title">
                  {notifCounts.bookings > 0
                    ? `${notifCounts.bookings} Pending Booking${notifCounts.bookings > 1 ? 's' : ''}`
                    : 'Customer Bookings'}
                </div>
                <div className="adm-notif-item-desc">
                  {notifCounts.bookings > 0
                    ? 'Requires review and customer confirmation'
                    : 'No pending booking requests'}
                </div>
              </div>
              <MdArrowForward className="adm-notif-arrow" />
            </Link>

            {/* Enquiries alert */}
            <Link
              to="/admin/enquiries"
              className="adm-notif-item"
              onClick={() => setOpen(false)}
            >
              <div className="adm-notif-icon-box enquiry">
                <MdEmail />
              </div>
              <div className="adm-notif-content">
                <div className="adm-notif-item-title">
                  {notifCounts.enquiries > 0
                    ? `${notifCounts.enquiries} New Enquir${notifCounts.enquiries > 1 ? 'ies' : 'y'}`
                    : 'Customer Enquiries'}
                </div>
                <div className="adm-notif-item-desc">
                  {notifCounts.enquiries > 0
                    ? 'Direct inquiries awaiting follow up'
                    : 'All customer leads addressed'}
                </div>
              </div>
              <MdArrowForward className="adm-notif-arrow" />
            </Link>

            {/* Live System Status */}
            <div className="adm-notif-item static">
              <div className="adm-notif-icon-box system">
                <MdCheckCircle />
              </div>
              <div className="adm-notif-content">
                <div className="adm-notif-item-title">Real-Time Sync Active</div>
                <div className="adm-notif-item-desc">MongoDB database connected & synced</div>
              </div>
            </div>
          </div>

          <div className="adm-notif-footer">
            <Link
              to="/admin/dashboard"
              className="adm-notif-footer-link"
              onClick={() => setOpen(false)}
            >
              View Analytics Overview
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
