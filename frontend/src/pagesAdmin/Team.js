import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Teams() {
  const { isLoggedIn } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const DOMAIN = process.env.REACT_APP_DOMAIN;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/teams`);
        setTeams(response.data);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju ekip!", error);
      }
    };

    fetchTeams();
  }, []);

  const createTeam = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${DOMAIN}/teams`, {
        name: name,
      });
      setName("");
      fetchTeams(); // Fetch teams again after creating a new team
      toast.success("Ekipa uspešno ustvarjena");
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju ekipe!", error);
      toast.error("Prišlo je do napake pri ustvarjanju ekipe!");
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error("Prišlo je do napake pri pridobivanju ekip!", error);
    }
  };

  const removeTeam = async (teamId, teamName) => {
    confirmAlert({
      title: "Potrditev brisanja",
      message: `Ali ste prepričani, da želite odstraniti ekipo ${teamName}?`,
      buttons: [
        {
          label: "Da",
          onClick: async () => {
            try {
              await axios.delete(`${DOMAIN}/teams/${teamId}`);
              setTeams(teams.filter((team) => team._id !== teamId));
              toast.success("Ekipa uspešno izbrisana!");
            } catch (error) {
              toast.error("Prišlo je do napake pri brisanju ekipe!");
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

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const showPlayers = (teamId, teamName) => {
    navigate(`/teams/${teamId}`, {
      state: { teamName: teamName, teamId: teamId },
    });
  };

  return (
    <div className="teamContainer">
      <ToastContainer position="top-right" />
      <h1 className="teamTitle"> EKIPE </h1>
      {isLoggedIn && (
        <form onSubmit={createTeam}>
          <input
            className="addTeamInput"
            type="text"
            placeholder="ime ekipe"
            value={name}
            onChange={handleChange}
          />
          <button className="addTeamBtn" type="submit">
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
              onClick={() => showPlayers(team._id, team.name)}
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
