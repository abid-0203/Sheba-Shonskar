// FileName: /RegistrationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests

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

  // 🟢 Function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (e) => {
    const dob = e.target.value;
    setBirthdate(dob);
    setAge(calculateAge(dob));
  };

  // Restrict birthdate to minimum 18 years ago
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // First/Last name validation
    if (firstName.trim() === "" || lastName.trim() === "") {
      setError("First and Last name cannot start with space or be empty.");
      setIsLoading(false);
      return;
    }

    // Phone validation (Bangladesh only: 11 digits, starts with 01)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setError(
        "Enter a valid Bangladeshi phone number (11 digits, starts with 01)."
      );
      setIsLoading(false);
      return;
    }

    // Alt phone validation (if provided)
    if (altPhone && !phoneRegex.test(altPhone)) {
      setError(
        "Alternative phone must also be a valid Bangladeshi number (11 digits, starts with 01)."
      );
      setIsLoading(false);
      return;
    }

    // Email validation
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Address validation
    if (presentAddress.trim() === "" || permanentAddress.trim() === "") {
      setError("Addresses cannot start with a space or be empty.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        altPhone,
        email,
        ps,
        nid,
        birthdate,
        age,
        presentAddress: presentAddress.trim(),
        permanentAddress: permanentAddress.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Registration successful! Redirecting to dashboard.");
      navigate("/citizen-dashboard");
    } catch (err) {
      console.error(
        "Registration error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.msg || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/village.png')",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-lg shadow-lg p-8 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value.replace(/^\s+/, ""))
              }
              placeholder="First Name"
              className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.replace(/^\s+/, ""))}
              placeholder="Last Name"
              className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Contact */}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="tel"
            value={altPhone}
            onChange={(e) => setAltPhone(e.target.value)}
            placeholder="Alternative Phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {/* P.S & NID */}
          <input
            type="text"
            value={ps}
            onChange={(e) => setPs(e.target.value)}
            placeholder="P.S (Police Station)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="text"
            value={nid}
            onChange={(e) => setNid(e.target.value)}
            placeholder="NID (National ID)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {/* Birthdate & Age */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={birthdate}
              onChange={handleBirthdateChange}
              max={minDate} // 👈 only allow DOB at least 18 years ago
              className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="number"
              value={age}
              placeholder="Age"
              className="w-1/2 px-4 py-2 border rounded-lg bg-gray-100"
              readOnly
            />
          </div>

          {/* Addresses */}
          <textarea
            value={presentAddress}
            onChange={(e) =>
              setPresentAddress(e.target.value.replace(/^\s+/, ""))
            }
            placeholder="Present Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="2"
            required
          />

          <textarea
            value={permanentAddress}
            onChange={(e) =>
              setPermanentAddress(e.target.value.replace(/^\s+/, ""))
            }
            placeholder="Permanent Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="2"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

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
