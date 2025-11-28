// src/api/api.js

// Main API base from environment or fallback
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* ------------------------- GET ALL STORIES ------------------------- */
export async function fetchStories() {
  const res = await fetch(`${BASE}/stories`);
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

/* ------------------------- GET ONE STORY --------------------------- */
export async function fetchStory(id) {
  const res = await fetch(`${BASE}/stories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch story");
  return res.json();
}

/* ------------------------- CREATE STORY ---------------------------- */
export async function createStory(payload) {
  const res = await fetch(`${BASE}/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error || err.message || "Failed to create story");
  }

  return res.json();
}

/* ------------------------- UPDATE STORY ---------------------------- */
export async function updateStory(id, data) {
  const res = await fetch(`${BASE}/stories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error || err.message || "Failed to update story");
  }

  return res.json();
}
