import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Bell } from "lucide-react";
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [adminName, setAdminName] = useState("Admin");

  const getToken = () => localStorage.getItem('token');
  const getUser = () => JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = getUser();
    if (user && user.firstName && user.lastName) {
      setAdminName(`${user.firstName} ${user.lastName}`);
    } else {
      navigate('/login');
    }
    fetchPosts();
    fetchUnreadMessages();
  }, [navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: {
          'x-auth-token': token,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const token = getToken();
      const res = await axios.get('http://localhost:5000/api/chat/unread-count', {
        headers: {
          'x-auth-token': token,
        },
      });
      setUnreadMessages(res.data.count);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    try {
      const token = getToken();
      await axios.patch(`http://localhost:5000/api/admin/posts/${postId}`, 
        { status: newStatus },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      
      // Update the post status in the local state
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, status: newStatus } : post
      ));
    } catch (err) {
      console.error("Error updating post status:", err);
      alert("Failed to update post status. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {adminName}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/chat')}
              className="relative px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Support</span>
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-blue-800 font-semibold">Total Reports</h3>
            <p className="text-2xl font-bold text-blue-900">{posts.length}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-yellow-800 font-semibold">Pending</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {posts.filter(post => post.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="text-orange-800 font-semibold">In Progress</h3>
            <p className="text-2xl font-bold text-orange-900">
              {posts.filter(post => post.status === 'On Progress').length}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-green-800 font-semibold">Solved</h3>
            <p className="text-2xl font-bold text-green-900">
              {posts.filter(post => post.status === 'Solved').length}
            </p>
          </div>
        </div>

        {/* Posts/Reports */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Citizen Reports</h2>
          
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading reports...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No reports available.</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Posted on: {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
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
                
                <p className="text-gray-700 mb-3">{post.text}</p>
                
                {post.images && post.images.length > 0 && (
                  <div className="flex gap-3 my-3">
                    {post.images.map((img, i) => (
                      <img 
                        key={i}
                        src={img} 
                        alt="report" 
                        className="w-32 h-20 object-cover rounded-lg border border-gray-200" 
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  {post.status !== 'On Progress' && (
                    <button 
                      onClick={() => updatePostStatus(post._id, 'On Progress')}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {post.status !== 'Solved' && (
                    <button 
                      onClick={() => updatePostStatus(post._id, 'Solved')}
                      className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                  {post.status !== 'Declined' && (
                    <button 
                      onClick={() => updatePostStatus(post._id, 'Declined')}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Decline
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/chat')}
          className="relative w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Chat Support"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;