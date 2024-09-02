import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pagesAdmin/Login";
import Players from "./pagesAdmin/Players";
import Rounds from "./pagesAdmin/Rounds";
import Match from "./pagesAdmin/Match";
import MustPay from "./pagesAdmin/MustPay";
import Matches from "./pages/Matches";
import TopScorers from "./pagesAdmin/TopScorers";
import Leaderboard from "./pagesAdmin/Leaderboard";
import "./styles/App.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import Teams from "./pagesAdmin/Team";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Navbar />
      {/* {isLoggedIn ? <NavBarAdmin /> : <Navbar />} */}
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<Players />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/matches/day/:id" element={<Matches />} />
        <Route path="/mustPay" element={<MustPay />} />
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
