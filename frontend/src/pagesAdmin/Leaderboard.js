import React, { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, matchesResponse] = await Promise.all([
          axios.get("http://localhost:4000/teams"),
          axios.get("http://localhost:4000/matches"),
        ]);

        const teamsData = teamsResponse.data;
        const matchesData = matchesResponse.data;

        const sortedTeams = sortTeams(teamsData, matchesData);

        setTeams(sortedTeams);
        setMatches(matchesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju podatkov!", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortTeams = (teams, matches) => {
    return teams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points; // sorted by points
      } else {
        const headToHeadResult = getHeadToHeadResult(a, b, matches);
        console.log(headToHeadResult, a.name, b.name);
        if (headToHeadResult !== 0) {
          return headToHeadResult;
        } else {
          if (a.goalDiffrence !== b.goalDiffrence) {
            return b.goalDiffrence - a.goalDiffrence;
          } else if (a.goalsScored !== b.goalsScored) {
            return b.goalsScored - a.goalsScored;
          } else {
            return a.yellowCards + a.redCards - (b.yellowCards + b.redCards);
          }
        }
      }
    });
  };

  const getHeadToHeadResult = (teamA, teamB, matches) => {
    let teamAWins = 0;
    let teamBWins = 0;
    let teamAGoalDifference = 0;
    let teamBGoalDifference = 0;

    matches.forEach((match) => {
      if (
        // checking if macthes where these two teams played each other
        (match.team1Id === teamA._id && match.team2Id === teamB._id) ||
        (match.team1Id === teamB._id && match.team2Id === teamA._id)
      ) {
        if (match.matchPlayed) {
          const team1IsTeamA = match.team1Id === teamA._id;

          // counting number of wins
          if (match.team1Goals > match.team2Goals) {
            teamAWins++;
          } else if (match.team1Goals < match.team2Goals) {
            teamBWins++;
          }

          // calculating goal difference
          if (team1IsTeamA) {
            teamAGoalDifference += match.team1Goals - match.team2Goals;
            teamBGoalDifference += match.team2Goals - match.team1Goals;
          } else {
            teamAGoalDifference += match.team2Goals - match.team1Goals;
            teamBGoalDifference += match.team1Goals - match.team2Goals;
          }
        }
      }
    });

    if (teamAWins !== teamBWins) {
      // sorting by head to head wins
      return teamBWins - teamAWins;
    } else if (teamAGoalDifference !== teamBGoalDifference) {
      // then by head to head goal difference
      return teamBGoalDifference - teamAGoalDifference;
    } else {
      // else head to head not resolved
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "5rem" }}>
          Nalaganje podatkov...
        </h2>
      </div>
    );
  }

  // if there are no teams display the message
  if (teams.length === 0) {
    return (
      <div>
        <h2 style={{ textAlign: "center", color: "red", marginTop: "5rem" }}>
          Liga trenutno ne poteka!
        </h2>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h1>Lestvica</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Ekipa</th>
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
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr className="tr" key={team._id}>
                <td>
                  <b>{index + 1}.</b>
                </td>
                <td>
                  <b>{team.name}</b>
                </td>
                <td>{team.matchesPlayed}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td className="points">
                  <b>{team.points}</b>
                </td>
                <td>{team.goalsScored}</td>
                <td>{team.goalsConceded}</td>
                <td>{team.goalDiffrence}</td>
                <td>{team.yellowCards + team.redCards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
