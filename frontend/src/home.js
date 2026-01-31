import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Restaurant() {
  const [showBooking, setShowBooking] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="top-bar">
        <div className="logo" onClick={() => navigate("/")}>🍽️ TableNest</div>
        <input className="search" placeholder="Search for restaurant, cuisine or dish" />
        {isLoggedIn ? (
          <div className="auth-buttons">
            <span>{user?.username}</span>
            <button className="login-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>

      <div className="restaurant-header">
        <h1>Aquarius</h1>
        <p>North Indian, Chinese, Italian, Beverages, Dessert</p>
        <button className="primary-btn" onClick={() => setShowBooking(true)}>Book a Table</button>
      </div>

      <div className="content">
        {showBooking && (
          <div className="booking-section">
            <h2>Reserve a Table</h2>
            <div className="booking-form">
              <div className="form-group">
                <label>Date</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" required />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <input type="number" min="1" placeholder="Number of guests" required />
              </div>
              <button className="primary-btn" onClick={() => navigate("/confirmation")}>Confirm Booking</button>
              <button className="back-btn" onClick={() => setShowBooking(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}