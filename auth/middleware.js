const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { db } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

const setupAuth = (app) => {
  const express = require('express');
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, try again later'
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    db.get('SELECT * FROM sessions WHERE token_hash = ? AND expires_at > datetime("now")', 
      [token], (err, session) => {
        if (err || !session) {
          return res.status(403).json({ error: 'Invalid session' });
        }
        req.user = user;
        next();
      });
  });
};

module.exports = { setupAuth, authLimiter, authenticateToken, JWT_SECRET };