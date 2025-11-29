import {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory
} from "../controllers/storiesController.js";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    if (req.query.id) return getStoryById(req, res);
    return getAllStories(req, res);
  }

  if (method === "POST") return createStory(req, res);
  if (method === "PUT") return updateStory(req, res);
  if (method === "DELETE") return deleteStory(req, res);

  return res.status(405).json({ error: "Method Not Allowed" });
}
