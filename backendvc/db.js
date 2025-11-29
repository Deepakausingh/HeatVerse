// db.js
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not set in environment');
  // Do not exit — allow serverless function to start and fail on first DB attempt with useful error
}

// Configure SSL if needed (set DATABASE_SSL=true in Vercel env if provider needs it)
const useSsl = process.env.DATABASE_SSL === 'true';

const poolConfig = {
  connectionString,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
};

// reuse across lambda/container instances (prevents too many clients)
if (!global._pgPool) {
  global._pgPool = new Pool(poolConfig);
  // optional: handle pool errors
  global._pgPool.on('error', (err) => {
    console.error('Unexpected idle client error', err);
  });
}

const pool = global._pgPool;

module.exports = {
  query: (text, params) => pool.query(text, params),
  // expose the pool in case you need transaction control elsewhere
  pool
};
