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
          <Link to="/" onClick={toggleMenu}>
            {" "}
            <li> Lestvica </li>
          </Link>

          <Link to="/rounds" onClick={toggleMenu}>
            {" "}
            <li> Razpored </li>
          </Link>

          <Link to="/scorers" onClick={toggleMenu}>
            {" "}
            <li> Strelci </li>
          </Link>

          <Link to="/mustPay" onClick={toggleMenu}>
            {" "}
            <li> Kartoni </li>
          </Link>
          <Link to="/teams" onClick={toggleMenu}>
            {" "}
            <li> Ekipe </li>
          </Link>
          {isLoggedIn ? (
            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
              Odjava
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={toggleMenu}>
                Prijava
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
