import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";


export default function Home() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [pageLoading, setPageLoading] = useState(() => {
    return localStorage.getItem("loaderShown") ? false : true;
  });

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const updatePerPage = () => {
    const w = window.innerWidth;
    if (w < 640) setPerPage(20);
    else if (w < 1024) setPerPage(21);
    else setPerPage(20);
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/stories`);
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error("Failed to load stories", error);
      setStories([]);
    } finally {
      setLoading(false);
      if (!localStorage.getItem("loaderShown")) {
        localStorage.setItem("loaderShown", "true");
      }
      setPageLoading(false);
    }
  };

  useEffect(() => {
    updatePerPage();
    fetchStories();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const totalPages = Math.ceil(stories.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentStories = stories.slice(startIndex, startIndex + perPage);

  return (
    <div className="text-white bg-black w-full min-h-screen mb-30 sm:mb-0">

      {/* Loader */}
      {pageLoading && (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-[9999]">
          <div className="loader-box w-[180px] h-[180px] relative flex justify-center items-center overflow-hidden">
            <img src={Logo} className="w-[95%] h-[95%] z-[2]" />
            <div className="border-runner absolute inset-[-5px]"></div>
          </div>
        </div>
      )}

      {!pageLoading && (
        <div className="opacity-100 pb-14 sm:p-4 w-full bg-black p-4 border border-gray-800 shadow-xl transition-opacity duration-700">

          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold">Latest Stories</h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading && (
              <p className="col-span-full text-center text-gray-400">
                Loading stories...
              </p>
            )}

            {!loading && currentStories.length === 0 && (
              <p className="col-span-full text-center text-gray-400">
                No stories found.
              </p>
            )}

            {!loading &&
              currentStories.map((s, index) => {
                const img = s.cover_image || "https://picsum.photos/600/800";
                return (
                  <Link to={`/stories/${s.id}`} key={s.id} aria-label={s.title}>
                    {/* group so child img can scale on parent hover */}
                    <div
                      className="story-card group relative h-[350px] lg:h-[420px] overflow-hidden border border-white/10 cursor-pointer transform transition-shadow duration-500 opacity-0 translate-y-6"
                      style={{
                        animation: `fadeUp 0.5s forwards`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                    >
                      {/* image fills card and will scale on hover */}
                      <img
                        src={img}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-[1.03]"
                      />

                      {/* slight dark overlay for readability */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/25 transition-colors duration-300"></div>

                      {/* card hover scales a bit to pop */}
                      <div className="absolute inset-0 pointer-events-none transition-transform duration-500 transform group-hover:scale-[1.02]"></div>

                      {/* title */}
                      <div className="absolute bottom-0 w-full bg-black/60 p-3">
                        <h3 className="font-semibold text-sm truncate">{s.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded disabled:opacity-40"
              >
                <i className="fa-solid fa-angle-left text-lg"></i>
              </button>

              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded disabled:opacity-40"
              >
                <i className="fa-solid fa-angle-right text-lg"></i>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        body {
          font-family: "Lexend", sans-serif;
          background-color: #0a0a0a;
        }

        .border-runner::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: conic-gradient(transparent 0%, rgb(208, 73, 0) 100%, rgb(208, 73, 0) 100%);
          animation: borderRunEmerging 1.5s linear infinite;
        }

        @keyframes borderRunEmerging {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
