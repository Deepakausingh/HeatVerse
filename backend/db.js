// db.js - create pg pool
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set in environment");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  // If using Neon with SSL, you might need:
  // ssl: { rejectUnauthorized: false }
});

module.exports = pool;
