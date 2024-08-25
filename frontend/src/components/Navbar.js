import React from "react";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const { logout } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    alert("Administrator odjavljen!");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <nav>
      <div className="logo">
        <span>
          {" "}
          <Link to="/">
            {" "}
            <b> </b>
          </Link>{" "}
        </span>
      </div>
      <div className="burger-menu" onClick={toggleMenu}>
        &#9776;
      </div>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <ul>
          <Link to="/">
            {" "}
            <li> Lestvica </li>
          </Link>

          <Link to="/teams">
            {" "}
            <li> Ekipe </li>
          </Link>

          <Link to="/rounds">
            {" "}
            <li> Razpored </li>
          </Link>

          <Link to="/scorers">
            {" "}
            <li> Strelci </li>
          </Link>

          <Link to="/mustPay">
            {" "}
            <li> Kartoni </li>
          </Link>
          {isLoggedIn ? (
            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
              Odjava
            </li>
          ) : (
            <li>
              <Link to="/login">Prijava</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
