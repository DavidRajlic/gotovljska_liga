import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import NavBarAdmin from "./components/NavbarAdmin";
import Login from "./pages/Login";
import Players from "./pages/Players";
import Rounds from "./pages/Rounds";
import Match from "./pages/Match";
import TopScorers from "./pages/TopScorers";
import "./App.css";
import { AuthProvider, AuthContext } from "../src/contexts/AuthContext";
import Teams from "./pages/Team";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="app">
      {isLoggedIn ? <NavBarAdmin /> : <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<Players />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/rounds/:id" element={<Match />} />
        <Route path="/scorers" element={<TopScorers />} />
      </Routes>
    </div>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
