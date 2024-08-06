import React, { useState, useEffect } from "react";
import axios from "axios";

function PlayersWhoMustPay() {
  const [playersToPay, setPlayersToPay] = useState([]);
  const [playersToPayRed, setPlayersToPayRed] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/players");
        const allPlayers = response.data;

        const filteredPlayers = allPlayers.filter(
          (player) => player.mustPayYellowCard
        );

        const filteredPlayersRed = allPlayers.filter(
          (player) => player.mustPayRedCard
        );

        setPlayersToPay(filteredPlayers);
        setPlayersToPayRed(filteredPlayersRed);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  async function playerPaidYellowCard(playerId) {
    try {
      await axios.put(`http://localhost:4000/players/${playerId}`, {
        mustPayYellowCard: false,
      });
      setPlayersToPay((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== playerId)
      );
    } catch (error) {
      console.error("Error updating player:", error);
    }
  }

  async function playerPaidRedCard(playerId) {
    try {
      await axios.put(`http://localhost:4000/players/${playerId}`, {
        mustPayRedCard: false,
      });
      setPlayersToPayRed((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== playerId)
      );
    } catch (error) {
      console.error("Error updating player:", error);
    }
  }

  return (
    <div className="players-container">
      <div className="players-section">
        <h3 className="section-title">
          Igralci, ki morajo poravnati kazen za prejeti rumeni karton (3€)
        </h3>
        {playersToPay.length > 0 ? (
          <ul className="players-list">
            {playersToPay.map((player) => (
              <li className="player-item" key={player._id}>
                <span className="player-name">{player.name}</span>
                <button
                  className="pay-button"
                  onClick={() => playerPaidYellowCard(player._id)}
                >
                  ✔
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-players-message">
            Noben igralec trenutno ne potrebuje plačati za rumeni karton.
          </p>
        )}
      </div>
      <div className="players-section">
        <h3 className="section-title">
          Igralci, ki morajo poravnati kazen za prejeti rdeči karton (6€)
        </h3>
        {playersToPayRed.length > 0 ? (
          <ul className="players-list">
            {playersToPayRed.map((player) => (
              <li className="player-item" key={player._id}>
                <span className="player-name">{player.name}</span>
                <button
                  className="pay-button"
                  onClick={() => playerPaidRedCard(player._id)}
                >
                  ✔
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-players-message">
            Noben igralec trenutno ne potrebuje plačati za rdeči karton.
          </p>
        )}
      </div>
    </div>
  );
}

export default PlayersWhoMustPay;
