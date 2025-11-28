import React, { useEffect, useState } from 'react';
import { fetchStories } from '../api/api';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      fetchStories()
        .then(data => {
          setStories(data);
          setLoading(false);
        })
        .catch(e => {
          setErr(e.message || 'Failed to load stories.');
          setLoading(false);
        });
    }, 1000);

    return () => clearTimeout(loaderTimeout);
  }, []);

  return (
    <div className="bg-black text-white w-full min-h-screen">
      {/* Header */}
      <div className="w-full max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center mb-10 px-4 sm:px-8 lg:px-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Latest Stories</h1>

        <div className="flex space-x-4 mt-6 sm:mt-0">
          <Link to="/create">
            <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded shadow-lg">
              <i className="fa-solid fa-pen-nib text-xl"></i>
            </button>
          </Link>
          <Link to="/manage">
            <button className="px-5 py-3 bg-green-600 hover:bg-green-700 border border-green-500 rounded shadow-lg">
              <i className="fa-solid fa-gear text-xl"></i>
            </button>
          </Link>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black z-50">
          <div className="loader-box relative w-44 h-44 flex justify-center items-center overflow-hidden">
            <img src="Logo.png" alt="Logo" className="w-11/12 h-11/12 rounded" />
            <div className="border-runner absolute inset-[-5px] before:content-[''] before:absolute before:w-[200%] before:h-[200%] before:top-[-50%] before:left-[-50%] before:bg-conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgb(208,73,0)_100%) before:animate-[borderRunEmerging_1.5s_linear_infinite]"></div>
          </div>
        </div>
      )}

      {/* Error */}
      {err && <div className="text-red-500 text-center mb-6">{err}</div>}

      {/* Stories Grid */}
      {!loading && stories.length > 0 && (
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {/* No Stories */}
      {!loading && stories.length === 0 && (
        <div className="mt-6 text-gray-500 text-center">No stories yet.</div>
      )}
    </div>
  );
}
