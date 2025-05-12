import React, { useState, useEffect } from "react";
import axios from "axios";

function Matches() {
  // const { matchIds } = location.state;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const DOMAIN = process.env.REACT_APP_DOMAIN;
  const url = window.location.href;
  const parts = url.split("/");
  const matchday = parts[parts.length - 1];

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/matches/day/${matchday}`);

        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Prišlo je do napake pri pridobivanju podatkov o tekmah!",
          error
        );
      }
    };

    fetchMatchDetails();
  }, []);

  if (loading) {
    return <div>Nalaganje...</div>;
  }

  return (
    <div className="resultsContainer">
      <h1 className="resultsTitle">Rezultati!</h1>
      <ul>
        {matches.map((match) => (
          <div className="match" key={match._id}>
            <div>
              <h2>
                {match.team1} : {match.team2}{" "}
                <span style={{ color: "black" }}>
                  {" "}
                  {match.team1Goals} - {match.team2Goals}{" "}
                </span>{" "}
                {match._id === "681e2be083811dc90d24adc0" && (
                  <h6
                    style={{
                      padding: "none",
                      color: "red",
                    }}
                  >
                    {" "}
                    po dogovoru tekma 16.kroga odigrana v 17.krogu
                  </h6>
                )}{" "}
                {(match.team1Goals > 0 || match.team2Goals > 0) &&
                  match.team1Scorers.length === 0 &&
                  match.team2Scorers.length === 0 && (
                    <span style={{ color: "black" }}> B.B</span>
                  )}
              </h2>

              {match.matchPlayed && (
                <div className="matchScorers">
                  {(match.team1Goals > 0 || match.team2Goals > 0) &&
                  match.team1Scorers.length === 0 &&
                  match.team2Scorers.length === 0 ? (
                    <div
                      className="note"
                      style={{
                        color: "red",
                      }}
                    >
                      {" "}
                      Poražena ekipa se tekme ni udeležila, zato ji je bila
                      kazensko odvzeta točka!
                    </div>
                  ) : (
                    <div className="scorersColumn">
                      {" "}
                      <div className="team1Scorers">
                        {match.team1Scorers.map((scorer, index) => (
                          <div key={index}>
                            {scorer.player}{" "}
                            {scorer.goals > 1 && (
                              <span className="goal"> {scorer.goals}x </span>
                            )}
                            <small> ⚽</small>
                            <br></br>
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
                            {scorer.player}{" "}
                            <small className="red-card"> 🟥 </small>
                          </div>
                        ))}
                      </div>
                      <div className="team1Scorers">
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
                            {scorer.player}{" "}
                            <small className="red-card"> 🟥 </small>
                          </div>
                        ))}
                      </div>{" "}
                    </div>
                  )}{" "}
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
