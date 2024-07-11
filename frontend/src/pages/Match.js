import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Match() {
  const location = useLocation();
  const team1Id = location.state.team1Id;
  const team2Id = location.state.team2Id;
  const matchId = location.state.matchId;
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
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

  // get team by this id
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [team1Response, team2Response] = await Promise.all([
          axios.get(`http://localhost:4000/teams/${team1Id}`),
          axios.get(`http://localhost:4000/teams/${team2Id}`),
          axios.get(`http://localhost:4000/matches/${matchId}`),
        ]);
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

  const handleResult = async () => {
    let winner;
    if (team1Goals > team2Goals) {
      winner = team1;
    } else if (team2Goals > team1Goals) {
      winner = team2;
    } else {
      winner = undefined;
    }

    try {
      // Pretvori indekse v imena igralcev
      const team1Scorers = Object.keys(goals.team1).map((index) => ({
        player: team1.players[index].name,
        goals: goals.team1[index],
      }));
      const team2Scorers = Object.keys(goals.team2).map((index) => ({
        player: team2.players[index].name,
        goals: goals.team2[index],
      }));

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

      if (winner === team1) {
        team1Wins = 1;
        team1Points = 3;
        team2Points = 0;
        team2Losses = 1;
      } else if (winner === undefined) {
        team1Points = 1;
        team2Points = 1;
        team1Draws = 1;
        team2Draws = 1;
      } else {
        team1Points = 0;
        team2Points = 3;
        team2Wins = 1;
        team1Losses = 1;
      }

      await axios.put(`http://localhost:4000/teams/${team1Id}`, {
        points: team1Points,
        goalsScored: Number(team1Goals),
        goalsConceded: Number(team2Goals),
        matchesPlayed: 1,
        wins: team1Wins,
        draws: team1Draws,
        losses: team1Losses,
      });

      await axios.put(`http://localhost:4000/teams/${team2Id}`, {
        points: team2Points,
        goalsScored: Number(team2Goals),
        goalsConceded: Number(team1Goals),
        matchesPlayed: 1,
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
        <button onClick={handleResult}>Potrdi rezultat</button>
      </div>
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
      <div>
        <h3>Igralci z rumenimi kartoni (team1):</h3>
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
        <h3>Igralci z doseženimi goli - ID-ji (team1):</h3>
        <ul>
          {Object.keys(goalScorers.team1).map((playerId) => (
            <li key={playerId}>
              {playerId}: {goalScorers.team1[playerId]}x
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
        <h3>Igralci z doseženimi goli - ID-ji (team2):</h3>
        <ul>
          {Object.keys(goalScorers.team2).map((playerId) => (
            <li key={playerId}>
              {playerId}: {goalScorers.team2[playerId]}x
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Match;
