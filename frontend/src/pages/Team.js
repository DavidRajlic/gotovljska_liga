import React, { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setname] = useState("");

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
  }, []);

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:4000/teams", {
        name: name,
      });
      // Fetch teams again after creating a new one
      const newTeamsResponse = await axios.get("http://localhost:4000/teams");
      setTeams(newTeamsResponse.data);
      setname("");
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju ekipe!", error);
    }
  };

  const handleChange = (event) => {
    setname(event.target.value);
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
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
