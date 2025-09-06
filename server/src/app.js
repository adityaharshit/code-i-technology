// server/src/app.js

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true only in production (HTTPS)
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // <-- important
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

module.exports = app;