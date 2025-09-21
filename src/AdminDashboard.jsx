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

  // Function to get token from localStorage
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
        headers: {
          'x-auth-token': token,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 403) {
        alert('Access denied. Admin privileges required.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    setUpdatingStatus(postId);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/posts/${postId}/status`,
        { status: newStatus },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update the post in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, status: newStatus } : post
        )
      );

      // Show success message
      alert(`Post status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating post status:", err.response ? err.response.data : err.message);
      const errorMsg = err.response?.data?.msg || "Failed to update post status. Please try again.";
      alert(errorMsg);
    } finally {
      setUpdatingStatus(null);
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <div className="text-blue-500 text-2xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
              </div>
              <div className="text-gray-500 text-2xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{counts.inProgress}</p>
              </div>
              <div className="text-yellow-500 text-2xl">🚧</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Solved</p>
                <p className="text-2xl font-bold text-gray-900">{counts.solved}</p>
              </div>
              <div className="text-green-500 text-2xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-gray-900">{counts.declined}</p>
              </div>
              <div className="text-red-500 text-2xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading reports...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600">No reports match your current filters.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Header */}
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
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{post.text}</p>
                  </div>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                      {post.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={`http://localhost:5000${img}`}
                            alt="report"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              console.error(`Failed to load image: ${img}`);
                              e.target.style.display = 'none';
                            }}
                            onClick={() => {
                              window.open(`http://localhost:5000${img}`, '_blank');
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      📅 {new Date(post.createdAt).toLocaleString()}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePostStatus(post._id, 'On Progress')}
                        disabled={updatingStatus === post._id || post.status === 'On Progress'}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === post._id ? '⏳' : '🚧'} In Progress
                      </button>
                      
                      <button
                        onClick={() => updatePostStatus(post._id, 'Solved')}
                        disabled={updatingStatus === post._id || post.status === 'Solved'}
                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === post._id ? '⏳' : '✅'} Complete
                      </button>
                      
                      <button
                        onClick={() => updatePostStatus(post._id, 'Declined')}
                        disabled={updatingStatus === post._id || post.status === 'Declined'}
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === post._id ? '⏳' : '❌'} Decline
                      </button>
                    </div>
                  </div>
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