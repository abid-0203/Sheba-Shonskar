import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // 🟢 Function to calculate age
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

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); // clear error
    console.log("Registering:", {
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
    alert("Registration form submitted!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/village.png')", // 👈 background photo
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
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Contact */}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="tel"
            value={altPhone}
            onChange={(e) => setAltPhone(e.target.value)}
            placeholder="Alternative Phone"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* P.S & NID */}
          <input
            type="text"
            value={ps}
            onChange={(e) => setPs(e.target.value)}
            placeholder="P.S"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="text"
            value={nid}
            onChange={(e) => setNid(e.target.value)}
            placeholder="NID"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Birthdate & Age */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={birthdate}
              onChange={handleBirthdateChange}
              className="w-1/2 px-4 py-2 border rounded-lg"
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
            onChange={(e) => setPresentAddress(e.target.value)}
            placeholder="Present Address"
            className="w-full px-4 py-2 border rounded-lg"
            rows="2"
            required
          />

          <textarea
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            placeholder="Permanent Address"
            className="w-full px-4 py-2 border rounded-lg"
            rows="2"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
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
