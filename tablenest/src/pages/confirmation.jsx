import { useLocation, useNavigate } from "react-router-dom";
import "./confirmation.css";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the booking details passed from Home.jsx
  const { bookingId, date, time, guests } = location.state || {};

  return (
    <div className="conf-container">
      <div className="conf-card">
        <div className="success-icon">✓</div>
        <h2>Booking Confirmed</h2>
        <p className="conf-message">Thank you for your reservation. We're excited to host you!</p>

        <div className="details-box">
          <div className="detail-row">
            <span>Booking ID</span>
            <strong className="booking-id-text">{bookingId || "BK-143149"}</strong>
          </div>
          <div className="detail-row">
            <span>Restaurant</span>
            <strong>Aquarius</strong>
          </div>
          <div className="detail-row">
            <span>Date</span>
            <strong>{date || "31-01-2026"}</strong>
          </div>
          <div className="detail-row">
            <span>Time</span>
            <strong>{time || "23:00:00"}</strong>
          </div>
          <div className="detail-row">
            <span>Guests</span>
            <strong>{guests || "2"}</strong>
          </div>
        </div>

        <p className="email-note">
          📩 Your booking details have been sent to your registered email.
        </p>

        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}