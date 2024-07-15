import React, { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
  const [scorers, setScorers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/players");
        const sortedScorers = response.data.sort(
          (a, b) => b.goalsScored - a.goalsScored
        ); // Sort players by goals in descending order
        setScorers(sortedScorers);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekip!", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h1>Lestvica strelcev</h1>
      <ul>
        {scorers.slice(0, 10).map(
          (
            scorer,
            index // Limit to top 10 players
          ) => (
            <li key={scorer._id}>
              {index + 1}. {scorer.name} - {scorer.goalsScored} zadetkov
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default Teams;
