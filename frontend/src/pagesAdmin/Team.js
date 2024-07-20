import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";

function Teams() {
  const { isLoggedIn } = useContext(AuthContext);
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
  }, []); // Prazno polje odvisnosti, da se useEffect zažene samo enkrat

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:4000/teams", {
        name: name,
      });
      setName("");
      fetchTeams(); // Fetch teams again after creating a new team
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju ekipe!", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:4000/teams");
      setTeams(response.data);
    } catch (error) {
      console.error("Prišlo je do napake pri pridobivanju ekip!", error);
    }
  };

  const removeTeam = async (teamId, teamName) => {
    if (
      window.confirm(
        `Ali ste prepričani, da želite odstraniti ekipo ${teamName}?`
      )
    ) {
      try {
        await axios.delete(`http://localhost:4000/teams/${teamId}`);
        setTeams(teams.filter((team) => team._id !== teamId));
      } catch (error) {
        console.error("Prišlo je do napake pri brisanju ekipe!", error);
      }
    }
  };

  console.log(isLoggedIn);

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
      {isLoggedIn && (
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
      )}

      <div className="teamsContainer">
        <ul className="teamList">
          {teams.map((team) => (
            <div
              className="team"
              key={team._id}
              onClick={() => handleShowPlayers(team._id, team.name)}
            >
              <span style={{ fontSize: "20px" }}>
                {" "}
                <b> {team.name}</b>
              </span>
              {isLoggedIn && (
                <span>
                  <button
                    className="deleteTeamBtn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
                      removeTeam(team._id, team.name);
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
    </div>
  );
}

export default Teams;
