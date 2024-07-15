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
    <div>
      <h1> EKIPE </h1>
      <form onSubmit={handleCreateTeam}>
        <input type="text" value={name} onChange={handleChange} />
        <button type="submit">Ustvari ekipo</button>
      </form>
      <ul>
        {teams.map((team) => (
          <div key={team._id}>
            <h2>{team.name}</h2>
            <button onClick={() => handleShowPlayers(team._id, team.name)}>
              Pokaži igralce
            </button>
            <button onClick={() => removeTeam(team._id)}>Izbriši ekipo</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
