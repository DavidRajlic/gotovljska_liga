import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Players() {
  const { isLoggedIn } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const [leader, setLeader] = useState("");
  const location = useLocation();
  const teamName = location.state.teamName;
  const teamId = location.state.teamId;
  const DOMAIN = process.env.REACT_APP_DOMAIN;

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/teams/${teamId}`);
      setTeam(response.data);

      // Podatke o igralcih ekipe pridobiš kar iz response.data.players
      setPlayers(response.data.players);

      // Check for leader and set leader if found
      const leader = players.find((player) => player.leader === true);
      if (leader) {
        setLeader(leader);
      }
    } catch (error) {
      console.error("Prišlo je do napake pri pridobivanju ekipe!", error);
    }
  };

  const createPlayer = async (event) => {
    event.preventDefault();
    try {
      const newPlayerData = {
        name: player,
        goalsScored: 0,
        yellowCards: 0,
        redCards: 0,
        mustPayYellowCard: false,
        mustPayRedCard: false,
        leader: false,
      };
      await axios.post(`${DOMAIN}/players`, newPlayerData);

      const response = await axios.get(`${DOMAIN}/players`);
      const allPlayers = response.data;
      const lastPlayer = allPlayers[allPlayers.length - 1];
      const updatedPlayers = [...team.players, lastPlayer];
      const updatedTeam = { ...team, players: updatedPlayers };

      await axios.put(`${DOMAIN}/teams/players/${teamId}`, updatedTeam);

      fetchTeam();
      setTeam(updatedTeam);
      setPlayer("");
      toast.success("Igralec uspešno ustvarjen");
    } catch (error) {
      console.error(
        "Prišlo je do napake pri ustvarjanju igralca ali posodabljanju ekipe!",
        error
      );
      toast.error("Prišlo je do napake pri dodajnaju igralca!");
    }
  };

  const removePlayer = async (playerId, playerName) => {
    confirmAlert({
      title: "Potrditev brisanja",
      message: `Ali ste prepričani, da želite odstraniti igralca ${playerName}?`,
      buttons: [
        {
          label: "Da",
          onClick: async () => {
            try {
              await axios.delete(`${DOMAIN}/players/${playerId}`);
              const updatedPlayers = players.filter(
                (player) => player._id !== playerId
              );
              const updatedTeamPlayers = team.players.filter(
                (teamPlayer) => teamPlayer._id !== playerId
              );
              setPlayers(updatedPlayers);
              setTeam({ ...team, players: updatedTeamPlayers });
              await axios.put(`${DOMAIN}/teams/players/${teamId}`, {
                players: updatedPlayers,
              });
              toast.success("Igralec uspešno odstranjen!");
            } catch (error) {
              toast.error("Prišlo je do napake pri odstranjevanju igralca!");
            }
          },
        },
        {
          label: "Ne",
          onClick: () => {},
        },
      ],
    });
  };

  const addLeader = async (player, playerId) => {
    if (isLoggedIn) {
      if (leader !== "") {
        await axios.put(`${DOMAIN}/players/again/${leader._id}`, {
          leader: false,
        });
      }

      await axios.put(`${DOMAIN}/players/again/${playerId}`, {
        leader: true,
      });
      setLeader(player);
    }
  };

  const handleChange = (event) => {
    setPlayer(event.target.value);
  };

  if (!team) {
    return <p>Nalaganje ekipe...</p>;
  }

  return (
    <div className="playerContainer">
      <ToastContainer position="top-right" />
      <h1>{teamName}</h1>
      <div>
        {isLoggedIn && (
          <span>
            <h2>Vnesi igralca</h2>
            <form className="player-form" onSubmit={createPlayer}>
              <input
                className="player-input"
                type="text"
                value={player}
                onChange={handleChange}
              />
              <button className="player-button" type="submit">
                Dodaj igralca
              </button>
            </form>
          </span>
        )}
        <ul>
          <h3>Igralci:</h3>
          {players.map((player) => (
            <div
              onClick={() => addLeader(player, player._id)}
              className="player"
              key={player._id}
            >
              <span>
                {player.name} {/* {player.leader && <> (K)</>*/}
              </span>
              <span className="goal">⚽: {player.goalsScored}</span>
              {player.mustPayYellowCard ? (
                <span className="yellow-card">
                  {" "}
                  🟨: {player.yellowCards}
                  <small style={{ color: "red" }}> * </small>{" "}
                </span>
              ) : (
                <span className="yellow-card"> 🟨: {player.yellowCards} </span>
              )}
              {player.mustPayRedCard ? (
                <span className="red-card">
                  🟥: {player.redCards}{" "}
                  <small style={{ color: "red" }}> * </small>{" "}
                </span>
              ) : (
                <span className="red-card">🟥: {player.redCards} </span>
              )}

              {isLoggedIn && (
                <span>
                  <button
                    className="deletePlayerBtn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
                      removePlayer(player._id, player.name);
                    }}
                  >
                    <small> ✖ </small>
                  </button>
                </span>
              )}
            </div>
          ))}
        </ul>
      </div>
      <div>
        {leader && (
          <div>
            {" "}
            VODJA: <b>{leader.name} </b>{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default Players;
