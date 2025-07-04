const express = require('express');
const { initDb } = require('./auth/db');
const { setupAuth } = require('./auth/middleware');
const authRoutes = require('./auth/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup middleware
setupAuth(app);

// Initialize database
initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/setup', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});