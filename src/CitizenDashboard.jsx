// FileName: /CitizenDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [isPostBoxOpen, setIsPostBoxOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState([]); // Stores File objects for upload
  const [imagePreviews, setImagePreviews] = useState([]); // Stores URL for display
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [userName, setUserName] = useState("Citizen"); // To display logged-in user's name
  const [postLoading, setPostLoading] = useState(false); // Loading state for new post
  const [postsLoading, setPostsLoading] = useState(true); // Loading state for fetching posts

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem('token');
  const getUser = () => JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = getUser();
    if (user && user.firstName && user.lastName) {
      setUserName(`${user.firstName} ${user.lastName}`);
    } else {
      // If no user or name, redirect to login
      navigate('/login');
    }
    fetchPosts();
  }, []); // Run once on component mount

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          'x-auth-token': token,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response ? err.response.data : err.message);
      // Handle token expiration or invalid token
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    } finally {
      setPostsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPostImages((prev) => [...prev, ...files]); // Store actual file objects
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]); // Store URLs for display
  };

  const handlePost = async () => {
    if (!postText.trim() && postImages.length === 0) return;

    setPostLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // For simplicity, we'll send image URLs directly.
      // In a real app, you'd upload images to a cloud storage (e.g., Cloudinary, S3)
      // and then send the returned URLs to your backend.
      // For now, we'll just use placeholder URLs or base64 if you implement that.
      // For this example, we'll just send the text and assume image URLs are handled elsewhere or are placeholders.
      // If you want to implement actual image upload, that's a more complex step involving multer on backend and a storage service.
      // For now, let's assume `postImages` are just for local preview and not actually uploaded.
      // We'll send empty array for images to backend for now.

      const res = await axios.post('http://localhost:5000/api/posts', {
        text: postText,
        images: [], // Placeholder: In a real app, this would be uploaded image URLs
      }, {
        headers: {
          'x-auth-token': token,
        },
      });

      // Add the new post to the beginning of the posts array
      // We need to fetch the user's name for the new post, or get it from the stored user info
      const user = getUser();
      const newPost = {
        ...res.data,
        user: {
          _id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
      setPosts((prev) => [newPost, ...prev]);

      setPostText("");
      setPostImages([]);
      setImagePreviews([]);
      setIsPostBoxOpen(false);
    } catch (err) {
      console.error("Error creating post:", err.response ? err.response.data : err.message);
      alert("Failed to create post. Please try again.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleCancel = () => {
    setPostText("");
    setPostImages([]);
    setImagePreviews([]);
    setIsPostBoxOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
        <div className="space-x-4 flex items-center">
          <span className="text-gray-700 font-medium">Welcome, {userName}!</span>
          <button className="text-gray-600 hover:text-gray-800">Settings</button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Post Box */}
      <div className="bg-white p-4 m-4 rounded-lg shadow">
        {!isPostBoxOpen ? (
          <div
            className="text-gray-500 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsPostBoxOpen(true)}
          >
            What’s on your mind, {userName.split(' ')[0]}? Report a problem...
          </div>
        ) : (
          <div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${userName.split(' ')[0]}? Report a problem...`}
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {imagePreviews.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center space-x-2">
              <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
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
                disabled={postLoading || (!postText.trim() && postImages.length === 0)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {postLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                Post
              </button>

              <button
                onClick={handleCancel}
                disabled={postLoading}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-75"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4 p-4">
        {postsLoading ? (
          <div className="text-center text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet. Be the first to report a problem!</div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id} // Use _id from MongoDB
              className="bg-white rounded-lg shadow p-4 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  {post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User'}
                </h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-medium ${
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
              <p className="mb-3 text-gray-700">{post.text}</p>
              {post.images && post.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="post"
                      className="w-32 h-20 object-cover rounded border border-gray-200"
                    />
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
