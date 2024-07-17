import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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
  const [team1Yellow, setTeam1Yellow] = useState("");
  const [team2Yellow, setTeam2Yellow] = useState("");
  const [team1Red, setTeam1Red] = useState("");
  const [team2Red, setTeam2Red] = useState("");
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
            axios.get(`http://localhost:4000/teams/${team1Id}`),
            axios.get(`http://localhost:4000/teams/${team2Id}`),
            axios.get(`http://localhost:4000/matches/${matchId}`),
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

    if (match.matchPlayed) {
      for (const scorer of match.team1Scorers) {
        console.log("tukaj");
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          goalsScored: scorer.goals,
        });
      }
      for (const scorer of match.team2Scorers) {
        console.log("tukaj1");
        console.log(scorer.goals);
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          goalsScored: scorer.goals,
        });
      }

      for (const scorer of match.team1YellowCards) {
        console.log("tukaj1");
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          yellowCards: scorer.yellowCards,
        });
      }

      for (const scorer of match.team2YellowCards) {
        console.log("tukaj1");
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          yellowCards: scorer.yellowCards,
        });
      }

      for (const scorer of match.team1RedCards) {
        console.log("tukaj1");
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          redCards: scorer.redCards,
        });
      }

      for (const scorer of match.team2RedCards) {
        console.log("tukaj1");
        await axios.put(`http://localhost:4000/players/again/${scorer.id}`, {
          redCards: scorer.redCards,
        });
      }
      console.log("tukaj2");
      await axios.put(`http://localhost:4000/teams/again/${team1Id}`, {
        goalsScored: -Math.abs(match.team1Goals),
        goalsConceded: -Math.abs(match.team2Goals),
        yellowCards: -Math.abs(match.team1YellowCards.length),
        redCards: -Math.abs(match.team1RedCards.length),
        matchesPlayed: -1,
      });

      console.log("tukaj");
      await axios.put(`http://localhost:4000/teams/again/${team2Id}`, {
        goalsScored: -Math.abs(match.team2Goals),
        goalsConceded: -Math.abs(match.team1Goals),
        yellowCards: -Math.abs(match.team2YellowCards.length),
        redCards: -Math.abs(match.team2RedCards.length),
        matchesPlayed: -1,
      });
      console.log(match.winner, team1Id);
      if (match.winner === team1Id) {
        console.log("tukajWin in točke");
        await axios.put(`http://localhost:4000/teams/again/${team1Id}`, {
          wins: -1,
          points: -3,
        });

        await axios.put(`http://localhost:4000/teams/again/${team2Id}`, {
          losses: -1,
        });
        if (match.team1Scorers.length === 0 && match.team1Goals === 3) {
          await axios.put(`http://localhost:4000/teams/again/${team2Id}`, {
            points: 1,
          });
        }
      } else if (match.winner === team2Id) {
        console.log("tukaj");
        await axios.put(`http://localhost:4000/teams/again/${team2Id}`, {
          wins: -1,
          points: -3,
        });
        await axios.put(`http://localhost:4000/teams/again/${team1Id}`, {
          losses: -1,
        });

        if (match.team2Scorers.length === 0 && match.team2Goals === 3) {
          await axios.put(`http://localhost:4000/teams/again/${team1Id}`, {
            points: 1,
          });
        }
      } else {
        console.log("tukaj");
        await axios.put(`http://localhost:4000/teams/again/${team2Id}`, {
          draws: -1,
          points: -1,
        });
        await axios.put(`http://localhost:4000/teams/again/${team1Id}`, {
          draws: -1,
          points: -1,
        });
      }
    }

    try {
      // Pretvori indekse v imena igralcev
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

        if (playerGoals > 0 || playerYellowCards > 0 || playerRedCards > 0) {
          await axios.put(`http://localhost:4000/players/${playerId}`, {
            goalsScored: playerGoals,
            yellowCards: playerYellowCards,
            redCards: playerRedCards,
          });
        }
      }

      // Posodobi število golov in kartonov za vsakega igralca v ekipi 2
      for (const player of team2.players) {
        const playerId = player._id;
        const playerGoals = goalScorers.team2[playerId] || 0;
        const playerYellowCards = yellowCardPlayers.team2[playerId] || 0;
        const playerRedCards = redCardPlayers.team2[playerId] || 0;

        if (playerGoals > 0 || playerYellowCards > 0 || playerRedCards > 0) {
          await axios.put(`http://localhost:4000/players/${playerId}`, {
            goalsScored: playerGoals,
            yellowCards: playerYellowCards,
            redCards: playerRedCards,
          });
        }
      }

      let team1Points;
      let team1Wins = 0;
      let team2Wins = 0;
      let team1Draws = 0;
      let team2Draws = 0;
      let team1Losses = 0;
      let team2Losses = 0;
      let team2Points;

      if (winner === team1 && !didNotPlay) {
        console.log("here");
        team1Wins = 1;
        team1Points = 3;
        team2Points = 0;
        team2Losses = 1;
      } else if (winner === team1 && didNotPlay) {
        console.log("here1");
        team1Wins = 1;
        team1Points = 3;
        team2Points = -1;
        team2Losses = 1;
      } else if (winner === team2 && didNotPlay) {
        console.log("here2");
        team2Wins = 1;
        team1Points = -1;
        team2Points = 3;
        team1Losses = 1;
      } else if (winner === team2 && !didNotPlay) {
        console.log("here3");
        team1Points = 0;
        team2Points = 3;
        team2Wins = 1;
        team1Losses = 1;
      } else if (winner === null) {
        console.log("here4");
        team1Points = 1;
        team2Points = 1;
        team1Draws = 1;
        team2Draws = 1;
      }

      await axios.put(`http://localhost:4000/teams/${team1Id}`, {
        points: team1Points,
        goalsScored: Number(team1Goals),
        goalsConceded: Number(team2Goals),
        matchesPlayed: 1,
        yellowCards: team1YellowCardCount,
        redCards: team1RedCardCount,
        wins: team1Wins,
        draws: team1Draws,
        losses: team1Losses,
      });

      await axios.put(`http://localhost:4000/teams/${team2Id}`, {
        points: team2Points,
        goalsScored: Number(team2Goals),
        goalsConceded: Number(team1Goals),
        matchesPlayed: 1,
        yellowCards: team2YellowCardCount,
        redCards: team2RedCardCount,
        wins: team2Wins,
        draws: team2Draws,
        losses: team2Losses,
      });

      console.log(team1Goals, team2Goals);

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
    <div>
      <div>
        {team1.name} : {team2.name}
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
          onClick={confirmResult}
          disabled={team1Goals === "" || team2Goals === ""}
        >
          Potrdi rezultat
        </button>
      </div>
      <ul>
        <label> Ali se katera od ekip ni prikazala na tekmi? </label>
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
        </button>
      </ul>
      <div>
        <h2> Podatki za {match.team1}</h2>

        <div>
          <b> ⚽:</b>
          {Object.keys(goals.team1).map((index) => (
            <span style={{ padding: "10px" }} key={index}>
              {team1.players[index].name} {goals.team1[index]}x.
            </span>
          ))}
        </div>

        <div>
          <b>🟨:</b>
          {yellowCards.team1.map((index, idx) => (
            <span style={{ padding: "10px" }} key={index}>
              {team1.players[index].name}
            </span>
          ))}
        </div>
        <div>
          <b>🟥:</b>
          {redCards.team1.map((index, idx) => (
            <span style={{ padding: "10px" }} key={index}>
              {team1.players[index].name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h2> Podatki za {match.team2}</h2>

        <div>
          <b> ⚽:</b>
          {Object.keys(goals.team2).map((index) => (
            <span style={{ padding: "10px" }} key={index}>
              {team2.players[index].name} {goals.team2[index]}x.
            </span>
          ))}
        </div>

        <div>
          <b>🟨:</b>
          {yellowCards.team2.map((index, idx) => (
            <span style={{ padding: "10px" }} key={index}>
              {team2.players[index].name}
            </span>
          ))}
        </div>
        <div>
          <b>🟥:</b>
          {redCards.team2.map((index, idx) => (
            <span style={{ padding: "10px" }} key={index}>
              {team2.players[index].name}
            </span>
          ))}
        </div>
      </div>

      {match.matchPlayed && (
        <div>
          <span style={{ fontWeight: "700", padding: "10px" }}>
            {" "}
            {match.team1Goals} : {match.team2Goals}{" "}
          </span>
          <h4> Strelci za {match.team1}</h4>
          {match.team1Scorers.map((scorer, index) => (
            <div key={index}>
              {scorer.player}{" "}
              {scorer.goals > 1 && <span> {scorer.goals}x </span>}
            </div>
          ))}
          <h4> Strelci za {match.team2}</h4>
          {match.team2Scorers.map((scorer, index) => (
            <div key={index}>
              {scorer.player}{" "}
              {scorer.goals > 1 && <span> {scorer.goals}x </span>}
            </div>
          ))}
        </div>
      )}
      <h2>{team1.name}</h2>
      {team1.players.map((player, index) => (
        <div className="player" key={index}>
          <span
            style={{
              fontWeight: 700,
              display: "inline-block",
              width: "30%",
            }}
          >
            {player.name}:
          </span>
          <span onClick={() => handleGoalClick("team1", index)}> ⚽ </span>
          <span onClick={() => handleYellowCardClick("team1", index)}>
            {" "}
            🟨{" "}
          </span>
          <span onClick={() => handleRedCardClick("team1", index)}> 🟥 </span>
        </div>
      ))}
      <br />
      <br />
      <h2>{team2.name}</h2>
      {team2.players.map((player, index) => (
        <div className="player" key={index}>
          <span
            style={{
              fontWeight: 700,
              display: "inline-block",
              width: "30%",
            }}
          >
            {player.name}:
          </span>
          <span onClick={() => handleGoalClick("team2", index)}> ⚽ </span>
          <span onClick={() => handleYellowCardClick("team2", index)}>
            {" "}
            🟨{" "}
          </span>
          <span onClick={() => handleRedCardClick("team2", index)}> 🟥 </span>
        </div>
      ))}
      <br />
      {/*<div>
        <b>Igralci z rumenimi kartoni (team1):</b>
        <ul>
          {yellowCards.team1.map((index, idx) => (
            <li key={idx}>{team1.players[index].name}</li>
          ))}
        </ul>
        <h3>Igralci z rumenimi kartoni (team2):</h3>
        <ul>
          {yellowCards.team2.map((index, idx) => (
            <li key={idx}>{team2.players[index].name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Igralci z rdečimi kartoni (team1):</h3>
        <ul>
          {redCards.team1.map((index, idx) => (
            <li key={idx}>{team1.players[index].name}</li>
          ))}
        </ul>
        <h3>Igralci z rdečimi kartoni (team2):</h3>
        <ul>
          {redCards.team2.map((index, idx) => (
            <li key={idx}>{team2.players[index].name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Igralci z doseženimi goli (team1):</h3>
        <ul>
          {Object.keys(goals.team1).map((index) => (
            <li key={index}>
              {team1.players[index].name} {goals.team1[index]}x
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Igralci z doseženimi goli (team2):</h3>
        <ul>
          {Object.keys(goals.team2).map((index) => (
            <li key={index}>
              {team2.players[index].name} {goals.team2[index]}x
            </li>
          ))}
        </ul>
      </div>
      */}
    </div>
  );
}

export default Match;
