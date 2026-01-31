import { BrowserRouter, Routes, Route } from "react-router-dom";
import Restaurant from "./pages/home";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx"; // New import
import Confirmation from "./pages/confirmation";
import AdminDashboard from "./pages/AdminDashboard.jsx"; // From your App.js code
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // Ensure this line is here to avoid the white screen