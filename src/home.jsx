import "./home.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Restaurant() {
  const [showShareCard, setShowShareCard] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState("booking");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split("T")[0],
    people: "2",
    time: "",
  });

  const dropdownRef = useRef(null);
  const galleryEndRef = useRef(null);

  const { isLoggedIn, logout, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Outside Click for Profile Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle auto-scroll if redirected from login
  useEffect(() => {
    if (location.state?.redirectToBooking && isLoggedIn) {
      setShowBooking(true);
      setTimeout(() => {
        const y = galleryEndRef.current.getBoundingClientRect().top + window.pageYOffset - 250;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [location.state, isLoggedIn]);

  const handleBookingSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/confirm-booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          date: bookingData.date,
          time: bookingData.time,
          tables: bookingData.people // Backend expects 'tables' for guest count
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/confirmation", { state: { bookingId: data.bookingId, ...bookingData } });
      } else {
        const err = await response.json();
        setErrorMessage(err.error || "Booking failed.");
      }
    } catch (err) {
      setErrorMessage("Cannot connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
          <img src="logo.png" alt="logo" />
          TableNest
        </div>

        {isLoggedIn ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <div className="profile" onClick={() => setShowProfileMenu((prev) => !prev)}>
              <img src="profile.png" alt="profile-picture" />
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                {/* DYNAMIC NAME: This will show 'om' */}
                <p className="username" style={{ textTransform: 'capitalize' }}>{user}</p>
                <button className="profile-link" onClick={() => navigate("/profile")}>My Account</button>
                <button className="logout-btn" onClick={() => { logout(); setShowBooking(false); }}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/loginpage")}>Login</button>
        )}
      </div>

      {/* RESTAURANT HEADER */}
      <div className="restaurant-sticky">
        <div className="sticky-left">
          <h1>Sea Lounge - The Taj Mahal Palace</h1>
          <p className="sub">Italian, Sandwich, Street Food, Desserts, Tea, Coffee, Beverages</p>
          <p className="address">
            The Taj Mahal Palace, Apollo Bunder, Colaba, Mumbai
          </p>
          <div className="meta">
            <span className="open">Open Now 07:00 AM - 11:30 PM</span>
            <span>₹5000 for two</span>
            <span>📞 +91 2266653366</span>
          </div>
          <div className="actions">
            <button className="outline-btn"
              onClick={() => setShowShareCard(true)}
            >
              Share
            </button>
            <button className="outline-btn"><a target="_blank" rel="noopener noreferrer" id="map_redirect" href="https://maps.app.goo.gl/Ndj691Cy9dQTLcQn8">Directions</a></button>
          </div>
        </div>


        {showShareCard && (
          <div className="share-card-overlay" onClick={() => setShowShareCard(false)}>
            <div className="share-card" onClick={(e) => e.stopPropagation()}>
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80" alt="Restaurant" className="card-image" />
              <h2>Sea Lounge - The Taj Mahal Palace</h2>
              <p>Book a table for an unforgettable evening</p>
              <p id="contact-number">contact : +91 2266653366 </p>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                      setShowShareCard(false);        // close the share card
                      setCopiedMessage(true);         // show the "Link copied!" message
                      setTimeout(() => setCopiedMessage(false), 2000); // hide after 2s
                    });
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {copiedMessage && (
          <div className="copied-toast">
            Link copied!
          </div>
        )}



        <div className="sticky-right">
          <button
            className="primary-btn"
            onClick={() => {

              setShowBooking(true);
              const y =
                galleryEndRef.current.getBoundingClientRect().top +
                window.pageYOffset - 250;
              window.scrollTo({ top: y, behavior: "smooth" });

              if (!isLoggedIn) {
                setErrorMessage("Please Login to proceed")

                return;
              }
            }}
          >
            Book a Table
          </button>
        </div>
      </div>

      {/* GALLERY */}
      <div className="gallery">
        <img className="big" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/f3/f3/e1/sea-lounge.jpg?w=1800&h=1000&s=1" alt="Interior-Image" />
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/fc/06/46/photo1jpg.jpg?w=1400&h=-1&s=1" alt="Interior-Image" />
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/92/1e/99/caption.jpg?w=1100&h=-1&s=1" alt="Interior-Image" />
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/92/1e/94/caption.jpg?w=1100&h=-1&s=1" alt="Interior-Image" />
        <div className="gallery-last">
          <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1" alt="Interior-Image" />
          <button onClick={() => {
            setActiveTab("photos");
            setShowBooking(false);

            const y =
              galleryEndRef.current.getBoundingClientRect().top +
              window.pageYOffset - 250;
            window.scrollTo({ top: y, behavior: "smooth" });
          }} className="gallery-btn">View Gallery</button>
        </div>
      </div>

      <div ref={galleryEndRef}></div>

      {/* TABS & CONTENT */}
      {!showBooking ? (
        <>
          <div className="tabs">
            {["overview", "menu", "reviews", "photos"].map((t) => (
              <span key={t} className={activeTab === t ? "active" : ""} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</span>
            ))}
          </div>
          <div className="content">
            {activeTab === "overview" && (
              <div>
                <h2>Overview</h2>
                <div className="info-overview">
                  <h3>People Say This Place Is Known For</h3>
                  <p>Seaview, Spectacular View, Best View, Amazing View, Nice View, Beautiful View</p>

                  <h3>Average Cost</h3>
                  <p>₹5,000 for two people (approx.) Without alcohol</p>

                  <p>Exclusive of applicable taxes and charges, if any</p>

                  <p>₹500 for a pint of beer (approx.)</p>
                </div>
                <div className="offers">
                  <h3>Offers</h3>
                  <div className="offers-card">
                    <img src="offers.png" alt="offercard" />
                  </div>

                </div>
              </div>
            )}

            {activeTab === "menu" && (
              <div>
                <h2>Menu</h2>
                <img className="menu-img" src="menu2.png" alt="menu" />
                <img className="menu-img" src="menu1.png" alt="menu" />

              </div>
            )}

            {activeTab === "photos" && (
              <>
                <h2>Photos</h2>
                <div id="photosection">

                  <img src="https://b.zmtcdn.com/data/pictures/chains/5/38475/2e055fa36a1f698ef72168589c846d4b.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/pictures/chains/5/38475/7dc252c1aa97578b56ce9d161025b61e.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/pictures/5/38475/0ebd7309685c448ffdceaff57ae9f2db.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/pictures/5/38475/33271a6a9a6a0452ac1a9cb0fc7aaa54.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/pictures/5/38475/2f2b76717715a23879f64f04206c4d6f.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/pictures/chains/5/38475/9c1d1082bece89bd2466716aae3e4d90.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/0f7/76db76f327f807704b3ee2526697f0f7_1522142171.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/4ec/6ae3dca293a19e5022b7c571ea5664ec_1606136942.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/8c4/c67e1ded0aca76c4dd423bc3786ba8c4_1535961703.JPG?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/3d1/29f239e7df9ace2d54aa697a3c1ab3d1_1621011650.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/0d7/fdec4226aad1c907e71d9bee71db50d7_1522142169.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/93a/a0396f91ce6b55bf45de23933f96b93a_1524411121.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/7ea/076d228d88909519b55deb2e6fd2d7ea_1468728006.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/077/bcd5d1dcd90f3d2e153534d738fda077_1538900851.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/53f/b13c7aae944a465d0dcb382cc76e053f_1505219513.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/f40/a3b6cd91b2132af1beeb0400eef13f40_1429425014.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/1d6/d21fc602238184f52f7470c5fa1371d6_1418462862.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/d67/b2c6f36f498fccee6246484f6ee3bd67_1426519894.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/892/ad3834e0d82dfd839c216cdf32655892_1524411104.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                  <img src="https://b.zmtcdn.com/data/reviews_photos/435/d2c7a0c20a70426a40ddfe03533a6435_1468728209.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A" alt="interior/food/ambience-image" />
                </div>
              </>
            )}
            {activeTab === "reviews" && (
              <div className="reviews-section">
                <h2>Reviews</h2>

                <div className="review-card">
                  <div className="review-header">
                    <div className="review-avatar"><img src="reviews-pp.png" alt="profilepicture" /></div>
                    <div>
                      <h4>Rahul Sharma</h4>
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                  <p>
                    Amazing food and great ambiance! The staff was very polite and the
                    service was quick. Definitely coming back with friends.
                  </p>
                </div>

                <div className="review-card">
                  <div className="review-header">
                    <div className="review-avatar"><img src="reviews-pp.png" alt="profilepicture" /></div>
                    <div>
                      <h4>Ananya Verma</h4>
                      <span className="stars">⭐⭐⭐⭐☆</span>
                    </div>
                  </div>
                  <p>
                    Loved the taste and presentation of the dishes. Slight delay in service,
                    but overall a very pleasant experience.
                  </p>
                </div>

                <div className="review-card">
                  <div className="review-header">
                    <div className="review-avatar"><img src="reviews-pp.png" alt="profilepicture" /></div>
                    <div>
                      <h4>Mohit Patel</h4>
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                  <p>
                    One of the best dining experiences I’ve had recently. The desserts were
                    especially fantastic. Highly recommended!
                  </p>
                </div>

                <div className="review-card">
                  <div className="review-header">
                    <div className="review-avatar"><img src="reviews-pp.png" alt="profilepicture" /></div>
                    <div>
                      <h4>Pooja Mehta</h4>
                      <span className="stars">⭐⭐⭐⭐☆</span>
                    </div>
                  </div>
                  <p>
                    Cozy place with good vibes. Prices are reasonable and portion sizes are
                    generous. Would love to try more items from the menu.
                  </p>
                </div>
              </div>
            )}

          </div>

        </>
      ) : (
        <div className="content">
          <button className="back-btn" onClick={() => { setShowBooking(false); setBookingStep("booking"); }}>← Back</button>
          {errorMessage && <p className="error-banner" >{errorMessage}</p>}

          {bookingStep === "booking" ? (
            <BookingSection
              bookingData={bookingData}
              setBookingData={setBookingData}
              onProceed={() => setBookingStep("payment")}
            />
          ) : (
            <PaymentSection
              bookingData={bookingData}
              userName={user}
              onConfirm={handleBookingSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function BookingSection({ bookingData, setBookingData, onProceed }) {
  const slots = ["17:00:00", "19:00:00", "21:00:00", "23:00:00"];
  const { isLoggedIn } = useAuth();
  return (
    <div className="booking-box">
      <h2>Select Booking Details</h2>
      <div className="booking-row">
        <div className="booking-field"><input type="date" value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} /></div>
        <div className="booking-field">
          <select value={bookingData.people} onChange={(e) => setBookingData({ ...bookingData, people: e.target.value })}>
            {[...Array(10)].map((_, i) => <option key={i} value={i + 1}>{i + 1} People</option>)}
          </select>
        </div>
      </div>
      <div className="time-slots">
        {slots.map(s => (
          <button key={s} className={bookingData.time === s ? "slot active" : "slot"} onClick={() => setBookingData({ ...bookingData, time: s })}>{s.slice(0, 5)}</button>
        ))}
      </div>
      <button className="book-final" disabled={!bookingData.time || !isLoggedIn} onClick={onProceed}>Proceed</button>
    </div>
  );
}

function PaymentSection({ bookingData, userName, onConfirm, isSubmitting }) {
  const [mode, setMode] = useState("");
  return (
    <div className="payment-container">
      <div className="booking-box payment-left">
        <h2>Payment</h2>
        <select id="paymentbox" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">Select Mode</option>
          <option>UPI</option>
          <option>Card</option>
        </select>
        <button className="book-final" onClick={onConfirm} disabled={isSubmitting || !mode}>
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
      <div className="booking-details-card">
        <h3>Summary</h3>
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Date:</strong> {bookingData.date}</p>
        <p><strong>Guests:</strong> {bookingData.people}</p>
      </div>
    </div>
  );
}