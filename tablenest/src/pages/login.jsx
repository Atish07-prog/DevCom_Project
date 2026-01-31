import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const Login = () => {
    const [mail, setmail] = useState('');
    const [pass, setpass] = useState('');
    const [usrtype, setusrtype] = useState('user');
    const [wrongpass, setwrongpass] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setwrongpass(false);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: mail, password: pass })
            });

            if (response.ok) {
                const data = await response.json();

                if (usrtype === 'admin' && data.role !== 'admin') {
                    alert("Access Denied: You do not have Admin privileges.");
                    return;
                }

                // Update context state immediately with the access token
                if (login) login(data.username, data.access);

                // Redirect based on backend role
                navigate(data.role === 'admin' ? "/admin-dashboard" : "/");
            } else {
                setwrongpass(true);
            }
        } catch (err) {
            setwrongpass(true);
        }
    };

    return (
        <div className="login">
            <div className="welcome">
                <div className="webname">
                    <img src="/Image.png" alt="logo" />
                    <p>TableNest</p>
                </div>
                <div className="welcometext"><p>Welcome back!</p></div>
                <div className="featureinfo">
                    <p>• Book your favorite tables</p>
                    <p>• Manage reservations</p>
                </div>
            </div>
            <div className="credentials">
                <div className="form">
                    <h1>Login</h1>
                    <div className="AccType">
                        <input type="radio" id="admin" checked={usrtype === 'admin'} onChange={() => setusrtype('admin')} />
                        <label htmlFor="admin">Admin</label>
                        <input type="radio" id="user" checked={usrtype === 'user'} onChange={() => setusrtype('user')} />
                        <label htmlFor="user">User</label>
                    </div>
                    <form onSubmit={handlesubmit}>
                        <div className="inputfields">
                            <label>Username</label>
                            <input type="text" value={mail} onChange={(e) => setmail(e.target.value)} required />
                            <label>Password</label>
                            <input type="password" value={pass} onChange={(e) => setpass(e.target.value)} required className={wrongpass ? "error" : ""} />
                        </div>
                        {wrongpass && <p className="serverrespond">Invalid Username or Password</p>}
                        <div id="loginbutton"><button type="submit">Login as {usrtype.toUpperCase()}</button></div>
                    </form>
                    <div className="signupandlogin">
                        Don't have an account? <Link to="/register" className="signuploginlink">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;