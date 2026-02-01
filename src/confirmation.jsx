import { useLocation, useNavigate } from "react-router-dom";
import "./confirmation.css";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingId, date, time, people } = location.state || {};

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
            <strong>Sea Lounge - The Taj Mahal Palace</strong>
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
            <strong>{people || "2"}</strong>
          </div>
        </div>

        <p className="email-note">
          📩 Your booking details have been sent to your registered email.
        </p>
        <p className="email-note">
          To cancel your booking please contact at  +91 2266653366
        </p>

        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
        
      </div>
    </div>
  );
}