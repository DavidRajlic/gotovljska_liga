import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CODE = process.env.REACT_APP_KODA;

function Login() {
  const [enteredCode, setEnteredCode] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (enteredCode === CODE) {
      toast.success("Uspešno ste se prijavili!");
      Cookies.set("adminLoggedIn", "true", { expires: 7 }); // expires in 7 days
      login();
      navigate("/");
    } else {
      toast.error("Neveljavna koda za prijavo!");
    }
  };

  const handleChange = (event) => {
    setEnteredCode(event.target.value);
  };

  return (
    <div className="loginContainer">
      <ToastContainer position="top-right" />
      <div className="loginBox">
        <h1 className="login-title">Prijava</h1>
        <p className="description">Prijavi se lahko le administrator!</p>
        <form onSubmit={handleSubmit} className="form">
          <label className="label">KODA:</label>
          <input
            type="password"
            value={enteredCode}
            onChange={handleChange}
            className="loginInput"
          />
          <button type="submit" className="button">
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
