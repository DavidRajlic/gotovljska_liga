import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div className="logo">
        <span>
          {" "}
          <Link to="/">
            {" "}
            <b> Gotovljska liga ⚽ </b>
          </Link>{" "}
        </span>
      </div>

      <div className="list">
        <ul>
          <span>
            <Link to="/">Lestvica</Link>
          </span>
          <span>
            <Link to="/teams">Ekipe</Link>
          </span>
          <span>
            <Link to="/matchdays">Razpored</Link>
          </span>
          <span>
            <Link to="/scorers"> Strelci </Link>
          </span>
          <span>
            <Link to="/login">Prijava</Link>
          </span>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
