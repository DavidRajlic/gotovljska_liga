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

        // Adjust ranks for players with the same number of goals
        let previousGoals = null;
        let rank = 1;
        const rankedScorers = sortedScorers.map((scorer, index) => {
          if (previousGoals !== null && scorer.goalsScored !== previousGoals) {
            rank++;
          }
          previousGoals = scorer.goalsScored;

          return { ...scorer, rank };
        });

        setScorers(rankedScorers);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekip!", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="topScorersContainer">
      <div>
        <h1>Lestvica strelcev - TOP 10</h1>
        <div>
          <table className="topScorersTable">
            <thead>
              <tr>
                <th>Mesto</th>
                <th>Igralec</th>
                <th>Število zadetkov</th>
              </tr>
            </thead>
            <tbody>
              {scorers.slice(0, 10).map(
                (scorer, index) =>
                  scorer.goalsScored > 0 && (
                    <tr key={scorer._id}>
                      <td>
                        <b> {scorer.rank}. </b>
                      </td>
                      <td>
                        <b>{scorer.name}</b>
                      </td>
                      <td>{scorer.goalsScored}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Teams;
