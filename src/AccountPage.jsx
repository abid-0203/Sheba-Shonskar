// src/AccountPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X } from "lucide-react";
import axios from "axios";

const AccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editData, setEditData] = useState({
    phone: "",
    altPhone: "",
    presentAddress: "",
    permanentAddress: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem('token');
  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const userData = getUser();
    if (!userData || !userData.id) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Get user profile from backend
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          'x-auth-token': token,
        },
      });

      setUser(res.data);
      setEditData({
        phone: res.data.phone || "",
        altPhone: res.data.altPhone || "",
        presentAddress: res.data.presentAddress || "",
        permanentAddress: res.data.permanentAddress || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editData.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!editData.presentAddress.trim()) {
      setError("Present address is required");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.put('http://localhost:5000/api/auth/profile', editData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      setUser(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      phone: user.phone || "",
      altPhone: user.altPhone || "",
      presentAddress: user.presentAddress || "",
      permanentAddress: user.permanentAddress || ""
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const calculateAge = (birthdate) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/citizen-dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{updating ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="bg-white bg-opacity-20 p-6 rounded-full">
                <User className="w-16 h-16 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-green-100 text-lg">{user.role === 'admin' ? 'Administrator' : 'Citizen'}</p>
                <p className="text-green-200 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-900">
                        {user.birthdate ? calculateAge(user.birthdate) : user.age} years old
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">National ID</label>
                      <p className="text-gray-900">{user.nid}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Police Station</label>
                      <p className="text-gray-900">{user.ps}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact & Address
                </h2>
                
                <div className="space-y-4">
                  {/* Phone Number - Editable */}
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Phone Number *</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editData.phone}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Alternative Phone Number - Editable */}
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Alternative Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="altPhone"
                          value={editData.altPhone}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter alternative phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{user.altPhone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Present Address - Editable */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Present Address *</label>
                      {isEditing ? (
                        <textarea
                          name="presentAddress"
                          value={editData.presentAddress}
                          onChange={handleInputChange}
                          rows={2}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter present address"
                        />
                      ) : (
                        <p className="text-gray-900">{user.presentAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* Permanent Address - Editable */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Permanent Address</label>
                      {isEditing ? (
                        <textarea
                          name="permanentAddress"
                          value={editData.permanentAddress}
                          onChange={handleInputChange}
                          rows={2}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter permanent address"
                        />
                      ) : (
                        <p className="text-gray-900">{user.permanentAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Account Actions</h3>
                  <p className="text-gray-600 text-sm">Manage your account settings</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;