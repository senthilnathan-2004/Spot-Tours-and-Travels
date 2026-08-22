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

// Admin (Lazily Loaded for Instant Startup & Chunk Optimization)
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const AdminGuard = React.lazy(() => import('./admin/AdminGuard'));
const AdminApp = React.lazy(() => import('./admin/AdminApp'));
const Dashboard = React.lazy(() => import('./admin/pages/Dashboard'));
const Packages = React.lazy(() => import('./admin/pages/Packages'));
const Destinations = React.lazy(() => import('./admin/pages/Destinations'));
const Blogs = React.lazy(() => import('./admin/pages/Blogs'));
const ReviewsManager = React.lazy(() => import('./admin/pages/ReviewsManager'));
const ServicesManager = React.lazy(() => import('./admin/pages/ServicesManager'));
const Bookings = React.lazy(() => import('./admin/pages/Bookings'));
const Enquiries = React.lazy(() => import('./admin/pages/Enquiries'));
const Content = React.lazy(() => import('./admin/pages/Content'));
const Team = React.lazy(() => import('./admin/pages/Team'));

const AdminFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B', fontWeight: 600, gap: 10 }}>
    <div style={{ width: 28, height: 28, border: '3px solid #E2E8F0', borderTopColor: '#D83A56', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
    <span>Loading console...</span>
  </div>
);

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
          <Route path="/admin/login" element={
            <React.Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </React.Suspense>
          } />
          <Route path="/admin" element={
            <React.Suspense fallback={<AdminFallback />}>
              <AdminGuard />
            </React.Suspense>
          }>
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
