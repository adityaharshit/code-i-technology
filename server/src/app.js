// server/src/app.js

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// IMPORTANT: Trust the first proxy in front of the app (like Render's load balancer)
// This is crucial for secure cookies to work correctly in production.
app.set('trust proxy', 1);

// --- CORS Configuration ---
// Define a list of allowed frontend origins from environment variables.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://code-i-technology.vercel.app',
  'http://localhost:5173' // For local development
];

const corsOptions = {
  // Use a function to dynamically check the origin
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    // If the origin is in our whitelist, allow it
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      // Otherwise, reject the request
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true, // This is important for sending cookies
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection pool for sessions
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session with PostgreSQL store
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true only in production (HTTPS)
      httpOnly: true,
      sameSite: 'lax', // 'none' is required for cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Specific route for uploads (can be defined before general routes)
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Root endpoint for testing deployment
app.get('/', (req, res) => {
  res.json({
    message: 'CIT Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main API Routes
app.use('/api', routes);

// Central Error Handler
app.use(errorHandler);

module.exports = app;
