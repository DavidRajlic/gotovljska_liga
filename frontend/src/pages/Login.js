import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const CODE = process.env.REACT_APP_KODA;

function Login() {
  const [enteredCode, setEnteredCode] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (enteredCode === CODE) {
      alert("Administrator prijavljen!");
      login(); // Nastavi stanje prijave na true
      // Tukaj lahko dodate nadaljnjo logiko po uspešni prijavi
    } else {
      alert("Neveljavna koda za prijavo administratorja!");
    }
  };

  const handleChange = (event) => {
    setEnteredCode(event.target.value);
  };

  return (
    <div>
      <h1>Prijava</h1>
      <p>Prijavi se lahko le administrator!</p>
      <form onSubmit={handleSubmit}>
        <label>KODA:</label>
        <input type="text" value={enteredCode} onChange={handleChange} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
