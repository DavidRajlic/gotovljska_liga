import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import EditMatch from "../components/editMatch";

function Match() {
  const location = useLocation();
  const team1Id = location.state.team1Id;
  const team2Id = location.state.team2Id;
  const matchId = location.state.matchId;
  const [match, setMatch] = useState(null);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [didNotPlay, setDidNotPlay] = useState(false);
  const [yellowCards, setYellowCards] = useState({ team1: [], team2: [] });
  const [redCards, setRedCards] = useState({ team1: [], team2: [] });
  const [team1Goals, setTeam1Goals] = useState("");
  const [team2Goals, setTeam2Goals] = useState("");
  const [goals, setGoals] = useState({ team1: {}, team2: {} });
  const [goalScorers, setGoalScorers] = useState({ team1: {}, team2: {} });
  const [yellowCardPlayers, setYellowCardPlayers] = useState({
    team1: {},
    team2: {},
  });
  const [redCardPlayers, setRedCardPlayers] = useState({
    team1: {},
    team2: {},
  });
  const DOMAIN = process.env.REACT_APP_DOMAIN;

  // Stanje za število rumenih in rdečih kartonov na ekipo
  const [team1YellowCardCount, setTeam1YellowCardCount] = useState(0);
  const [team2YellowCardCount, setTeam2YellowCardCount] = useState(0);
  const [team1RedCardCount, setTeam1RedCardCount] = useState(0);
  const [team2RedCardCount, setTeam2RedCardCount] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [team1Response, team2Response, matchResponse] = await Promise.all(
          [
            axios.get(`${DOMAIN}/${team1Id}`),
            axios.get(`${DOMAIN}/teams/${team2Id}`),
            axios.get(`${DOMAIN}/matches/${matchId}`),
          ]
        );
        setMatch(matchResponse.data);
        setTeam1(team1Response.data);
        setTeam2(team2Response.data);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekipe!", error);
      }
    };

    fetchTeam();
  }, [team1Id, team2Id]);

  const handleYellowCardClick = (team, index) => {
    const player =
      team === "team1" ? team1.players[index] : team2.players[index];
    setYellowCards((prevYellowCards) => ({
      ...prevYellowCards,
      [team]: [...prevYellowCards[team], index],
    }));

    setYellowCardPlayers((prevYellowCardPlayers) => ({
      ...prevYellowCardPlayers,
      [team]: {
        ...prevYellowCardPlayers[team],
        [player._id]: (prevYellowCardPlayers[team][player._id] || 0) + 1,
      },
    }));
    if (team === "team1") {
      setTeam1YellowCardCount((prevCount) => prevCount + 1);
    } else {
      setTeam2YellowCardCount((prevCount) => prevCount + 1);
    }
  };

  const handleRedCardClick = (team, index) => {
    const player =
      team === "team1" ? team1.players[index] : team2.players[index];
    setRedCards((prevRedCards) => ({
      ...prevRedCards,
      [team]: [...prevRedCards[team], index],
    }));
    setRedCardPlayers((prevRedCardPlayers) => ({
      ...prevRedCardPlayers,
      [team]: {
        ...prevRedCardPlayers[team],
        [player._id]: (prevRedCardPlayers[team][player._id] || 0) + 1,
      },
    }));
    if (team === "team1") {
      setTeam1RedCardCount((prevCount) => prevCount + 1);
    } else {
      setTeam2RedCardCount((prevCount) => prevCount + 1);
    }
  };

  const handleGoalClick = (team, index) => {
    const player =
      team === "team1" ? team1.players[index] : team2.players[index];
    setGoals((prevGoals) => ({
      ...prevGoals,
      [team]: {
        ...prevGoals[team],
        [index]: (prevGoals[team][index] || 0) + 1,
      },
    }));
    setGoalScorers((prevGoalScorers) => ({
      ...prevGoalScorers,
      [team]: {
        ...prevGoalScorers[team],
        [player._id]: (prevGoalScorers[team][player._id] || 0) + 1,
      },
    }));
  };

  const confirmResult = async () => {
    let winner;
    if (team1Goals > team2Goals) {
      winner = team1;
    } else if (team2Goals > team1Goals) {
      winner = team2;
    } else {
      winner = null;
    }

    try {
      if (match.matchPlayed) {
        console.log(team2.points);
        for (const scorer of match.team1Scorers) {
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            goalsScored: scorer.goals,
          });
        }
        for (const scorer of match.team2Scorers) {
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            goalsScored: scorer.goals,
          });
        }

        for (const scorer of match.team1YellowCards) {
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            yellowCards: scorer.yellowCards,
            mustPayYellowCard: false,
          });
        }

        for (const scorer of match.team2YellowCards) {
          console.log(scorer);
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            yellowCards: scorer.yellowCards,
            mustPayYellowCard: false,
          });
        }

        for (const scorer of match.team1RedCards) {
          console.log("NAJS");
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            redCards: scorer.redCards,
            mustPayRedCard: false,
          });
        }

        for (const scorer of match.team2RedCards) {
          await axios.put(`${DOMAIN}/players/again/${scorer.id}`, {
            redCards: scorer.redCards,
            mustPayRedCard: false,
          });
        }

        await axios.put(`${DOMAIN}/teams/again/${team1Id}`, {
          goalsScored: match.team1Goals,
          goalsConceded: match.team2Goals,
          yellowCards: match.team1YellowCards.length,
          redCards: match.team1RedCards.length,
          matchesPlayed: 1,
        });

        await axios.put(`${DOMAIN}/teams/again/${team2Id}`, {
          goalsScored: match.team2Goals,
          goalsConceded: match.team1Goals,
          yellowCards: match.team2YellowCards.length,
          redCards: match.team2RedCards.length,
          matchesPlayed: 1,
        });

        if (match.winner === team1Id) {
          console.log("here");
          await axios.put(`${DOMAIN}/teams/again/${team1Id}`, {
            wins: 1,
            points: 3,
          });

          await axios.put(`${DOMAIN}/teams/again/${team2Id}`, {
            losses: 1,
          });
          if (match.team1Scorers.length === 0 && match.team1Goals === 3) {
            console.log("here");
            await axios.put(`${DOMAIN}/teams/${team2Id}`, {
              points: 1,
            });
          }
        } else if (match.winner === team2Id) {
          console.log("here");
          await axios.put(`${DOMAIN}/teams/again/${team2Id}`, {
            wins: 1,
            points: 3,
          });
          await axios.put(`${DOMAIN}/teams/again/${team1Id}`, {
            losses: 1,
          });

          if (match.team2Scorers.length === 0 && match.team2Goals === 3) {
            await axios.put(`${DOMAIN}/teams/${team1Id}`, {
              points: 1,
            });
          }
        } else {
          console.log("here");
          await axios.put(`${DOMAIN}/teams/again/${team2Id}`, {
            draws: 1,
            points: 1,
          });
          await axios.put(`${DOMAIN}/teams/again/${team1Id}`, {
            draws: 1,
            points: 1,
          });
        }
      }

      console.log(team2.points);

      // Convert indexes into player names
      const team1Scorers = Object.keys(goals.team1).map((index) => ({
        id: team1.players[index]._id,
        player: team1.players[index].name,
        goals: goals.team1[index],
      }));
      const team2Scorers = Object.keys(goals.team2).map((index) => ({
        id: team2.players[index]._id,
        player: team2.players[index].name,
        goals: goals.team2[index],
      }));

      // Transform yellow card data into the desired format
      const team1YellowCards = Object.keys(yellowCardPlayers.team1).map(
        (playerId) => ({
          id: playerId,
          player: team1.players.find((player) => player._id === playerId).name,
          yellowCards: yellowCardPlayers.team1[playerId],
        })
      );
      const team2YellowCards = Object.keys(yellowCardPlayers.team2).map(
        (playerId) => ({
          id: playerId,
          player: team2.players.find((player) => player._id === playerId).name,
          yellowCards: yellowCardPlayers.team2[playerId],
        })
      );

      const team1RedCards = Object.keys(redCardPlayers.team1).map(
        (playerId) => ({
          id: playerId,
          player: team1.players.find((player) => player._id === playerId).name,
          redCards: redCardPlayers.team1[playerId],
        })
      );
      const team2RedCards = Object.keys(redCardPlayers.team2).map(
        (playerId) => ({
          id: playerId,
          player: team2.players.find((player) => player._id === playerId).name,
          redCards: redCardPlayers.team2[playerId],
        })
      );

      // Posodobi število golov in kartonov za vsakega igralca v ekipi 1
      for (const player of team1.players) {
        const playerId = player._id;
        const playerGoals = goalScorers.team1[playerId] || 0;
        const playerYellowCards = yellowCardPlayers.team1[playerId] || 0;
        const playerRedCards = redCardPlayers.team1[playerId] || 0;

        const updateData = {
          goalsScored: playerGoals,
          yellowCards: playerYellowCards,
          redCards: playerRedCards,
          mustPayYellowCard: playerYellowCards > 0,
          mustPayRedCard: playerRedCards > 0,
        };

        if (playerGoals > 0 || playerYellowCards > 0 || playerRedCards > 0) {
          await axios.put(
            `http://localhost:4000/players/${playerId}`,
            updateData
          );
        }
      }

      // Posodobi število golov in kartonov za vsakega igralca v ekipi 2
      for (const player of team2.players) {
        const playerId = player._id;
        const playerGoals = goalScorers.team2[playerId] || 0;
        const playerYellowCards = yellowCardPlayers.team2[playerId] || 0;
        const playerRedCards = redCardPlayers.team2[playerId] || 0;

        const updateData = {
          goalsScored: playerGoals,
          yellowCards: playerYellowCards,
          redCards: playerRedCards,
          mustPayYellowCard: playerYellowCards > 0,
          mustPayRedCard: playerRedCards > 0,
        };

        if (playerGoals > 0 || playerYellowCards > 0 || playerRedCards > 0) {
          await axios.put(
            `http://localhost:4000/players/${playerId}`,
            updateData
          );
        }
      }

      let team1Points = 0;
      let team1Wins = 0;
      let team2Wins = 0;
      let team1Draws = 0;
      let team2Draws = 0;
      let team1Losses = 0;
      let team2Losses = 0;
      let team2Points = 0;

      if (winner === team1 && !didNotPlay) {
        team1Wins = 1;
        team1Points = 3;
        team2Points = 0;
        team2Losses = 1;
      } else if (winner === team1 && didNotPlay) {
        team1Wins = 1;
        team1Points = 3;
        team2Points = -1;
        team2Losses = 1;
      } else if (winner === team2 && didNotPlay) {
        team2Wins = 1;
        team1Points = -1;
        team2Points = 3;
        team1Losses = 1;
      } else if (winner === team2 && !didNotPlay) {
        team1Points = 0;
        team2Points = 3;
        team2Wins = 1;
        team1Losses = 1;
      } else if (winner === null) {
        team1Points = 1;
        team2Points = 1;
        team1Draws = 1;
        team2Draws = 1;
      }

      await axios.put(`http://localhost:4000/teams/${team1Id}`, {
        points: team1Points,
        goalsScored: team1Goals,
        goalsConceded: team2Goals,
        matchesPlayed: 1,
        yellowCards: team1YellowCardCount,
        redCards: team1RedCardCount,
        wins: team1Wins,
        draws: team1Draws,
        losses: team1Losses,
      });

      await axios.put(`http://localhost:4000/teams/${team2Id}`, {
        points: team2Points,
        goalsScored: team2Goals,
        goalsConceded: team1Goals,
        matchesPlayed: 1,
        yellowCards: team2YellowCardCount,
        redCards: team2RedCardCount,
        wins: team2Wins,
        draws: team2Draws,
        losses: team2Losses,
      });

      // Pošlji podatke na strežnik
      await axios.put(`http://localhost:4000/matches/${matchId}`, {
        team1Goals: team1Goals,
        team2Goals: team2Goals,
        team1Scorers: team1Scorers,
        team2Scorers: team2Scorers,
        team1YellowCards: team1YellowCards,
        team2YellowCards: team2YellowCards,
        team1RedCards: team1RedCards,
        team2RedCards: team2RedCards,
        matchPlayed: true,
        winner: winner,
      });

      console.log("Rezultat in strelci so uspešno posodobljeni.");
    } catch (error) {
      console.error(
        "Prišlo je do napake pri posodabljanju rezultata in strelcev.",
        error
      );
    }
  };

  const handleTeamClick = (team) => {
    if (team === team1) {
      setTeam1Goals(0);
      setTeam2Goals(3);
    } else {
      setTeam1Goals(3);
      setTeam2Goals(0);
    }
    setDidNotPlay(true);
  };

  // Preveri, če podatki niso še naloženi
  if (!team1 || !team2) {
    return <div>Nalaganje...</div>;
  }

  const handleChangeTeam1 = (event) => {
    setTeam1Goals(event.target.value);
  };

  const handleChangeTeam2 = (event) => {
    setTeam2Goals(event.target.value);
  };

  return (
    <div className="matchContainer">
      <div className="matchHeader">
        <b>
          {" "}
          <h2>
            {" "}
            {team1.name} : {team2.name}{" "}
          </h2>
        </b>
        <input
          onChange={handleChangeTeam1}
          value={team1Goals}
          type="number"
          min="0"
          max="100"
        />{" "}
        : {""}
        <input
          onChange={handleChangeTeam2}
          value={team2Goals}
          type="number"
          min="0"
          max="100"
        />
        <button
          className={
            team1Goals === "" || team2Goals === ""
              ? "disabledBtn"
              : "confirmResult"
          }
          onClick={confirmResult}
          disabled={team1Goals === "" || team2Goals === ""}
        >
          Potrdi Rezultat
        </button>
      </div>
      <ul>
        <div className="teamNotAttend">
          {" "}
          <label> Ali se katera od ekip ni prikazala na tekmi? </label>{" "}
          <button
            key={team1Id}
            type="button"
            onClick={() => handleTeamClick(team1)}
          >
            {team1.name}
          </button>
          <button
            key={team2Id}
            type="button"
            onClick={() => handleTeamClick(team2)}
          >
            {team2.name}
          </button>{" "}
        </div>
      </ul>
      {match.matchPlayed && (
        <div className="match" key={match._id}>
          <div>
            <h2>
              {match.team1} : {match.team2}{" "}
              <span style={{ color: "black" }}>
                {" "}
                {match.team1Goals} - {match.team2Goals}{" "}
              </span>{" "}
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
      )}
      <h2 style={{ textAlign: "center" }}> Spremenjeni podatki tekme</h2>

      <div className="editMatch">
        <div style={{ width: "90%" }}>
          <EditMatch
            match={match.team1}
            goals={goals}
            yellowCards={yellowCards}
            redCards={redCards}
            team={team1}
            teamName="team1"
            handleGoalClick={handleGoalClick}
            handleYellowCardClick={handleYellowCardClick}
            handleRedCardClick={handleRedCardClick}
          />
        </div>

        <div style={{ width: "90%" }}>
          <EditMatch
            match={match.team2}
            goals={goals}
            yellowCards={yellowCards}
            redCards={redCards}
            team={team2}
            teamName="team2"
            handleGoalClick={handleGoalClick}
            handleYellowCardClick={handleYellowCardClick}
            handleRedCardClick={handleRedCardClick}
          />
        </div>
      </div>

      <br />
    </div>
  );
}

export default Match;
