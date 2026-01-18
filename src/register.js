import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./fetchdata";
const Register = () => {
    const { data, ispendingdata, error } = useFetch('http://localhost:8000/users');
    const [oldmail,setoldmail]=useState(false);
    const [checkpass,setcheckpass]=useState(true);
    const [emptyinputfield,setemptyinputfield]=useState(false);
    const [ischecked,setischecked]=useState(false);
    const [signuperror,setsignuperror]=useState(false);


    const usertype = "user";
    const [password, setpassword] = useState('');
    const [id, setid] = useState('');
    const [confirmpass, setconfirmpass] = useState('');
    const [email, setemail] = useState('');
    const [ispending, setispending] = useState(false);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        setispending(true);
        const credentials = { email, password, usertype, id };
        if(!ischecked){
            setsignuperror(true);
            setispending(false);
            return;
        }
        if( email === "" ||password === ""|| id===""){
            setemptyinputfield(true);
             setispending(false);
            return;
        }
        if (!(data.find((user) => user.email === email))) {
            if (password === confirmpass && email !== "" && password !== ""&& id!=="") {

                fetch('http://localhost:8000/users', {
                    method: 'POST',
                    headers: { "Content-Type": "application.json" },
                    body: JSON.stringify(credentials)
                })
                    .then(() => {
                        setispending(false);

                        navigate('/');
                    })
            }
            else {
                setcheckpass(false);
                setispending(false);
                setconfirmpass('');
                setpassword('');
            }
        }
        else {
            setoldmail(true);
            setconfirmpass('');
            setpassword('');
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
                    <h2>Join Us</h2>
                    <h3>Sign Up and start booking your table</h3>
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
                    <h1>SIGN UP</h1>

                    <form onSubmit={handlesubmit}>


                        <div className="inputfields">
                            <label>Name</label>
                            <input type="text" placeholder="  Enter your name" value={id} onChange={(e) => { setid(e.target.value);setemptyinputfield(false); }} />
                            <label>Email</label>
                            <input type="email" placeholder="  Enter your email" value={email} onChange={(e) => { setemail(e.target.value); setoldmail(false);setemptyinputfield(false); }}className={oldmail?"error":""} />
                            {oldmail&&<p>Email already in use</p>}
                            <label>Password</label>
                            <input type="password" placeholder="  Create your password" value={password} onChange={(e) => { setpassword(e.target.value);setemptyinputfield(false); }} />
                            <label>Confirm Password</label>
                            <input type="password" placeholder="  Confirm your password" value={confirmpass} onChange={(e) => { setconfirmpass(e.target.value); setcheckpass(true); setemptyinputfield(false);}}className={checkpass?"":"error"} />
                            {!checkpass&&<p>Password does not match</p>}
                        </div>
                        <div className="termandondition">
                            <input type="checkbox" checked={ischecked} onChange={(e)=>{setischecked(e.target.checked);setsignuperror(false);}}/>
                            <div>
                                <span> I agree to the </span>
                                <span id="tandc">Terms & Conditions</span>
                            </div>
                            

                        </div>
                        <div id="tandcerror">
                                {signuperror&&<p>Accept Terms & Conditions</p>}
                            </div>
                        
                        <div id="signupbutton">
                            {!ispending && <button>Sign Up</button>}
                            {ispending && <button disabled>Registering...</button>}
                        </div>

                    </form>
                    {ispendingdata && <p className="serverrespond">SERVER IS LOADING PLEASE WAIT...</p>}
                    {error && <p className="serverrespond">SORRY SERVER NOT RESPONDING...</p>}
                    {emptyinputfield&&<p id="emptyfield">Inputfields cannot be empty</p>}
                    <div className="signupandlogin">
                        Already have an account?
                        <Link to="/loginpage" className="signuploginlink">Login</Link>
                    </div>

                </div>


            </div>
        </div>
    );
}

export default Register;