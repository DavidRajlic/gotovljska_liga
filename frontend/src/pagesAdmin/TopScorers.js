import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";

function Teams() {
  const [scorers, setScorers] = useState([]);
  const DOMAIN = process.env.REACT_APP_DOMAIN;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/players`);
        const sortedScorers = response.data.sort(
          (a, b) => b.goalsScored - a.goalsScored
        );

        // Adjust ranks for players with the same number of goals
        let rank = 1;
        let previousGoals = null;
        let previousRank = 1;

        const rankedScorers = sortedScorers.map((scorer, index) => {
          if (scorer.goalsScored !== previousGoals) {
            rank = index + 1; // Update the rank only when goals differ
            previousRank = rank;
          } else {
            rank = previousRank; // Same rank for players with the same goals
          }
          previousGoals = scorer.goalsScored;

          return { ...scorer, rank };
        });

        setScorers(rankedScorers);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju igralcev!", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="topScorersContainer">
      <div>
        <h1>Lestvica strelcev</h1>
        <div>
          {scorers.every((scorer) => scorer.goalsScored === 0) ? (
            <p style={{ textAlign: "center", marginTop: "100px" }}>
              <b> Trenutno še ni strelcev</b>
            </p>
          ) : (
            <table className="topScorersTable">
              <thead>
                <tr>
                  <th>Mesto</th>
                  <th>Igralec</th>
                  <th>Število zadetkov</th>
                </tr>
              </thead>
              <tbody>
                {scorers.map(
                  (scorer) =>
                    scorer.goalsScored > 0 && (
                      <tr key={scorer._id}>
                        <td>
                          <b>{scorer.rank}.</b>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams;
