import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import DestinationsPage from './pages/DestinationsPage';
import AboutPage from './pages/AboutPage';
import ReviewsPage from './pages/ReviewsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import AdminApp from './admin/AdminApp';
import Dashboard from './admin/pages/Dashboard';
import Packages from './admin/pages/Packages';
import Destinations from './admin/pages/Destinations';
import Blogs from './admin/pages/Blogs';
import ReviewsManager from './admin/pages/ReviewsManager';
import ServicesManager from './admin/pages/ServicesManager';
import Bookings from './admin/pages/Bookings';
import Enquiries from './admin/pages/Enquiries';
import Content from './admin/pages/Content';
import Team from './admin/pages/Team';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

// Layout wrapper for public pages (with Header + Footer)
function PublicLayout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/packages" element={<PublicLayout><PackagesPage /></PublicLayout>} />
          <Route path="/package/:id" element={<PublicLayout><PackageDetailPage /></PublicLayout>} />
          <Route path="/destinations" element={<PublicLayout><DestinationsPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/reviews" element={<PublicLayout><ReviewsPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/booking-confirmation" element={<PublicLayout><BookingConfirmationPage /></PublicLayout>} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminApp />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="packages" element={<Packages />} />
              <Route path="destinations" element={<Destinations />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="content" element={<Content />} />
              <Route path="team" element={<Team />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
