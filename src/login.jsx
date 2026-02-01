import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";


const Login = () => {
    const [mail, setmail] = useState('');
    const [wrongmail, setwrongmail] = useState(false);
    const [pass, setpass] = useState('');
    const [ispending, setispending] = useState(false);
    const [usrtype, setusrtype] = useState('user'); // Keeps track of Admin/User selection
    const [wrongpass, setwrongpass] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setwrongpass(false);
        setispending(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: mail, password: pass })
            });

            if (response.ok) {
                const data = await response.json();

                if (usrtype === 'admin' && data.role !== 'admin') {
                    setwrongmail(true);
                    setwrongpass(true);
                    setispending(false);
                    return;
                }


                // Update context state immediately with the access token
                if (login) {
                    login(data.username, data.access);//,data.email
                    setispending(false);

                }

                // Redirect based on backend role
                navigate(usrtype==="admin"&&data.role === 'admin' ? "/admin-dashboard" : "/");
            } else {
                setwrongpass(true);
                wrongpass(true);
                setispending(false);
            }
        } catch (err) {
            setwrongpass(true);
            setwrongmail(true);
            setispending(false);
        }
    };

    return (
        <div className="login">
            <div className="welcome">
                <div className="webname">
                    <img src="icon1.png" alt="icon" />
                    <p>Website Name</p>
                </div>
                <div className="welcometext">
                    <h2>Welcome Back</h2>
                    <h3>Reserve a table in one tap</h3>
                </div>
                <div className="features">
                    <img src="icons.png" alt="icons" />
                    <div className="featureinfo">
                        <p> Fine dining, made effortless</p>
                        <p> Check real-time table availability</p>
                        <p> Book tables in seconds</p>
                        <p> 4.8 rating by 15,000+ diners</p>
                    </div>
                    <img src="image.png" alt="tableimage" />

                </div>
            </div>
            <div className="credentials">
                <div className="form">
                    <h1>LOGIN</h1>

                    <form onSubmit={handlesubmit}>
                        <div className="AccType">
                            <input type="radio" id="admin" value="admin" name="choice" onChange={(e) => { setusrtype(e.target.value) }} />
                            <label htmlFor="admin">Admin</label>
                            <input type="radio" id="user" value="user" name="choice" defaultChecked onChange={(e) => { setusrtype(e.target.value) }} />
                            <label htmlFor="user">User</label>
                        </div>


                        <div className="inputfields">
                            <label>Username</label>
                            <input type="text" placeholder="  Enter text" value={mail} onChange={(e) => { setmail(e.target.value); setwrongmail(false);setwrongpass(false); }} className={wrongmail ? "error" : "noerror"} />
                              
                            <label>Password</label>
                            <input type="password" placeholder="  Enter text" value={pass} onChange={(e) => { setpass(e.target.value); setwrongpass(false); setwrongmail(false); }} className={wrongpass ? "error" : "noerror"} />
                            {wrongmail&& wrongpass && <p>Wrong Username or Password</p>}
                        </div>
                        <div id="remember-me">
                            <label>Remember Me</label>
                            <label className="toggle">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div id="loginbutton">
                            {!ispending && <button>login</button>}
                            {ispending && <button disabled>loging in...</button>}
                        </div>

                    </form>
                    <Link to="/forgotpassword" id="forpass">Forgot Password?</Link>
                    <div className="signupandlogin">
                        Don't have an account?
                        <Link to="/register" className="signuploginlink">Sign Up</Link>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Login;