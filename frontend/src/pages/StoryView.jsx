import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StoryView() {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW STATES FOR PAGINATION
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const CHARS_PER_PAGE = 15000; // adjust for bigger or smaller pages

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`${API}/stories/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch story ${id}`);
        const data = await res.json();
        setStory(data);

        // PAGINATION LOGIC — SPLIT CONTENT BY CHARACTER LIMIT
        if (data.content) {
          const parts = [];
          let html = data.content;

          for (let i = 0; i < html.length; i += CHARS_PER_PAGE) {
            parts.push(html.slice(i, i + CHARS_PER_PAGE));
          }

          setPages(parts);
        }
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white flex flex-col items-center mb-16">
      <div className="max-w-3xl w-full bg-black p-4 border border-gray-800 shadow-2xl space-y-4 ">

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

        {/* Story Page Content */}
        <div
          key={currentPage} 
          className="story-content text-gray-300 text-lg leading-relaxed animate-fade"
          dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
        ></div>

        {/* Pagination Buttons */}
        {pages.length > 1 && (
          <div className="flex justify-between items-center mt-6 mb-16">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded disabled:opacity-40 mb-10"
            >
              ← Prev
            </button>

            <span className="text-gray-400 text-sm mb-10">
              Page {currentPage + 1} of {pages.length}
            </span>

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, pages.length - 1))
              }
              disabled={currentPage === pages.length - 1}
              className="px-5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded disabled:opacity-40 mb-10"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Fade animation */}
      <style>
        {`
          .animate-fade {
            animation: fadeIn 0.4s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
