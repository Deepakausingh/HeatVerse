import React, { useState, useRef } from "react";
import { createStory } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateStory() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [mediaURL, setMediaURL] = useState("");
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const [message, setMessage] = useState({ text: "", type: "" });

  function showMessage(text, type) {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2500);
  }

  function insertAtCursor(text) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const updated = before + text + after;

    setContent(updated);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 10);
  }

  function insertMedia() {
    if (!mediaURL.trim()) return;

    let tag = "";

    if (mediaURL.includes("youtube.com/watch?v=")) {
      const id = mediaURL.split("v=")[1].split("&")[0];
      tag = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${id}"></iframe>`;
    } else if (mediaURL.match(/\.(mp4|webm|ogg)$/i)) {
      tag = `<video controls src="${mediaURL}" style="width:100%"></video>`;
    } else {
      tag = `<img src="${mediaURL}" style="width:100%">`;
    }

    insertAtCursor("\n" + tag + "\n");
    setMediaURL("");
    setPopup(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showMessage("Title & content required", "error");
      return;
    }

    setLoading(true);
    try {
      const story = await createStory({
        title,
        content,
        cover_image: cover || null,
      });

      showMessage("Story posted!", "success");

      setTimeout(() => navigate(`/`), 1000);
    } catch (err) {
      showMessage("Failed to post story", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start">

      {/* Notification */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 p-4 text-white font-semibold 
          ${message.type === "error" ? "btn-red" : ""} 
          ${message.type === "success" ? "btn-green" : ""} 
          ${message.type === "info" ? "btn-blue" : ""}`}
          style={{ borderRadius: "0" }}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-3xl pb-14 sm:pb-0 w-full bg-black p-6 border-2 border-gray-800 shadow-2xl">

        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 leading-tight">
          Write a New Story
        </h1>

        {/* FORM */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Title"
            className="p-3 bg-black text-white border-2 border-gray-700"
            style={{ borderRadius: 0 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Cover Image URL"
            className="p-3 bg-black text-white border-2 border-gray-700"
            style={{ borderRadius: 0 }}
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />

          <textarea
            ref={textareaRef}
            placeholder="Write your story here..."
            rows={12}
            className="p-3 bg-black text-white border-2 border-gray-700"
            style={{ borderRadius: 0 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {/* Buttons */}
          {/* Buttons */}
<div className="flex justify-between mt-4 gap-4 mb-4">

  <button
    type="button"
    onClick={() => setPopup(true)}
    className="btn-green flex-1 py-2 px-4 font-bold rounded-md hover:bg-green-700"
  >
    ➕ Insert Media
  </button>

  <button
    type="submit"
    disabled={loading}
    className="btn-blue flex-1 py-2 px-4 font-bold rounded-md hover:bg-blue-700"
  >
    {loading ? "Publishing..." : "Post Story"}
  </button>

</div>
<style>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE & Edge */
    scrollbar-width: none;     /* Firefox */
  }
`}</style>

        </form>
      </div>

      {/* MEDIA POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50 overflow-y-auto">

          <div className="bg-black p-6 w-full max-w-xl border-2 border-gray-700 max-h-[98vh] overflow-y-auto no-scrollbar">

            <h3 className="text-2xl font-semibold mb-4">Insert Media</h3>

            <input
              type="text"
              placeholder="Paste media link"
              className="w-full p-3 mb-4 bg-black text-white border-2 border-gray-700"
              style={{ borderRadius: 0 }}
              value={mediaURL}
              onChange={(e) => setMediaURL(e.target.value)}
            />

            {/* PREVIEW */}
            <div className="border border-gray-700 p-0 mb-4 overflow-y-auto no-scrollbar">
              {mediaURL && (
                <>
                  {mediaURL.includes("youtube.com/watch?v=") ? (
                    <iframe
                      width="100%"
                      height="250"
                      src={`https://www.youtube.com/embed/${
                        mediaURL.split("v=")[1].split("&")[0]
                      }`}
                      allowFullScreen
                    ></iframe>
                  ) : mediaURL.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video controls src={mediaURL} className="w-full"></video>
                  ) : (
                    <img src={mediaURL} alt="" className="w-full" />
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={insertMedia} className="btn-blue py-2 px-6 font-bold rounded-md hover:bg-blue-700">
                Insert
              </button>
              <button
                onClick={() => setPopup(false)}
                className="btn-red py-2 px-6 font-bold rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Add this CSS somewhere in your component or index.css */}
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
