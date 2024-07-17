import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:4000/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekip!", error);
      }
    };

    fetchTeams();
  }, [teams]);

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:4000/teams", {
        name: name,
      });
      setName("");
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju ekipe!", error);
    }
  };

  const removeTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/teams/${id}`);
    } catch (error) {
      console.error("Prišlo je do napake pri brisanju ekipe!", error);
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleShowPlayers = (teamId, teamName) => {
    navigate(`/teams/${teamId}`, {
      state: { teamName: teamName, teamId: teamId },
    });
  };

  return (
    <div className="teamContainer">
      <h1 className="teamTitle"> EKIPE </h1>
      <form onSubmit={handleCreateTeam}>
        <input
          className="addTeamInput"
          type="text"
          placeholder="ime ekipe"
          value={name}
          onChange={handleChange}
        />
        <button className="addTeam" type="submit">
          Dodaj ekipo
        </button>
      </form>
      <div className="teamsContainer">
        <ul className="teamList">
          {teams.map((team) => (
            <div className="team" key={team._id}>
              <span style={{ fontSize: "20px" }}>
                {" "}
                <b> {team.name}</b>
              </span>
              <span>
                <button
                  className="showPlayersBtn"
                  onClick={() => handleShowPlayers(team._id, team.name)}
                >
                  Igralci
                </button>
                <button
                  className="deleteTeamBtn"
                  onClick={() => removeTeam(team._id)}
                >
                  <small> ✖ </small>
                </button>
              </span>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Teams;
