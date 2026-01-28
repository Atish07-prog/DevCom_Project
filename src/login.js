import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [mail, setmail] = useState('');
    const [pass, setpass] = useState('');
    const [usrtype, setusrtype] = useState('user'); // Keeps track of Admin/User selection
    const [wrongpass, setwrongpass] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        setwrongpass(false);

        fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: mail, password: pass })
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            // Check if the role returned from Django matches your selection
            const actualRole = data.role;

            if (usrtype === 'admin' && actualRole !== 'admin') {
                alert("Access Denied: You do not have Admin privileges.");
                return;
            }

            localStorage.setItem('token', data.access);
            localStorage.setItem('role', actualRole);

            // Redirect based on the account type
            if (actualRole === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        })
        .catch(() => setwrongpass(true));
    };

    return (
        <div className="login">
            <div className="welcome">
                <div className="webname"><img src="/Image.png" alt="logo" /><p>DevCom</p></div>
                <div className="welcometext"><p>Welcome back!</p></div>
                <div className="featureinfo">
                    <p>• Connect with Developers</p>
                    <p>• Build Projects</p>
                </div>
            </div>
            <div className="credentials">
                <div className="form">
                    <h1>Login</h1>
                    {/* Re-using your exact AccType structure for radio buttons */}
                    <div className="AccType">
                        <input
                            type="radio"
                            id="admin"
                            name="role"
                            checked={usrtype === 'admin'}
                            onChange={() => setusrtype('admin')}
                        />
                        <label htmlFor="admin">Admin</label>
                        <input
                            type="radio"
                            id="user"
                            name="role"
                            checked={usrtype === 'user'}
                            onChange={() => setusrtype('user')}
                        />
                        <label htmlFor="user">User</label>
                    </div>
                    <form onSubmit={handlesubmit}>
                        <div className="inputfields">
                            <label>Email Address</label>
                            <input type="email" value={mail} onChange={(e) => setmail(e.target.value)} required />
                            <label>Password</label>
                            <input
                                type="password"
                                value={pass}
                                onChange={(e) => setpass(e.target.value)}
                                required
                                className={wrongpass ? "error" : ""}
                            />
                        </div>
                        {wrongpass && <p className="serverrespond">Invalid Email or Password</p>}
                        <div id="loginbutton">
                            {/* Updated button text to reflect your choice */}
                            <button type="submit">Login as {usrtype.toUpperCase()}</button>
                        </div>
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