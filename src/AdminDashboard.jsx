// File: src/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Inline admin message state
  const [currentPostToUpdate, setCurrentPostToUpdate] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'Electricity Issue', label: 'Electricity Issue', icon: '⚡' },
    { value: 'Gas Issue', label: 'Gas Issue', icon: '🔥' },
    { value: 'Road Issue', label: 'Road Issue', icon: '🛣️' },
    { value: 'Water Issue', label: 'Water Issue', icon: '💧' },
    { value: 'Other Issue', label: 'Other Issue', icon: '📋' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'On Progress', label: 'On Progress' },
    { value: 'Solved', label: 'Solved' },
    { value: 'Declined', label: 'Declined' }
  ];

  const getToken = () => localStorage.getItem('token');
  const getUser = () => JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [filterCategory, filterStatus]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const res = await axios.get(`http://localhost:5000/api/posts/admin?${params}`, {
        headers: { 'x-auth-token': token },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 403) {
        alert('Access denied. Admin privileges required.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId, status, message) => {
    setUpdatingStatus(postId);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/posts/${postId}/status`,
        { status, adminMessage: message },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, status, adminMessage: message } : post
        )
      );

      alert(`Post status updated to ${status}`);
    } catch (err) {
      console.error("Error updating post status:", err.response ? err.response.data : err.message);
      const errorMsg = err.response?.data?.msg || "Failed to update post status. Please try again.";
      alert(errorMsg);
    } finally {
      setUpdatingStatus(null);
      setCurrentPostToUpdate(null);
      setAdminMessage("");
      setNewStatus("");
    }
  };

  const handleStatusChange = (postId, status) => {
    setCurrentPostToUpdate(postId);
    setNewStatus(status);
    setAdminMessage("");
  };

  const confirmStatusUpdate = () => {
    if (currentPostToUpdate && newStatus) {
      updatePostStatus(currentPostToUpdate, newStatus, adminMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📋';
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Solved': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Declined': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPostsCount = () => {
    const total = posts.length;
    const pending = posts.filter(p => p.status === 'Pending').length;
    const inProgress = posts.filter(p => p.status === 'On Progress').length;
    const solved = posts.filter(p => p.status === 'Solved').length;
    const declined = posts.filter(p => p.status === 'Declined').length;
    return { total, pending, inProgress, solved, declined };
  };

  const counts = getPostsCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage citizen reports and complaints</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Welcome, Admin!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Total / Pending / In Progress / Solved / Declined cards */}
          {/* same as before ... */}
        </div>

        {/* Filters */}
        {/* same as before ... */}

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">Loading reports...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">No Reports Found</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6">
                  {/* Post header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                          {getCategoryIcon(post.category)} {post.category}
                        </span>
                      </div>
                      {post.user && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {post.user.email}</p>
                          <p>📞 {post.user.phone}</p>
                          <p>📍 {post.user.presentAddress}</p>
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-3">{post.text}</p>

                  {/* Admin message */}
                  {post.adminMessage && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <p className="font-semibold">Admin Note:</p>
                      <p>{post.adminMessage}</p>
                    </div>
                  )}

                  {/* Images */}
                  {/* same as before ... */}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">📅 {new Date(post.createdAt).toLocaleString()}</p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(post._id, 'On Progress')}
                        disabled={updatingStatus === post._id || post.status === 'On Progress'}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm"
                      >
                        🚧 In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(post._id, 'Solved')}
                        disabled={updatingStatus === post._id || post.status === 'Solved'}
                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm"
                      >
                        ✅ Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(post._id, 'Declined')}
                        disabled={updatingStatus === post._id || post.status === 'Declined'}
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm"
                      >
                        ❌ Decline
                      </button>
                    </div>
                  </div>

                  {/* Inline Admin Message Box (like FB comment) */}
                  {currentPostToUpdate === post._id && (
                    <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                      <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="3"
                        placeholder={`Message for "${newStatus}" (optional)`}
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={confirmStatusUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setCurrentPostToUpdate(null)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
