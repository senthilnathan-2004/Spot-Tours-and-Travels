import 'dotenv/config';
import http from 'http';
import app from './api/index.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Spot Tours API listening on http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Global error recovery
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

// Keep event loop alive
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
