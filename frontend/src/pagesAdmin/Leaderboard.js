import React, { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showNoLeagueMessage, setShowNoLeagueMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, matchesResponse] = await Promise.all([
          axios.get("http://localhost:4000/teams"),
          axios.get("http://localhost:4000/matches"),
        ]);

        const teamsData = teamsResponse.data;
        const matchesData = matchesResponse.data;

        setTeams(teamsData);
        setMatches(matchesData);

        const sortedTeams = sortTeams(teamsData, matchesData);
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Prišlo je do napake pri pridobivanju podatkov!", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (teams.length === 0) {
      const timer = setTimeout(() => {
        setShowNoLeagueMessage(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [teams]);

  const sortTeams = (teams, matches) => {
    return teams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      } else {
        const headToHeadResult = getHeadToHeadResult(a, b, matches);
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
    let teamAGoals = 0;
    let teamBGoals = 0;

    matches.forEach((match) => {
      if (
        (match.team1Id === teamA._id && match.team2Id === teamB._id) ||
        (match.team1Id === teamB._id && match.team2Id === teamA._id)
      ) {
        if (match.matchPlayed) {
          const team1IsTeamA = match.team1Id === teamA._id;
          const team2IsTeamA = match.team2Id === teamA._id;

          const team1Goals = team1IsTeamA ? match.team1Goals : match.team2Goals;
          const team2Goals = team2IsTeamA ? match.team1Goals : match.team2Goals;

          const winner =
            match.team1Goals > match.team2Goals ? match.team1Id : match.team2Id;
          if (winner === teamA._id) {
            teamAWins++;
          } else if (winner === teamB._id) {
            teamBWins++;
          }

          if (team1IsTeamA) {
            teamAGoalDifference += match.team1Goals - match.team2Goals;
            teamBGoalDifference += match.team2Goals - match.team1Goals;
            teamAGoals += match.team1Goals;
            teamBGoals += match.team2Goals;
          } else {
            teamAGoalDifference += match.team2Goals - match.team1Goals;
            teamBGoalDifference += match.team1Goals - match.team2Goals;
            teamAGoals += match.team2Goals;
            teamBGoals += match.team1Goals;
          }
        }
      }
    });

    if (teamAWins !== teamBWins) {
      return teamBWins - teamAWins;
    } else if (teamAGoalDifference !== teamBGoalDifference) {
      return teamBGoalDifference - teamAGoalDifference;
    } else if (teamAGoals !== teamBGoals) {
      return teamBGoals - teamAGoals;
    } else {
      const teamACards = teamA.yellowCards + teamA.redCards;
      const teamBCards = teamB.yellowCards + teamB.redCards;
      return teamACards - teamBCards;
    }
  };

  if (showNoLeagueMessage) {
    return (
      <div>
        <h2 style={{ textAlign: "center", color: "red", marginTop: "5rem" }}>
          Liga trenutno ne poteka!
        </h2>
      </div>
    );
  }

  return (
    <div>
      {teams.length > 0 && (
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
      )}
    </div>
  );
}

export default Teams;
