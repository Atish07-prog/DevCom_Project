import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './login';
import Register from "./register";
import Home from "./home";
import ForgotPassword from './Forgotpassword';
import Confirmation from "./confirmation";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />}/>
          {/* 2. Ensure this path matches what you used in Login.js navigate() */}
          <Route path='/loginpage' element={<Login />}/>
          <Route path='/forgotpassword' element={<ForgotPassword />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/confirmation' element={<Confirmation />}/>

          {/* 3. NEW ADMIN ROUTE */}
          <Route path='/admin-dashboard' element={<AdminDashboard />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

