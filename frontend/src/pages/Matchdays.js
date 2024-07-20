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
  const [nextMatchday, setNextMatchday] = useState(null);

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

      console.log(nextMatchday);
      if (nextMatchday === null) {
        if (!match.matchPlayed) {
          console.log(match.matchday);
          setNextMatchday(match.matchday);
        }
      }
      console.log("nextMatch", nextMatchday);
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

  const handleMatchdayClick = (matches) => {
    const matchIds = matches.map((match) => match._id);
    navigate("/matches", { state: { matchIds } });
  };

  return (
    <div>
      <h1 className="matchdayTitle">Razpored</h1>
      <div className="nextMatchday">
        {" "}
        {nextMatchday && (
          <div>
            <h2> Tekme naslednjega kola ({nextMatchday}. kolo) </h2>
            <table className="matchdayTable" key={nextMatchday}>
              <thead>
                <tr>
                  <th>TEKME</th>
                  <th>URA</th>
                </tr>
              </thead>
              <tbody>
                {groupedMatches[nextMatchday].map((match) => (
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
                          {(match.team1Goals || match.team2Goals > 0) &&
                            (match.team1Scorers.length === 0 ||
                              match.team2Scorers === 0) && (
                              <span> B.B</span>
                            )}{" "}
                        </b>
                      </td>
                    ) : (
                      <td>{match.time}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* <span className="note"> Za ogled tekem kliknite na kolo </span>{" "} */}
      <div className="matchdayContainer">
        {Object.keys(groupedMatches).map((day) => {
          const matchPlayed = groupedMatches[day][0].matchPlayed; // Extracting the matchPlayed status from the first match of the day

          return (
            <div
              className="listOfMatchdays"
              onClick={() => handleMatchdayClick(groupedMatches[day])}
              key={day}
            >
              <div className="matchdayBtnContainer">
                <span>
                  <b>
                    {" "}
                    {day}. KOLO {groupedMatches[day][0].date}{" "}
                  </b>
                </span>
              </div>

              <table className="matchdayTable" key={day}>
                <thead>
                  <tr>
                    <th>TEKME</th>
                    <th>{matchPlayed ? "REZULTAT" : "URA"}</th>
                  </tr>
                </thead>
                <tbody>
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
                            {(match.team1Goals || match.team2Goals > 0) &&
                              (match.team1Scorers.length === 0 ||
                                match.team2Scorers === 0) && (
                                <span> B.B</span>
                              )}{" "}
                          </b>
                        </td>
                      ) : (
                        <td>{match.time}</td>
                      )}
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
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Round;
