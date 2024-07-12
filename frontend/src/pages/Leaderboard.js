import React, { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
  const [teams, setteams] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/teams");
        const sortedteams = response.data.sort((a, b) => b.points - a.points);
        setteams(sortedteams);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekip!", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h1>Lestvica </h1>
      <table className="leaderboard">
        <tr>
          <th> </th>
          <th>Ekipa </th>
          <th>Odigrane tekme</th>
          <th>Zmage</th>
          <th>Remi</th>
          <th>Porazi</th>
          <th>Točke</th>
          <th>Doseženi zadetki</th>
          <th>Prejeti zadetki</th>
          <th>Gol razlika</th>
          <th>Kartoni</th>
        </tr>

        {teams.map((team, index) => (
          <tr className="tr" key={team._id}>
            <td> {index + 1}.</td>
            <td> {team.name}</td>
            <td> {team.matchesPlayed}</td>
            <td> {team.wins}</td>
            <td> {team.draws}</td>
            <td> {team.losses}</td>
            <td className="points">
              {" "}
              <b> {team.points}</b>
            </td>
            <td> {team.goalsScored}</td>
            <td> {team.goalsConceded}</td>
            <td> {team.goalDiffrence} </td>
            <td> {team.yellowCards + team.redCards}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Teams;
