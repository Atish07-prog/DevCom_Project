import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [mail, setmail] = useState('');
    const [pass, setpass] = useState('');
    const [usrtype, setusrtype] = useState('user'); // 'admin' or 'user'
    const [wrongpass, setwrongpass] = useState(false);
    const [ispending, setispending] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        setispending(true);
        setwrongpass(false);

        // We use 'username' as the key because Django's default auth
        // often looks for 'username' even if the value is an email.
        const credentials = {
            username: mail,
            password: pass
        };

        fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        })
        .then(res => {
            if (!res.ok) {
                // This triggers the "Invalid email or password" red text
                throw new Error('Unauthorized');
            }
            return res.json();
        })
        .then(data => {
            setispending(false);

            // Success! Store the token and redirect
            localStorage.setItem('token', data.access);
            console.log("Login successful, data stored in backend table");
            navigate("/");
        })
        .catch((err) => {
            setispending(false);
            setwrongpass(true); // Shows the red error message
            console.error("Login failed:", err);
        });
    };

    return (
        <div className="login-container">
            <h1>LOGIN</h1>
            <div className="AccType">
                <button
                    className={usrtype === 'admin' ? "active" : ""}
                    onClick={() => setusrtype('admin')}
                >Admin</button>
                <button
                    className={usrtype === 'user' ? "active" : ""}
                    onClick={() => setusrtype('user')}
                >User</button>
            </div>

            <form onSubmit={handlesubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={mail}
                    onChange={(e) => setmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    value={pass}
                    onChange={(e) => setpass(e.target.value)}
                    className={wrongpass ? "error-border" : ""}
                    required
                />

                {wrongpass && <p className="err-msg">Invalid email or password</p>}

                <div id="loginbutton">
                    {!ispending && <button type="submit">login</button>}
                    {ispending && <button disabled>logging in...</button>}
                </div>
            </form>

            <div className="signup-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;