import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Matches() {
  const location = useLocation();
  const { matchIds } = location.state;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const matchDetails = await Promise.all(
          matchIds.map(async (id) => {
            const response = await axios.get(
              `http://localhost:4000/matches/${id}`
            );
            return response.data;
          })
        );
        setMatches(matchDetails);
        setLoading(false);
      } catch (error) {
        console.error(
          "Prišlo je do napake pri pridobivanju podatkov o tekmah!",
          error
        );
      }
    };

    fetchMatchDetails();
  }, [matchIds]);

  if (loading) {
    return <div>Nalaganje...</div>;
  }

  return (
    <div className="resultsContainer">
      <h1 className="resultsTitle">
        Rezultati {matches[0].matchday}. kola {matches[0].date}
      </h1>
      <ul>
        {matches.map((match) => (
          <div className="match" key={match._id}>
            <div>
              <h2>
                {match.team1} : {match.team2} {match.team1Goals} :{" "}
                {match.team2Goals}{" "}
                {(match.team1Goals > 0 || match.team2Goals > 0) &&
                  match.team1Scorers.length === 0 &&
                  match.team2Scorers.length === 0 && <span> B.B</span>}
              </h2>

              {match.matchPlayed && (
                <div className="matchScorers">
                  {(match.team1Goals > 0 || match.team2Goals > 0) &&
                    match.team1Scorers.length === 0 &&
                    match.team2Scorers.length === 0 && (
                      <div style={{ color: "red" }}>
                        {" "}
                        Poražena ekipa se tekme ni udeležeila, zato ji je bila
                        kazensko odvzeta točka!
                      </div>
                    )}
                  <div className="scorersColumn">
                    {match.team1Scorers.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        {scorer.goals > 1 && (
                          <span className="goal"> {scorer.goals}x </span>
                        )}
                        <small> ⚽</small>
                      </div>
                    ))}
                    {match.team1YellowCards.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        <small className="yellow-card"> 🟨 </small>
                      </div>
                    ))}
                    {match.team1RedCards.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player} <small className="red-card"> 🟥 </small>
                      </div>
                    ))}
                  </div>
                  <div className="scorersColumn">
                    {match.team2Scorers.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        {scorer.goals > 1 && (
                          <span className="goal"> {scorer.goals}x </span>
                        )}
                        <small> ⚽</small>
                      </div>
                    ))}
                    {match.team2YellowCards.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        <small className="yellow-card"> 🟨 </small>
                      </div>
                    ))}
                    {match.team2RedCards.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player} <small className="red-card"> 🟥 </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Matches;
