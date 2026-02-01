import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import "./profile.css"; 

export default function Profile() {
  const { user,email } = useAuth(); 
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/")
      .then(res => res.json())
      .then(data => {
        const userBookings = data
          .filter(b => b.user === user)
          .map(b => ({
            id: b.booking_id,
            booking_id: b.booking_id,
            date: b.date,
            time: b.time.slice(0,5),
            guests: b.tables_reserved,
            status: b.status,
          }));
        setBookings(userBookings);
      })
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="profile-container">
        <Link to="/" className="back-button">← Back to Home</Link>

    
      <div className="profile-header">
        <img
          src="profile.png"
          alt="Profile"
          className="profile-icon"
        />
        <div className="profile-info">
          <h2>{user}</h2>
          <p>Email: — {email}</p>
        </div>
      </div>

      <section className="booking-section">
        <h3>My Bookings</h3>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.booking_id}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{b.guests}</td>
                  <td className={`status ${b.status}`}>{b.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}