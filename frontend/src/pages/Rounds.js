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
  const [freeTeams, setFreeTeams] = useState({});
  const [showEditor, setShowEditor] = useState(true);

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

  useEffect(() => {
    groupMatchesByMatchday(matches);
  }, [matches, teams]);

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
    calculateFreeTeams(grouped);
  };

  const calculateFreeTeams = (grouped) => {
    const freeTeams = {};
    const totalMatchdays = Object.keys(grouped).length;

    for (let day = 1; day <= totalMatchdays; day++) {
      if (grouped[day]) {
        const playingTeams = new Set(
          grouped[day].flatMap((match) => [match.team1Id, match.team2Id])
        );
        const freeTeamsForDay = teams.filter(
          (team) => !playingTeams.has(team._id)
        );
        if (freeTeamsForDay.length > 0) {
          freeTeams[day] = freeTeamsForDay.map((team) => team.name);
        }
      }
    }
    setFreeTeams(freeTeams);
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

  console.log(showEditor);

  return (
    <div>
      <h1 className="matchdayTitle">Razpored</h1>
      <div className={showEditor ? "showEditor" : "hideEditor"}>
        <b>{matchday}. KOLO</b>
        <input
          className="dateInput"
          type="text"
          placeholder="Napiši datum kola"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <ul className="selectTeamList">
            {teams.map((team) => (
              <button
                key={team._id}
                type="button"
                onClick={() => handleTeamClick(team)}
                disabled={selectedTeams.length >= 2}
              >
                <b> {team.name} </b>
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

        <button className="confirmMatchday" onClick={confirmMatchday}>
          Potrdi {matchday}. kolo
        </button>
      </div>

      <div>
        {showEditor ? (
          <button
            className="showEditorBtn"
            onClick={() => setShowEditor(!showEditor)}
          >
            {" "}
            Skrij orodje
          </button>
        ) : (
          <button
            className="hideEditorBtn"
            onClick={() => setShowEditor(!showEditor)}
          >
            {" "}
            Pokaži{" "}
          </button>
        )}
      </div>
      <div className="matchdayContainer">
        {Object.keys(groupedMatches).map((day) => {
          const matchPlayed = groupedMatches[day][0].matchPlayed; // Extracting the matchPlayed status from the first match of the day

          return (
            <div>
              <h3>
                {day}. KOLO {groupedMatches[day][0].date}
              </h3>
              <table className="matchdayTable" key={day}>
                <tr>
                  <th>TEKME</th>
                  <th>{matchPlayed ? "REZULTAT" : "URA"}</th>
                  <th> Uredi </th>
                </tr>

                {groupedMatches[day].map((match) => (
                  <tr key={match._id}>
                    <td>
                      <span>
                        {match.team1} : {match.team2}{" "}
                      </span>
                    </td>
                    {match.matchPlayed ? (
                      <td>
                        <b>
                          {" "}
                          {match.team1Goals} : {match.team2Goals}{" "}
                          {(match.team1Goals || match.team2Golas > 0) &&
                            (match.team1Scorers.length === 0 ||
                              match.team2Scorers === 0) && (
                              <span> B.B</span>
                            )}{" "}
                        </b>
                      </td>
                    ) : (
                      <td>{match.time}</td>
                    )}
                    <td>
                      <button
                        className="editMatchBtn"
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
                        📝
                      </button>
                    </td>
                  </tr>
                ))}
                {freeTeams[day] && (
                  <tr className="freeTr">
                    {" "}
                    <td>
                      <b>PROSTO </b>
                      {freeTeams[day].join(", ")}{" "}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Round;
