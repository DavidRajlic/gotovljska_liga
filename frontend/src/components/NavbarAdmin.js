import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div className="logo">
        <h3> Gotovljska liga ⚽ </h3>
      </div>

      <div className="list">
        <ul>
          <span>
            <Link to="/">Home</Link>
          </span>

          <span>
            <Link to="/teams">Ekipe</Link>
          </span>

          <span>
            <Link to="/rounds">Razpored</Link>
          </span>

          <span>
            <Link to="/scorers"> Strelci </Link>
          </span>
          <span>
            <Link to="/login">Prijava</Link>
          </span>
          <span>
            <Link to="/login">Odjava</Link>
          </span>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
