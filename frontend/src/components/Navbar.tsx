import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

const Navbar: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">
          Discussify
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item mx-1">
                  <NavLink
                    className="btn btn-outline-primary px-3"
                    to="/login"
                    onClick={() => setIsCollapsed(true)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    className="btn btn-primary px-3"
                    to="/signup"
                    onClick={() => setIsCollapsed(true)}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/explore"
                    className="navbar-brand fw-bold fs-4 text-primary"
                  >
                    Explore
                  </Link>
                </li>
                <Link
                  to="/communities"
                  className="navbar-brand fw-bold fs-4 text-primary"
                >
                  Community
                </Link>
                <li className="nav-item mx-2">
                  <Link
                    to="/profile"
                    className="fw-semibold text-secondary d-inline-block text-truncate text-decoration-none"
                    style={{ maxWidth: "150px" }}
                  >
                    👤 {user.email.split("@")[0]}
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <button className="btn btn-danger px-3" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
