const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./db');
const { authLimiter, authenticateToken, JWT_SECRET } = require('./middleware');

const router = express.Router();

// Check setup needed
router.get('/check', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ setupNeeded: row.count === 0 });
  });
});

// Setup
router.post('/setup', authLimiter, async (req, res) => {
  const { username, email, password, fullName, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (userCount > 0) {
      return res.status(400).json({ error: 'Setup already completed' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    db.run('INSERT INTO users (username, email, password_hash, full_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, passwordHash, fullName || null, phone || null],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const token = jwt.sign({ userId: this.lastID, username, email }, JWT_SECRET, { expiresIn: '7d' });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        db.run('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
          [this.lastID, token, expiresAt.toISOString()]);

        res.status(201).json({
          message: 'Setup completed',
          token,
          user: { id: this.lastID, username, email, fullName, phone }
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user || !user.is_active) return res.status(401).json({ error: 'Invalid credentials' });

    try {
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      db.run('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [user.id, token, expiresAt.toISOString()]);
      db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email, fullName: user.full_name, phone: user.phone }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  db.run('DELETE FROM sessions WHERE token_hash = ?', [token]);
  res.json({ message: 'Logged out' });
});

// Get profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, full_name, phone, created_at, last_login FROM users WHERE id = ?', 
    [req.user.userId], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
    });
});

// Update profile
router.put('/profile', authenticateToken, (req, res) => {
  const { fullName, phone } = req.body;
  
  db.run('UPDATE users SET full_name = ?, phone = ?, updated_at = datetime("now") WHERE id = ?',
    [fullName || null, phone || null, req.user.userId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });
      res.json({ message: 'Profile updated' });
    });
});

// Change password
router.post('/change-password', authenticateToken, authLimiter, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.userId], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Current password incorrect' });

      const newHash = await bcrypt.hash(newPassword, 12);
      
      db.run('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?',
        [newHash, req.user.userId], (err) => {
          if (err) return res.status(500).json({ error: 'Password update failed' });
          
          const currentToken = req.headers['authorization']?.split(' ')[1];
          db.run('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?', [req.user.userId, currentToken]);
          
          res.json({ message: 'Password updated' });
        });
    } catch (error) {
      res.status(500).json({ error: 'Password update failed' });
    }
  });
});

module.exports = router;