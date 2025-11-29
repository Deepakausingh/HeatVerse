require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const storiesRouter = require('./routes/stories');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Run migration on startup (safe: creates table if not exists)
const migrationPath = path.join(__dirname, 'migrations', '001_create_stories.sql');
if (fs.existsSync(migrationPath)) {
  const sql = fs.readFileSync(migrationPath, 'utf8');
  pool.query(sql).then(() => {
    console.log('Migration ran (or already exists).');
  }).catch(err => {
    console.error('Migration error:', err);
  });
}

app.use('/api/stories', storiesRouter);

// health check
app.get('/', (req, res) => res.send({ ok: true }));

// Export the app (no app.listen)
export default app;
