import React, { useState, useEffect } from "react";
import axios from "axios";

function Round() {
  const [rounds, setRounds] = useState([]);
  const [date, setDate] = useState("");
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentRoundMatches, setCurrentRoundMatches] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [createMatch, setCreateMatch] = useState(false);

  useEffect(() => {
    const fetchRoundAndTeams = async () => {
      try {
        const [roundResponse, teamsResponse] = await Promise.all([
          axios.get("http://localhost:4000/rounds"),
          axios.get("http://localhost:4000/teams"),
        ]);

        setRounds(roundResponse.data);
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju podatkov!", error);
      }
    };

    fetchRoundAndTeams();
  }, []);

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleTeamClick = (team) => {
    if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const addMatch = async () => {
    if (selectedTeams.length === 2 && selectedTime !== "") {
      try {
        const response = await axios.post("http://localhost:4000/matches", {
          team1: selectedTeams[0]._id,
          team2: selectedTeams[1]._id,
          time: selectedTime,
        });

        const newMatch = {
          team1: selectedTeams[0],
          team2: selectedTeams[1],
          time: selectedTime,
        };

        setMatches((prevMatches) => [...prevMatches, newMatch]);
        setCurrentRoundMatches((prevMatches) => [...prevMatches, newMatch]);

        setSelectedTeams([]);
        setSelectedTime("");
      } catch (error) {
        console.error("Prišlo je do napake pri ustvarjanju tekme!", error);
      }
    }
  };

  const createRound = async (event) => {
    event.preventDefault();
    try {
      // Ustvarimo novo kolo
      const response = await axios.post("http://localhost:4000/rounds", {
        round: rounds.length + 1,
        date: date,
        matches: currentRoundMatches,
      });
      let newRound = {
        round: rounds.length + 1,
        date: date,
        matches: currentRoundMatches,
      };
      // Po uspešnem dodajanju, ponastavimo stanja
      setDate("");
      setMatches([]);
      setCurrentRoundMatches([]);
      setCreateMatch(false);
      setRounds((prevRounds) => [...prevRounds, newRound]);
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju kola!", error);
    }
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    return team ? team.name : "Neznana ekipa";
  };

  console.log(rounds);
  return (
    <div>
      <h1>Razpored</h1>

      <h3>{rounds.length + 1}. KOLO</h3>
      <input
        type="text"
        placeholder="Datum"
        value={date}
        onChange={handleChange}
      />
      {createMatch ? (
        <div>
          <ul>
            {teams.map((team) => (
              <button
                key={team._id}
                type="button"
                onClick={() => handleTeamClick(team)}
                disabled={selectedTeams.length >= 2}
              >
                {team.name}
              </button>
            ))}
          </ul>
          <div>
            <p>Izbrane ekipe:</p>
            {selectedTeams.map((team, index) => (
              <div key={index}>
                <span>{team.name}</span>
              </div>
            ))}
            {selectedTeams.length === 2 && (
              <div>
                <input
                  type="text"
                  placeholder="Čas tekme"
                  value={selectedTime}
                  onChange={handleTimeChange}
                />
                <button onClick={addMatch}>Potrdi tekmo</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <span></span>
      )}
      <button type="button" onClick={() => setCreateMatch(!createMatch)}>
        Dodaj tekmo
      </button>
      <button onClick={createRound}>Dodaj {rounds.length + 1}. kolo</button>

      {rounds.map((round, index) => (
        <div key={index}>
          <h3>
            {round.round}. KOLO {round.date}
          </h3>
          {round.matches.map((match, matchIndex) => (
            <div key={matchIndex}>
              <span>
                {" "}
                {match.team1.name} vs {match.team2.name}{" "}
              </span>
              {match.time && <span> ob {match.time}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Round;
