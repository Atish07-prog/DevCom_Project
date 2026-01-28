import { BrowserRouter, Routes, Route } from "react-router-dom";
import Restaurant from "./pages/home";
import Login from "./pages/login";
import Confirmation from "./pages/confirmation";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Restaurant />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
