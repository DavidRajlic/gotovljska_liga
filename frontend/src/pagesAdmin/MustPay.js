import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "../components/Footer";

function PlayersWhoMustPay() {
  const { isLoggedIn } = useContext(AuthContext);
  const [playersToPay, setPlayersToPay] = useState([]);
  const [playersToPayRed, setPlayersToPayRed] = useState([]);
  const DOMAIN = process.env.REACT_APP_DOMAIN;
  let lastRound = useRef(0);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/players`);
        const rounds = await axios.get(`${DOMAIN}/rounds`);
        const allPlayers = response.data;
        const allRounds = rounds.data;
        for (let i = 0; i < allRounds.length; i++) {
          if (allRounds[i].done) {
            lastRound.current = i + 1;
          } else {
            break;
          }
        }
        const lastMatchday = await axios.get(
          `${DOMAIN}/matches/day/${lastRound.current}`
        );
        console.log(lastRound.current);
        console.log(lastMatchday.data);

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
      await axios.put(`${DOMAIN}/players/${playerId}`, {
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
      await axios.put(`${DOMAIN}/players/${playerId}`, {
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
        <h3 className="section-title">Denarne kazni</h3>

        {playersToPay.length > 0 || playersToPayRed.length > 0 ? (
          <ul className="players-list">
            {/* Rumeni kartoni */}
            {playersToPay.map((player) => (
              <li className="player-item" key={player._id}>
                <span className="player-name">{player.name}</span>
                <span> Prejeti rumeni karton (3€)</span>
                {isLoggedIn && (
                  <button
                    className="pay-button"
                    onClick={() => playerPaidYellowCard(player._id)}
                  >
                    ✔
                  </button>
                )}
              </li>
            ))}

            {/* Rdeči kartoni */}
            {playersToPayRed.map((player) => (
              <li className="player-item" key={player._id}>
                <span className="player-name">{player.name}</span>
                <span> Prejeti rdeči karton (6€)</span>
                {isLoggedIn && (
                  <button
                    className="pay-button"
                    onClick={() => playerPaidRedCard(player._id)}
                  >
                    ✔
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-players-message">
            Noben igralec trenutno ne potrebuje plačati kazni.
          </p>
        )}
      </div>
      <div className="players-section">
        <h3 className="section-title">Prepoved igranja</h3>
        <ul className="players-list">
          <li className="player-item">
            <span className="player-name">Gal Guček</span>
            <span> Rdeči karton</span>{" "}
          </li>
        </ul>
        {/*<p className="no-players-message">
          Trenutno nima noben igralec prepovedi igranja
        </p>*/}
      </div>
      <Footer />
    </div>
  );
}

export default PlayersWhoMustPay;
