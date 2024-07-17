import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Players() {
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const teamName = location.state.teamName;
  const teamId = location.state.teamId;

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/teams/${teamId}`);

      setTeam(response.data);

      // Fetch player details
      const playerDetails = await Promise.all(
        response.data.players.map((playerId) =>
          axios.get(`http://localhost:4000/players/${playerId._id}`)
        )
      );

      setPlayers(playerDetails.map((res) => res.data));
    } catch (error) {
      console.error("Prišlo je do napake pri pridobivanju ekipe!", error);
    }
  };

  const createPlayer = async (event) => {
    event.preventDefault();
    try {
      // Ustvari novega igralca
      const newPlayerData = {
        name: player,
        goalsScored: 0,
        yellowCards: 0,
        redCards: 0,
      };
      await axios.post("http://localhost:4000/players", newPlayerData);

      // Pridobi posodobljen seznam vseh igralcev
      const response = await axios.get("http://localhost:4000/players");
      const allPlayers = response.data;

      // Pridobi zadnjega dodanega igralca
      const lastPlayer = allPlayers[allPlayers.length - 1];

      // Posodobi seznam igralcev v ekipi
      const updatedPlayers = [...team.players, lastPlayer];
      const updatedTeam = { ...team, players: updatedPlayers };

      await axios.put(`http://localhost:4000/teams/${teamId}`, updatedTeam);
      fetchTeam();
      // Posodobi stanje aplikacije
      setTeam(updatedTeam);
      setPlayer("");
    } catch (error) {
      console.error(
        "Prišlo je do napake pri ustvarjanju igralca ali posodabljanju ekipe!",
        error
      );
    }
  };

  const handleChange = (event) => {
    setPlayer(event.target.value);
  };

  if (!team) {
    return <p>Nalaganje ekipe...</p>;
  }

  return (
    <div>
      <h1>{teamName}</h1>
      <div>
        <h2>Podatki o ekipi</h2>
        <form onSubmit={createPlayer}>
          <input type="text" value={player} onChange={handleChange} />
          <button type="submit"> Dodaj igralca </button>
        </form>
        <ul>
          <h3>Igralci:</h3>
          {players.map((player) => (
            <div className="player" key={player._id}>
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
              <span> 🟨: {player.yellowCards} </span>
              <span> 🟥: {player.redCards} </span>
            </div>
          ))}
        </ul>
        {/* Add any other team details here */}
      </div>
    </div>
  );
}

export default Players;
