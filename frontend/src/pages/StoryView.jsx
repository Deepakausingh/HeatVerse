import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StoryView() {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`${API}/stories/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch story ${id}`);
        const data = await res.json();
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, API]);

  if (loading) return <p className="text-center mt-10">Loading story...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!story) return <p className="text-center mt-10">Story not found</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white flex flex-col items-center">
      <div className="max-w-3xl w-full bg-black p-4 border border-gray-800 shadow-2xl space-y-4">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center">{story.title}</h1>

        {/* Cover Image */}
        {story.cover_image && (
          <img
            src={story.cover_image}
            alt={story.title}
            className="w-full object-cover border-2 border-gray-700 rounded"
          />
        )}

        {/* Story Content (HTML rendering) */}
        <div
          className="story-content text-gray-300 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: story.content }}
        ></div>
      </div>
    </div>
  );
}
