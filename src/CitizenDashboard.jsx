// CitizenDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [isPostBoxOpen, setIsPostBoxOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState([]);

  // Demo posts (replace later with backend)
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Robert Fox",
      text: "Dirty and broken road",
      images: [
        "https://via.placeholder.com/200x100?text=Garbage",
        "https://via.placeholder.com/200x100?text=Broken+Road",
      ],
      status: "On Progress",
    },
    {
      id: 2,
      author: "Robert Fox",
      text: "Streetlight not working",
      images: [
        "https://via.placeholder.com/200x100?text=Broken+Light",
        "https://via.placeholder.com/200x100?text=Fixed+Light",
      ],
      status: "Solved",
    },
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPostImages([...postImages, ...previews]);
  };

  const handlePost = () => {
    if (!postText.trim() && postImages.length === 0) return;

    const newPost = {
      id: Date.now(),
      author: "You",
      text: postText,
      images: postImages,
      status: "Pending",
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setPostImages([]);
    setIsPostBoxOpen(false);
  };

  const handleCancel = () => {
    setPostText("");
    setPostImages([]);
    setIsPostBoxOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <h1
          className="text-lg font-bold text-green-700 cursor-pointer"
          onClick={() => navigate("/citizen-dashboard")}
        >
          Citizen Dashboard
        </h1>
        <div className="space-x-4">
          <button className="text-gray-600">Settings</button>
          <button
            className="text-red-600"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Post Box */}
      <div className="bg-white p-4 m-4 rounded-lg shadow">
        {!isPostBoxOpen ? (
          <div
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsPostBoxOpen(true)}
          >
            What’s on your mind?
          </div>
        ) : (
          <div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border rounded-lg p-2 mb-3"
              rows={3}
            />

            {/* Image Previews */}
            {postImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {postImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center space-x-2">
              <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200">
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handlePost}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Post
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{post.author}</h3>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  post.status === "Solved"
                    ? "bg-green-100 text-green-700"
                    : post.status === "On Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="mb-3">{post.text}</p>
            <div className="flex flex-wrap gap-2">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="post"
                  className="w-32 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenDashboard;
