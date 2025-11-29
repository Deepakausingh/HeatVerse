import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function Manage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Change perPage based on screen width
  const updatePerPage = () => {
    const w = window.innerWidth;
    if (w < 640) setPerPage(20);
    else if (w < 1024) setPerPage(21);
    else if (w < 1280) setPerPage(20);
    else setPerPage(20);
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${API}/stories`);
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      } finally {
        setLoading(false);
      }
    };

    updatePerPage();
    fetchStories();
    window.addEventListener("resize", updatePerPage);

    return () => window.removeEventListener("resize", updatePerPage);
  }, [API]);

  const totalPages = Math.ceil(stories.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentStories = stories.slice(startIndex, startIndex + perPage);

  const deleteStory = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await fetch(`${API}/stories/${id}`, { method: "DELETE" });
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete story:", err);
    }
  };

  if (loading)
    return <p className="text-gray-400 text-center mt-10">Loading stories...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="relative flex items-center justify-center mb-8">
  <h1 className="text-4xl font-extrabold text-center">Manage Stories</h1>
</div>


      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {currentStories.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No stories found.</p>
        )}

        {currentStories.map((s) => (
          <div
            key={s.id}
            className="group relative overflow-hidden border border-white/5 transition hover:scale-105 h-[350px] lg:h-[420px] bg-cover bg-center"
            style={{ backgroundImage: `url('${s.cover_image || "default.jpg"}')` }}
          >
            <div className="absolute bottom-0 w-full bg-black/60 p-3 flex flex-col gap-2">
              <h3 className="font-bold text-sm truncate">{s.title}</h3>

              <div className="flex justify-between gap-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                
                {/* FIXED EDIT LINK */}

                <Link
                  to={`/edit-story/${s.id}`}
                  className="w-10 h-10 flex items-center justify-center bg-green-600 rounded-full"
                >
                  <i className="fa-solid fa-pen"></i>
                </Link>


                <button
                  onClick={() => deleteStory(s.id)}
                  className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4 pb-14 sm:p-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-11 h-11 flex items-center justify-center bg-neutral-800 disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <span className="text-gray-300 flex items-center justify-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-11 h-11 flex items-center justify-center bg-neutral-800 disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
