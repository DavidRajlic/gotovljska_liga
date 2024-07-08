import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Players() {
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState("");
  const location = useLocation();
  const teamName = location.state.teamName;
  const teamId = location.state.teamId;

  // get team by this id
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/teams/${teamId}`
        );
        setTeam(response.data);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekipe!", error);
      }
    };

    fetchTeam();
  }, [teamId]);

  const createPlayer = async (event) => {
    const newPlayer = {
      name: player,
      goalsScored: 0,
      yelloweCards: 0,
      redCards: 0,
    };
    event.preventDefault();
    try {
      await axios.post("http://localhost:4000/players", {
        name: player,
        goalsScored: 0,
        yelloweCards: 0,
        redCards: 0,
      });
      setPlayer("");
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju igralca!", error);
    }
    try {
      const updatedPlayers = [...team.players, newPlayer];
      const updatedTeam = { ...team, players: updatedPlayers };

      await axios.put(`http://localhost:4000/teams/${teamId}`, {
        players: updatedPlayers,
      });

      setTeam(updatedTeam);
      setPlayer("");
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju igralca!", error);
    }
  };

  const handleChange = (event) => {
    setPlayer(event.target.value);
  };

  return (
    <div>
      <h1>{teamName}</h1>
      {team ? (
        <div>
          <h2>Podatki o ekipi</h2>
          <form onSubmit={createPlayer}>
            <input type="text" value={player} onChange={handleChange} />
            <button type="submit"> Dodaj igralca </button>
          </form>
          <ul>
            <h3>Igralci:</h3>
            {team.players.map((player, index) => (
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
                <span> ⚽: {player.goalsScored} </span>
                <span> 🟨: {player.yelloweCards} </span>
                <span> 🟥: {player.redCards} </span>
              </div>
            ))}
          </ul>
          {/* Add any other team details here */}
        </div>
      ) : (
        <p>Nalaganje ekipe...</p>
      )}
    </div>
  );
}

export default Players;
