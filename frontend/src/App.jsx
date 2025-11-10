import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />       {/* Landing page */}
        <Route path="/Login" element={<Login />} />  {/* Login page */}
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/User" element={<UserDashboard />} />
        <Route path="/Owner" element={<StoreOwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
