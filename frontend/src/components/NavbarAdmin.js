import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const { logout } = useContext(AuthContext);
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
          <li>
            <Link to="/">Lestvica</Link>
          </li>
          <li>
            <Link to="/teams">Ekipe</Link>
          </li>
          <li>
            <Link to="/rounds">Razpored</Link>
          </li>
          <li>
            <Link to="/scorers">Strelci</Link>
          </li>
          <li>
            <Link to="/mustPay">Neplačniki</Link>
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            Odjava
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
