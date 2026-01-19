import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setname] = useState('');
    const [mail, setmail] = useState('');
    const [pass, setpass] = useState('');
    const [confirmpass, setconfirmpass] = useState('');
    const [ispending, setispending] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();

        if (pass !== confirmpass) {
            alert("Passwords do not match!");
            return;
        }

        setispending(true);

        // This object matches the standard Django User table fields
        const newUser = {
            username: name, // In Django, 'username' is the default field for names
            email: mail,
            password: pass
        };

        fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        .then(res => {
            if (res.ok) {
                alert("Sign Up Successful! Data stored in table.");
                setispending(false);
                navigate("/login");
            } else {
                return res.json().then(data => {
                    alert("Error: " + JSON.stringify(data));
                    setispending(false);
                });
            }
        })
        .catch(err => {
            console.error("Connection error:", err);
            setispending(false);
        });
    };

    return (
        <div className="register">
            <h1>SIGN UP</h1>
            <form onSubmit={handlesubmit}>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setname(e.target.value)} required />

                <label>Email</label>
                <input type="email" value={mail} onChange={(e) => setmail(e.target.value)} required />

                <label>Password</label>
                <input type="password" value={pass} onChange={(e) => setpass(e.target.value)} required />

                <label>Confirm Password</label>
                <input type="password" value={confirmpass} onChange={(e) => setconfirmpass(e.target.value)} required />

                <div id="signupbutton">
                    {!ispending && <button type="submit">Sign Up</button>}
                    {ispending && <button disabled>Signing up...</button>}
                </div>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Register;