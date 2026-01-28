import { useLocation, Link } from "react-router-dom";
import "./confirmation.css";

export default function Confirmation() {
  const location = useLocation();

  // Fallback data if user refreshes page
  const booking = location.state || {
    bookingId: "BK-" + Math.floor(Math.random() * 1000000),
    restaurant: "Your Restaurant",
    date: "—",
    time: "—",
    guests: "—",
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>

        <h1>Booking Confirmed</h1>
        <p className="subtitle">
          Thank you for your reservation. We’re excited to host you!
        </p>

        <div className="booking-details">
          <div>
            <span>Booking ID</span>
            <strong>{booking.bookingId}</strong>
          </div>
          <div>
            <span>Restaurant</span>
            <strong>{booking.restaurant}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{booking.date}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>
          <div>
            <span>Guests</span>
            <strong>{booking.guests}</strong>
          </div>
        </div>

        <p className="email-note">
          📩 Your booking details have been sent to your registered email.
        </p>

        <Link to="/" className="home-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
