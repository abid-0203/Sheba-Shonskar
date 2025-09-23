// FileName: /CitizenDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [isPostBoxOpen, setIsPostBoxOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postCategory, setPostCategory] = useState(""); // Category
  const [postImages, setPostImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Display URLs
  const [posts, setPosts] = useState([]); // Fetched posts
  const [userName, setUserName] = useState("Citizen");
  const [postLoading, setPostLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);

  const categories = [
    'Electricity Issue',
    'Gas Issue', 
    'Road Issue',
    'Water Issue',
    'Other Issue'
  ];

  const getToken = () => localStorage.getItem('token');
  const getUser = () => JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = getUser();
    if (user && user.firstName && user.lastName) {
      setUserName(`${user.firstName} ${user.lastName}`);
    } else {
      navigate('/login');
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const token = getToken();
      if (!token) { navigate('/login'); return; }
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { 'x-auth-token': token },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    } finally { setPostsLoading(false); }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPostImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePost = async () => {
    if (!postText.trim() && postImages.length === 0) {
      alert('Please write something or add images.');
      return;
    }
    if (!postCategory) {
      alert('Please select a category.');
      return;
    }

    setPostLoading(true);
    try {
      const token = getToken();
      if (!token) { navigate('/login'); return; }

      const formData = new FormData();
      formData.append('text', postText);
      formData.append('category', postCategory);
      postImages.forEach(img => formData.append('images', img));

      const res = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts(prev => [res.data, ...prev]);
      setPostText("");
      setPostCategory("");
      setPostImages([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setIsPostBoxOpen(false);

    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to create post.");
    } finally { setPostLoading(false); }
  };

  const handleCancel = () => {
    setPostText(""); setPostCategory(""); setPostImages([]);
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setIsPostBoxOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Electricity Issue': return '⚡';
      case 'Gas Issue': return '🔥';
      case 'Road Issue': return '🛣️';
      case 'Water Issue': return '💧';
      case 'Other Issue': return '📋';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Electricity Issue': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Gas Issue': return 'bg-red-100 text-red-700 border-red-200';
      case 'Road Issue': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Water Issue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Other Issue': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
          <button className="text-gray-600 hover:text-gray-800" onClick={() => navigate('/account')}>Settings</button>
          <button className="text-red-600 hover:text-red-800" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Post Box */}
      <div className="bg-white p-4 m-4 rounded-lg shadow">
        {!isPostBoxOpen ? (
          <div
            className="text-gray-500 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsPostBoxOpen(true)}
          >
            What's on your mind, {userName.split(' ')[0]}? Report a problem...
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category *</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Choose a category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryIcon(category)} {category}
                  </option>
                ))}
              </select>
            </div>

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
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt="preview"
                      className="w-28 h-28 object-cover rounded border border-gray-200"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center space-x-2">
              <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                Add Photo
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                onClick={handlePost}
                disabled={postLoading || (!postText.trim() && postImages.length === 0) || !postCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {postLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
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
          posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User'}
                  </h3>
                  {post.category && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)} mt-1`}>
                      {getCategoryIcon(post.category)} {post.category}
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-medium ${
                    post.status === "Solved"
                      ? "bg-green-100 text-green-700"
                      : post.status === "On Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : post.status === "Declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <p className="mb-3 text-gray-700">{post.text}</p>

              {/* Admin Note */}
              {post.adminMessage && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <p className="font-semibold">Admin Note:</p>
                  <p>{post.adminMessage}</p>
                </div>
              )}

              {/* Post Images (Bigger like Admin Dashboard) */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      alt="post"
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      onClick={() => window.open(`http://localhost:5000${img}`, '_blank')}
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
