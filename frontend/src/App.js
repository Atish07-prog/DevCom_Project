import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './login';
import Register from "./register";
import Home from "./home";
import ForgotPassword from './Forgotpassword';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/loginpage' element={<Login />}/>
          <Route path='/forgotpassword' element={<ForgotPassword />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;