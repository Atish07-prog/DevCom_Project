import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./fetchdata";
import { Link } from "react-router-dom";
const Login = () => {

    const { data, ispendingdata, error } = useFetch('http://localhost:8000/users');
    const [wrongmail,setwrongmail]=useState(false);
    const [wrongpass,setwrongpass]=useState(false);


    const [usrtype, setusrtype] = useState('user');
    const [pass, setpass] = useState('');
    const [mail, setmail] = useState('');
    const [ispending, setispending] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        setispending(true);

        const check = data.find((user) => user.email === mail);

        if (!check||check.usertype !== usrtype) {
            setwrongmail(true);
            setispending(false);
            return;
        }

        if (check.password === pass && check.usertype === usrtype) {
            setispending(false);
            navigate("/");
        } else {
             setwrongpass(true);
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
                            <label>Email</label>
                            <input type="email" placeholder="  Enter text"  value={mail} onChange={(e) => { setmail(e.target.value); setwrongmail(false);} } className={wrongmail?"error":"noerror"}/>
                            {wrongmail&&<p>User not found</p>}
                            <label>Password</label>
                            <input type="password" placeholder="  Enter text" value={pass} onChange={(e) => { setpass(e.target.value); setwrongpass(false); }}  className={wrongpass?"error":"noerror"}/>
                            {wrongpass&&<p>Wrong password</p>}
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
                    {ispendingdata && <p className="serverrespond">SERVER IS LOADING PLEASE WAIT...</p>}
                    {error && <p className="serverrespond">SORRY SERVER NOT RESPONDING...</p>}
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