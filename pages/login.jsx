import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get location state
  const { login } = useAuth();

  const handleLogin = () => {
    login(); // central auth logic

    // Check if the user was trying to book a table
    const redirectToBooking = location.state?.redirectToBooking;

    if (redirectToBooking) {
      navigate("/", { state: { redirectToBooking: true } }); // send flag back to home
    } else {
      navigate("/"); // default home
    }
  };

  return (
    <div style={{ padding: "80px", textAlign: "center" }}>
      <h1>Login</h1>

      <button
        onClick={handleLogin}
        style={{
          marginTop: "30px",
          padding: "12px 30px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Login (Test)
      </button>
    </div>
  );
}

