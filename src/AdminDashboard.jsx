import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  /* ---------------- BOOKINGS STATE ---------------- */
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [bookings, setBookings] = useState([]);

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw data from backend:",data); //added 1 
        const formatted = data.map((b) => ({
          id: b.booking_id, //key
          booking_id : b.booking_id, //display
          username: b.user,
          time: b.time.slice(0, 5),
          guests: b.tables_reserved,
          status: (b.status||"confirmed").toLowerCase(),
          date: b.date,
        }));
        console.log("formatted bookings:",formatted); //added 2 
        setBookings(formatted);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cancelBooking = (id) => {
    fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel/`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cancel failed");
        return res.json();
      })
      .then(() => {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "cancelled" } : b
          )
        );
      })
      .catch((err) => console.error(err));
  };


  const filteredBookings = bookings.filter(
    (b) => b.date === selectedDate
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h2>Sea Lounge - The Taj Mahal Palace</h2>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* BOOKINGS */}
      <section className="admin-section">
        <h3>Bookings</h3>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No bookings for this date
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.booking_id}</td>
                  <td>{b.username}</td>
                  <td>{b.time}</td>
                  <td>{b.guests}</td>
                  <td className={`status ${b.status}`}>{b.status}</td>
                  <td>
                    {b.status === "confirmed" && (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelBooking(b.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
