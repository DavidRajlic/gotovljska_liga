import React, { useState } from "react";

const CODE = process.env.REACT_APP_KODA;

function Login() {
  const [enteredCode, setEnteredCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (enteredCode === CODE) {
      alert("Administrator prijavljen!");
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
        <input type="text" name="username" value={enteredCode} onChange={handleChange} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
