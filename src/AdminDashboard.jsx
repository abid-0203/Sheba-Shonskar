// File: src/AdminDashboard.jsx
import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Example reports */}
        <div className="space-y-4">
          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">Robert Fox</h3>
            <p className="text-gray-600">Dirty and broken road</p>
            <div className="flex gap-3 my-3">
              <img src="broken1.jpg" alt="road" className="w-1/2 rounded-lg" />
              <img src="broken2.jpg" alt="road" className="w-1/2 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded">
                In Progress
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-600 rounded">
                Complete
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-600 rounded">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
