import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import CitizenDashboard from "./CitizenDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;