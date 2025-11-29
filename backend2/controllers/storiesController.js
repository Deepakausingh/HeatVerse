import pool from "../db.js";

export async function getAllStories(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM stories ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}

export async function getStoryById(req, res) {
  const id = req.query.id;
  try {
    const result = await pool.query("SELECT * FROM stories WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}

export async function createStory(req, res) {
  const { title, content, cover_image } = req.body;

  if (!title || !content)
    return res.status(400).json({ error: "title and content required" });

  try {
    const result = await pool.query(
      "INSERT INTO stories (title,content,cover_image) VALUES ($1,$2,$3) RETURNING *",
      [title, content, cover_image || null]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}

export async function updateStory(req, res) {
  const id = req.query.id;
  const { title, content, cover_image } = req.body;

  try {
    const result = await pool.query(
      `UPDATE stories SET
         title = COALESCE($1,title),
         content = COALESCE($2,content),
         cover_image = COALESCE($3,cover_image)
       WHERE id=$4 RETURNING *`,
      [title, content, cover_image, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Not found" });

    res.status(200).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}

export async function deleteStory(req, res) {
  const id = req.query.id;
  try {
    const result = await pool.query("DELETE FROM stories WHERE id=$1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });

    res.status(200).json({ deleted: true });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}
