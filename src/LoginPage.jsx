// FileName: /LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logBg from "./assets/log_bg.png";
import axios from 'axios'; // Import axios for HTTP requests

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join(" ");
};

const LoginPage = ({ initialTab = "citizen" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });
  const [loginError, setLoginError] = useState(""); // New state for login errors

  useEffect(() => {
    setFormData({ email: "", password: "", captcha: "" });
    setCaptchaCode(generateCaptcha());
    setLoginError(""); // Clear error on tab change
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(""); // Clear previous errors

    // Validate captcha (remove spaces for comparison)
    const enteredCaptcha = formData.captcha.replace(/\s/g, '');
    const actualCaptcha = captchaCode.replace(/\s/g, '');
    
    if (enteredCaptcha.toLowerCase() !== actualCaptcha.toLowerCase()) {
      setLoginError("Invalid captcha code. Please try again.");
      setCaptchaCode(generateCaptcha());
      setFormData(prev => ({ ...prev, captcha: "" }));
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      // Store token and user info (e.g., in localStorage)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user details

      console.log("Login successful:", res.data);
      
      // Navigate based on user role from backend
      if (res.data.user.role === "citizen") {
        navigate("/citizen-dashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/admin-dashboard"); // You can create this later
      }
      
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setLoginError(error.response?.data?.msg || "Login failed. Please check your credentials.");
      setCaptchaCode(generateCaptcha()); // Refresh captcha on login failure
      setFormData(prev => ({ ...prev, captcha: "" })); // Clear captcha input
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={logBg}
          alt="Bangladesh rural landscape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="text-center mb-8 mt-8">
            <h1 className="text-2xl font-bold">
              <span className="text-red-600">Sheba</span>
              <span className="text-green-600">Shongskar</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Citizen Problem Reporting Platform
            </p>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>

          {/* Tabs */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("citizen")}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "citizen"
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "admin"
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Captcha */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                <div className="bg-white px-3 py-2 rounded border-2 border-dashed border-gray-300">
                  <span className="font-mono text-lg font-bold tracking-wider text-gray-700">
                    {captchaCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCaptchaCode(generateCaptcha())}
                  className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  title="Refresh captcha"
                >
                  ↻
                </button>
              </div>
              <input
                type="text"
                name="captcha"
                placeholder="Enter the code (without spaces)"
                value={formData.captcha}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

            {/* Links */}
            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-green-600 hover:underline"
              >
                Forgot password?
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-green-600 hover:underline"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:underline"
                >
                  Back to Home
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
