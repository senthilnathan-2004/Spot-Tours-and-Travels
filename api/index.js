import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../lib/routes/auth.js';
import packageRoutes from '../lib/routes/packages.js';
import bookingRoutes from '../lib/routes/bookings.js';
import enquiryRoutes from '../lib/routes/enquiries.js';
import contentRoutes from '../lib/routes/content.js';
import teamRoutes from '../lib/routes/team.js';

const app = express();

// CORS — allow frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.VITE_SITE_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    // Allow any localhost / 127.0.0.1 port and *.vercel.app
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    cb(null, true); // Permissive in dev/serverless
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Spot Tours API' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/team', teamRoutes);

// 404 handler
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

export default app;
