import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "",
    guests: "2"
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, token, logout } = useAuth();
  const navigate = useNavigate();

  const timeSlots = [
    { label: "05:00 PM - 07:00 PM", value: "17:00:00" },
    { label: "07:00 PM - 09:00 PM", value: "19:00:00" },
    { label: "09:00 PM - 11:00 PM", value: "21:00:00" },
    { label: "11:00 PM - 01:00 AM", value: "23:00:00" },
  ];

  const handleBooking = async () => {
    setErrorMessage("");
    if (!bookingData.time) {
      setErrorMessage("Please select a time slot.");
      return;
    }
    if (!isLoggedIn || !token) {
      setErrorMessage("Please login to book a table.");
      return;
    }

    setIsSubmitting(true);
    try {
      const confirmRes = await fetch("http://127.0.0.1:8000/api/confirm-booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          date: bookingData.date,
          time: bookingData.time,
          tables: bookingData.guests
        }),
      });

      if (confirmRes.ok) {
        const confirmData = await confirmRes.json();
        setShowBooking(false);

        // PASS DATA TO CONFIRMATION PAGE
        navigate("/confirmation", {
          state: {
            bookingId: confirmData.bookingId,
            date: bookingData.date,
            time: bookingData.time,
            guests: bookingData.guests
          }
        });
      } else {
        const errorData = await confirmRes.json();
        setErrorMessage(confirmRes.status === 401
          ? "Session expired. Please logout and login again."
          : (errorData.error || "Failed to save booking."));
      }
    } catch (err) {
      setErrorMessage("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="top-bar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/Image.png" alt="logo" /> TableNest
        </div>
        {!isLoggedIn ? (
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        ) : (
          <div className="user-section">
            <button className="login-btn" onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      <div className="restaurant-header">
        <h1>Aquarius</h1>
        <p>Experience the finest North Indian & Italian Cuisine</p>
        <button className="book-btn" onClick={() => setShowBooking(true)}>Book a Table</button>
      </div>

      <div className="gallery-grid">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Interior View" />
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" alt="Dining Area" />
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" alt="Ambience" />
      </div>

      {showBooking && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <div className="modal-content">
              <h2>Reserve a Table</h2>
              <p className="modal-subtitle">Secure your spot at Aquarius</p>
              <div className="booking-form">
                {errorMessage && <div className="error-banner">{errorMessage}</div>}
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Select Time Slot</label>
                  <select
                    className="slot-picker"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  >
                    <option value="">-- Choose a Slot --</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                  />
                </div>
                <div className="action-buttons">
                  <button className="book-btn confirm-btn" onClick={handleBooking} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                  <button className="cancel-link" onClick={() => { setShowBooking(false); setErrorMessage(""); }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}