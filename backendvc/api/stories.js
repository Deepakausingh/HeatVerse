// api/stories.js
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('../db'); // updated db.js handles serverless pooling
const app = express();

app.use(express.json());

// Run migration once per cold-start (not on every request).
// Using a module-scoped flag to avoid re-running inside the same container.
if (!global.__migrationRan) {
  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_stories.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      // run migration (CREATE TABLE IF NOT EXISTS recommended in migration)
      pool.query(sql).then(() => {
        console.log('Migration ran (or already exists).');
      }).catch((err) => {
        console.error('Migration error:', err);
      });
    } else {
      console.warn('Migration file not found at', migrationPath);
    }
  } catch (err) {
    console.error('Migration/FS error:', err);
  }
  global.__migrationRan = true;
}

// --- Controllers (same logic you provided) ---
async function getAllStories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM stories ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

async function getStoryById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Story not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

async function createStory(req, res) {
  const { title, content, cover_image } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

  try {
    const result = await pool.query(
      'INSERT INTO stories (title, content, cover_image) VALUES ($1, $2, $3) RETURNING *',
      [title, content, cover_image || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

async function updateStory(req, res) {
  const { id } = req.params;
  const { title, content, cover_image } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stories
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           cover_image = COALESCE($3, cover_image)
       WHERE id = $4
       RETURNING *`,
      [title, content, cover_image, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Story not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

async function deleteStory(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM stories WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Story not found' });
    return res.json({ message: 'Deleted', story: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

// --- Routes ---
app.get('/', (req, res) => res.json({ message: 'Use /api/stories' }));

app.get('/api/stories', getAllStories);
app.get('/api/stories/:id', getStoryById);
app.post('/api/stories', createStory);
app.put('/api/stories/:id', updateStory);
app.delete('/api/stories/:id', deleteStory);

module.exports = serverless(app);
