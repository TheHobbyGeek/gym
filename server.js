const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Crypto Trading Assistant API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API route for basic crypto data (placeholder)
app.get('/api/crypto/status', (req, res) => {
  res.json({
    message: 'Crypto trading assistant is online',
    features: ['Portfolio tracking', 'Price alerts', 'Trading signals'],
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve Vue app for all other routes (SPA) - only in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  // In development, send a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({ 
      message: 'Development mode - Frontend served by webpack dev server on port 8080',
      frontend: 'http://localhost:8080',
      api: `http://localhost:${PORT}/api`
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Crypto Trading Assistant server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please change the PORT in your .env file or stop the other process.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});