import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import API from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    setIsLoggedIn(!!token);
    setName(storedName || "");
  }, [location.pathname]);

const handleLogout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.error("Logout error", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  setIsLoggedIn(false);
  setName("");
  alert("Logout successful!");
  navigate("/");
};

  return (
    <nav className="navbar">
      <div className="navbar-shell">
        <div className="navbar-left">
          <NavLink to="/" className="brand">
            <span className="brand-mark">E</span>
            <div className="brand-text">
              <span className="brand-name">EcoTrack</span>
              <span className="brand-badge">Carbon Tracker</span>
            </div>
          </NavLink>
        </div>

        <div className="navbar-center">
          <p className="navbar-tagline">
           <b> Measure your footprint. Build cleaner habits every day.</b>
          </p>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <div className="user-chip">
                <span className="user-dot"></span>
                <span className="user-name">Hi, {name || "User"}</span>
              </div>

              <button className="nav-link nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link nav-login">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link nav-cta">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
