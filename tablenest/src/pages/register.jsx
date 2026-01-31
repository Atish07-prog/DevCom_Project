import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        if (pass !== confPass) {
            return alert("Passwords do not match!");
        }

        fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            // UPDATED: 'role' changed to 'customer' to match Django models.py
            body: JSON.stringify({
                username: name,
                email: mail,
                password: pass,
                role: 'customer'
            })
        })
        .then(res => {
            if (res.ok) {
                alert("Registration Successful!");
                navigate("/login");
            } else {
                // If it fails, we log the status to the console for debugging
                console.log("Response Status:", res.status);
                alert("Registration failed. Check if email/username already exists.");
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("Server is not responding.");
        });
    };

    return (
        <div className="login">
            <div className="welcome">
                <div className="webname">
                    <img src="/Image.png" alt="logo" />
                    <p>DevCom</p>
                </div>
                <div className="welcometext">
                    <img src="/icon1.png" alt="hi" />
                    <p>Join Us!</p>
                </div>
            </div>
            <div className="credentials">
                <div className="form">
                    <h1>SIGN UP</h1>
                    <form onSubmit={handleSignup}>
                        <div className="inputfields">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                required
                            />
                            <label>Password</label>
                            <input
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confPass}
                                onChange={(e) => setConfPass(e.target.value)}
                                required
                            />
                        </div>
                        <div id="signupbutton">
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>
                    <div className="signupandlogin">
                        Already have an account? <Link to="/login" className="signuploginlink">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;