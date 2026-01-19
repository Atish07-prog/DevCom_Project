import { Link } from "react-router-dom";
const Home = () => {
    return ( <><p>welcome to home page</p>
        <Link to="/loginpage">Login Page</Link>
        </>
    );
}

export default Home;
const handlesubmit = (e) => {
        e.preventDefault();
        setispending(true);
        const credentials = { email, password, usertype, id };
        if (!agreed) {
            setCheckError(true);
            setispending(false);
            return;
        }
        if (email === "" || password === "" || id === "") {
            alert("Invalid Credentials");
            setispending(false);
            return;

        }
        if (!(data.find((user) => user.email === email))) {
            if (password === confirmpass && email !== "" && password !== "" && id !== "") {

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
                setwrongpass(true);
                setispending(false);
                setconfirmpass('');
                setpassword('');
            }
        }
        else {
            setwrongmail(true);
            setconfirmpass('');
            setpassword('');
            setispending(false);
        }



    };