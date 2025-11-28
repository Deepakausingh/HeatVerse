import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const textRef = useRef(null); // Textarea ref

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalCoverImage, setOriginalCoverImage] = useState("");
  const [mediaURL, setMediaURL] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // ---------------- FETCH STORY ----------------
  useEffect(() => {
    async function loadStory() {
      try {
        const res = await fetch(`${API}/stories/${id}`);
        if (!res.ok) throw new Error("Story not found");

        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setOriginalCoverImage(data.cover_image || "");
      } catch (error) {
        showMessage("Failed to load story", "error");
      }
    }
    loadStory();
  }, [id]);

  // ---------------- MESSAGE HANDLER ----------------
  function showMessage(text, type = "info") {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }

  // ---------------- UPDATE STORY ----------------
  async function handleUpdate(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showMessage("Title & content required", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          cover_image: originalCoverImage,
        }),
      });

      if (res.ok) {
        showMessage("Story updated successfully!", "success");
        setTimeout(() => navigate("/manage"), 500);
      } else {
        showMessage("Failed to update", "error");
      }
    } catch (err) {
      showMessage("Server error", "error");
    }
  }

  // ---------------- MEDIA PREVIEW ----------------
  function previewMedia(url) {
    if (!url) return setMediaPreview("");

    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      if (id)
        return setMediaPreview(
          `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen class="border border-gray-700"></iframe>`
        );
    }

    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return setMediaPreview(
        `<video autoplay muted loop controls class="border border-gray-700 max-w-full"><source src="${url}"></video>`
      );
    }

    return setMediaPreview(
      `<img src="${url}" class="max-w-full border border-gray-700" />`
    );
  }

  // ---------------- INSERT MEDIA AT CURSOR ----------------
  function insertMedia() {
    if (!mediaURL.trim()) {
      showMessage("Enter media URL", "error");
      return;
    }

    let mediaTag = "";

    if (mediaURL.includes("youtube.com/watch?v=")) {
      const videoId = mediaURL.split("v=")[1]?.split("&")[0];
      mediaTag = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="display:block; width:100%; margin:12px 0; border:1px solid #333;"></iframe>`;
    } else if (mediaURL.match(/\.(mp4|webm|ogg)$/i)) {
      mediaTag = `<video autoplay loop muted controls src="${mediaURL}" style="display:block; width:100%; margin:12px 0; border:1px solid #333;"></video>`;
    } else {
      mediaTag = `<img src="${mediaURL}" style="display:block; width:100%; margin:12px 0; border:1px solid #333;">`;
    }

    const textarea = textRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = content.substring(0, start);
    const after = content.substring(end);

    const newContent = before + "\n" + mediaTag + "\n" + after;
    setContent(newContent);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + mediaTag.length + 2;
      textarea.focus();
    }, 10);

    // Reset modal
    setShowModal(false);
    setMediaURL("");
    setMediaPreview("");
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center mb-14 sm:mb-0">

      {/* ---------------- MESSAGE BOX ---------------- */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 text-lg font-semibold z-[200]
            ${message.type === "error" && "bg-red-700"}
            ${message.type === "success" && "bg-green-700"}
            ${message.type === "info" && "bg-blue-700"}
          `}
        >
          {message.text}
        </div>
      )}

      {/* ---------------- MAIN CARD ---------------- */}
      <div className="w-full max-w-3xl bg-black border border-gray-800 p-4 shadow-2xl">

        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          Edit Story
        </h1>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">

          <input
            className="bg-black border border-gray-800 p-3 text-white text-lg"
            placeholder="Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            ref={textRef}
            className="bg-black border border-gray-800 p-3 text-white text-lg leading-relaxed min-h-[350px] resize-y overflow-y-auto no-scrollbar"
            placeholder="Write your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* BUTTONS */}
          <div className="flex justify-between mt-4 gap-4">
            <button
              type="button"
              className="btn-green flex-1 py-3 px-8 font-bold rounded-md hover:bg-green-700"
              onClick={() => setShowModal(true)}
            >
              ➕ Insert Media
            </button>

            <button
              type="submit"
              className="btn-blue flex-1 py-3 px-8 font-bold rounded-md hover:bg-blue-700"
            >
              Update Story
            </button>
          </div>
        </form>
      </div>

      {/* ---------------- MEDIA MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black flex justify-center items-center p-4 z-50 overflow-y-auto no-scrollbar">
          <div className="bg-black p-6 w-full max-w-xl border-2 border-gray-700 max-h-[98vh] overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-bold mb-4">Insert Media</h3>

            <input
              className="w-full bg-black border border-gray-700 p-3 text-white mb-4"
              placeholder="Paste media link..."
              value={mediaURL}
              onChange={(e) => {
                setMediaURL(e.target.value);
                previewMedia(e.target.value);
              }}
            />

            {/* MEDIA PREVIEW */}
            <div
              className="border border-gray-700 p-0 mb-4 overflow-y-auto no-scrollbar"
              dangerouslySetInnerHTML={{ __html: mediaPreview }}
            />

            {/* MODAL BUTTONS */}
            <div className="flex justify-end gap-4 mt-2 bg-black py-3 border-t border-gray-700">
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 font-bold rounded-md"
                onClick={insertMedia}
              >
                Insert
              </button>
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 font-bold rounded-md"
                onClick={() => {
                  setShowModal(false);
                  setMediaPreview(""); // Clear preview on cancel too
                  setMediaURL("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDE SCROLLBARS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE & Edge */
          scrollbar-width: none;     /* Firefox */
        }
      `}</style>
    </div>
  );
}
