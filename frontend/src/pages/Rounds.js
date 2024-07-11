import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Round() {
  const [date, setDate] = useState("");
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentRoundMatches, setCurrentRoundMatches] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [matchday, setMatchday] = useState(1);
  const [groupedMatches, setGroupedMatches] = useState({});

  const navigate = useNavigate();

  const fetchTeamsAndMatches = async () => {
    try {
      const [teamsResponse, matchesResponse] = await Promise.all([
        axios.get("http://localhost:4000/teams"),
        axios.get("http://localhost:4000/matches"),
      ]);

      setTeams(teamsResponse.data);
      const fetchedMatches = matchesResponse.data;
      setMatches(fetchedMatches);
      groupMatchesByMatchday(fetchedMatches);

      const maxMatchday = Math.max(
        ...fetchedMatches.map((match) => match.matchday),
        0
      );
      setMatchday(maxMatchday + 1);
    } catch (error) {
      console.error("Prišlo je do napake pri pridobivanju podatkov!", error);
    }
  };

  useEffect(() => {
    fetchTeamsAndMatches();
  }, []);

  const groupMatchesByMatchday = (matches) => {
    const grouped = matches.reduce((acc, match) => {
      const day = match.matchday;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(match);
      return acc;
    }, {});
    setGroupedMatches(grouped);
  };

  const handleTeamClick = (team) => {
    if (selectedTeams.length < 2 && !selectedTeams.includes(team)) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const addMatch = () => {
    if (selectedTeams.length === 2 && selectedTime !== "") {
      const newMatch = {
        team1Id: selectedTeams[0]._id,
        team2Id: selectedTeams[1]._id,
        team1: selectedTeams[0].name,
        team2: selectedTeams[1].name,
        time: selectedTime,
        date: date,
        matchday: matchday,
      };

      setCurrentRoundMatches([...currentRoundMatches, newMatch]);
      setSelectedTeams([]);
      setSelectedTime("");
    }
  };

  const confirmMatchday = async () => {
    try {
      for (const match of currentRoundMatches) {
        await axios.post("http://localhost:4000/matches", match);
      }
      setCurrentRoundMatches([]);
      setDate("");
      setMatchday(matchday + 1);
      fetchTeamsAndMatches(); // Refresh the matches after adding new ones
    } catch (error) {
      console.error("Prišlo je do napake pri ustvarjanju tekem!", error);
    }
  };

  const getTeamNameById = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    return team ? team.name : "Neznana ekipa";
  };

  const editMatch = (team1, team2, matchId, team1Id, team2Id) => {
    navigate(`/rounds/${matchId}`, {
      state: {
        team1: team1,
        team2: team2,
        matchId: matchId,
        team1Id: team1Id,
        team2Id: team2Id,
      },
    });
  };

  return (
    <div>
      <h1>Razpored</h1>

      <h3>{matchday}. KOLO</h3>
      <input
        type="text"
        placeholder="Datum"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div>
        <h4>Dodaj tekmo</h4>
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
                onChange={(e) => setSelectedTime(e.target.value)}
              />
              <button onClick={addMatch}>Dodaj tekmo</button>
            </div>
          )}
        </div>
      </div>
      {currentRoundMatches.length > 0 && (
        <div>
          <h4>Tekme za {matchday}. kolo:</h4>
          {currentRoundMatches.map((match, index) => (
            <div key={index}>
              <span>
                {match.team1} vs {match.team2}
              </span>
              <span> ob {match.time}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={confirmMatchday}>Potrdi {matchday}. kolo</button>

      <div>
        <h2>Vsa Kola</h2>
        {Object.keys(groupedMatches).map((day) => (
          <div key={day}>
            <h3>
              {day}. KOLO {groupedMatches[day][0].date}
            </h3>
            {groupedMatches[day].map((match) => (
              <div key={match._id}>
                <span>
                  {match.team1} vs {match.team2} ob {match.time}{" "}
                  {match.matchPlayed && (
                    <span style={{ fontWeight: "700", padding: "10px" }}>
                      {" "}
                      {match.team1Goals} : {match.team2Goals}{" "}
                      <button
                        onClick={() =>
                          editMatch(
                            match.team1,
                            match.team2,
                            match._id,
                            match.team1Id,
                            match.team2Id
                          )
                        }
                      >
                        {" "}
                        Uredi tekmo{" "}
                      </button>
                    </span>
                  )}
                </span>
                {match.matchPlayed && (
                  <div>
                    <h4> Strelci za {match.team1}</h4>
                    {match.team1Scorers.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        {scorer.goals > 1 && <span> {scorer.goals}x </span>}
                      </div>
                    ))}
                    <h4> Strelci za {match.team2}</h4>
                    {match.team2Scorers.map((scorer, index) => (
                      <div key={index}>
                        {scorer.player}{" "}
                        {scorer.goals > 1 && <span> {scorer.goals}x </span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Round;
