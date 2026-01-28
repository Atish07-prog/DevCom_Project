import "./home.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Restaurant() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState("booking");

  // lifted booking state to parent (backend link)
  const [bookingData, setBookingData] = useState({
    date: "",
    people: "",
    time: "",
  });

  const dropdownRef = useRef(null);
  const galleryEndRef = useRef(null);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show booking section automatically if redirected from login
  useEffect(() => {
    if (location.state?.redirectToBooking && isLoggedIn) {
      setShowBooking(true);
      const y =
        galleryEndRef.current.getBoundingClientRect().top + window.pageYOffset - 250;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [location.state, isLoggedIn]);

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="logo">🍽️ TableNest</div>
        <input className="search" placeholder="Search for restaurant, cuisine or dish" />

        {isLoggedIn ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <div
              className="profile"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              👤
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <p className="username">Ayush</p>
                <button className="profile-link" onClick={() => alert("Profile page coming soon")}>
                  My Account
                </button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setShowBooking(false);
                    setBookingStep("booking");
                    setBookingData({ date: "", people: "", time: "" });
                    setActiveTab("overview");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setShowProfileMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      {/* STICKY RESTAURANT HEADER */}
      <div className="restaurant-sticky">
        <div className="sticky-left">
          <h1>Aquarius</h1>
          <p className="sub">North Indian, Chinese, Italian, Beverages, Dessert</p>
          <p className="address">
            KC Marg, Uday Nagar, Opposite Lamborghini Showroom, Bandra West, Mumbai
          </p>
          <div className="meta">
            <span className="open">Open Now 12:00–11:30 PM</span>
            <span>₹3000 for two</span>
            <span>📞 +91 99190101234</span>
          </div>
          <div className="actions">
            <button className="outline-btn">Share</button>
            <button className="outline-btn">Direction</button>
          </div>
        </div>

        <div className="sticky-right">
          <button
            className="primary-btn"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login", { state: { redirectToBooking: true } });
                return;
              }
              setShowBooking(true);
              const y =
                galleryEndRef.current.getBoundingClientRect().top +
                window.pageYOffset - 250;
              window.scrollTo({ top: y, behavior: "smooth" });
            }}
          >
            Book a Table
          </button>
        </div>
      </div>

      {/* GALLERY */}
      <div className="gallery">
        <img
          className="big"
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
          alt=""
        />
        <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" />
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" />
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" />
        <div className="gallery-last">
          <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1" />
          <button className="gallery-btn">View Gallery</button>
        </div>
      </div>

      <div ref={galleryEndRef}></div>

      {/* TABS */}
      {!showBooking && (
        <div className="tabs">
          {["overview", "menu", "photos"].map((tab) => (
            <span
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="content">
        {!showBooking && activeTab === "overview" && <p>Overview content...</p>}
        {!showBooking && activeTab === "menu" && <p>Menu content...</p>}
        {!showBooking && activeTab === "photos" && <p>Photos content...</p>}

        {/* BOOKING SECTION */}
        {showBooking && (
          <>
            {/* BACK BUTTON */}
            <button
              className="back-btn"
              onClick={() => {
                setShowBooking(false);
                setBookingStep("booking");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ← Back
            </button>

            {bookingStep === "booking" && (
              <BookingSection
                bookingData={bookingData}
                setBookingData={setBookingData}
                onProceed={() => setBookingStep("payment")}
              />
            )}
            {bookingStep === "payment" && (
              <PaymentSection bookingData={bookingData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ================= BOOKING ================= */
function BookingSection({ bookingData, setBookingData, onProceed }) {
  const timeSlots = [
    { time: "5:00 pm", offers: 2 },
    { time: "7:00 pm", offers: 2 },
    { time: "10:00 pm", offers: 1 },
  ];

  return (
    <div className="booking-box">
      <h2>Select Booking Details</h2>

      <div className="booking-row">
        <div className = "booking-field">
        <input
          type="date"
          value={bookingData.date}
          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
        />
        </div>
        <div className = "booking-field">
        <select
          value={bookingData.people}
          onChange={(e) => setBookingData({ ...bookingData, people: e.target.value })}
        >
          <option value="">No. of People</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} People
            </option>
          ))}
        </select>
        </div>
      </div>

      <p className="time-label">Time Slot</p>
      <div className="time-slots">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            className={bookingData.time === slot.time ? "slot active" : "slot"}
            onClick={() => setBookingData({ ...bookingData, time: slot.time })}
          >
            {slot.time}
            <span>{slot.offers} Offers</span>
          </button>
        ))}
      </div>

      <button
        className="book-final"
        disabled={!bookingData.date || !bookingData.people || !bookingData.time}
        onClick={onProceed}
      >
        Book a Table
      </button>
    </div>
  );
}

/* ================= PAYMENT ================= */
function PaymentSection({ bookingData }) {
  const [mode, setMode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="payment-container">
      <div className="booking-box payment-left">
        <h2>Payment</h2>
        <div className="booking-row">
          <input value="₹999" disabled />
        </div>

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">Select Payment Mode</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
        </select>

        <button className="book-final" onClick={() => navigate("/confirmation")}>
          Confirm Payment
        </button>
      </div>

      {/* RIGHT SIDE BOOKING DETAILS CARD */}
      <div className="booking-details-card">
        <h3>Booking Details</h3>
        <p><strong>Restaurant:</strong> Aquarius</p>
        <p><strong>Name:</strong> Ayush</p>                           {/*username*/}
        <p><strong>Date:</strong> {bookingData.date}</p>
        <p><strong>Guests:</strong> {bookingData.people}</p>
        <p><strong>Time Slot:</strong> {bookingData.time}</p>
      </div>
    </div>
  );
}
