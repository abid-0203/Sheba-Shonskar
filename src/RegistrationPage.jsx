// FileName: /RegistrationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ps, setPs] = useState("");
  const [nid, setNid] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [age, setAge] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 Calculate Age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (e) => {
    const dob = e.target.value;
    setBirthdate(dob);
    setAge(calculateAge(dob));
  };

  // 🟢 Validations
  const isValidPhone = (number) => {
    return /^(013|014|015|016|017|018|019)\d{8}$/.test(number);
  };

  const isValidEmail = (mail) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(mail);
  };

  const isValidNid = (number) => {
    return /^(\d{10}|\d{13}|\d{17})$/.test(number);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 🟢 Extra Checks
    if (firstName.startsWith(" ") || lastName.startsWith(" ")) {
      setError("Name fields cannot start with a space.");
      setIsLoading(false);
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Phone number must be valid Bangladeshi format.");
      setIsLoading(false);
      return;
    }

    if (altPhone && !isValidPhone(altPhone)) {
      setError("Alternative phone must be valid Bangladeshi format.");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email must end with @gmail.com.");
      setIsLoading(false);
      return;
    }

    if (!isValidNid(nid)) {
      setError("NID must be 10, 13, or 17 digits.");
      setIsLoading(false);
      return;
    }

    if (presentAddress.startsWith(" ") || permanentAddress.startsWith(" ")) {
      setError("Address cannot start with a space.");
      setIsLoading(false);
      return;
    }

    if (age < 18) {
      setError("You must be at least 18 years old.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        firstName,
        lastName,
        phone,
        altPhone,
        email,
        ps,
        nid,
        birthdate,
        age,
        presentAddress,
        permanentAddress,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert("Registration successful! Redirecting to dashboard.");
      navigate("/citizen-dashboard");

    } catch (err) {
      console.error("Registration error:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 Max birthdate = today - 18 years
  const maxBirthdate = new Date();
  maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 18);
  const maxDateString = maxBirthdate.toISOString().split("T")[0];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/village.png')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-lg shadow-lg p-8 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              
            </div>
            <div className="w-1/2">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              
            </div>
          </div>

          {/* Contact */}
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <small className="text-gray-500 shadow-sm">Format: 01X######## (BD only)</small>
          </div>

          <div>
            <input
              type="tel"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
              placeholder="Alternative Phone"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <small className="text-gray-500 shadow-sm">Optional, BD only</small>
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <small className="text-gray-500 shadow-sm">Must be @gmail.com</small>
          </div>

          {/* P.S & NID */}
          <div>
            <input
              type="text"
              value={ps}
              onChange={(e) => setPs(e.target.value)}
              placeholder="P.S (Police Station)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <small className="text-gray-500 shadow-sm">Enter your police station</small>
          </div>

          <div>
            <input
              type="text"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              placeholder="NID (National ID)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <small className="text-gray-500 shadow-sm">10, 13, or 17 digits only</small>
          </div>

          {/* Birthdate & Age */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="date"
                value={birthdate}
                onChange={handleBirthdateChange}
                max={maxDateString}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <small className="text-gray-500 shadow-sm">Must be 18+ years old</small>
            </div>
            <div className="w-1/2">
              <input
                type="number"
                value={age}
                placeholder="Age"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* Addresses */}
          <div>
            <textarea
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              placeholder="Present Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows="2"
              required
            />
            
          </div>

          <div>
            <textarea
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              placeholder="Permanent Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows="2"
              required
            />
            
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Registering...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
