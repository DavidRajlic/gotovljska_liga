import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const DOMAIN = process.env.REACT_APP_DOMAIN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, matchesResponse] = await Promise.all([
          axios.get(`${DOMAIN}/teams`),
          axios.get(`${DOMAIN}/matches`),
        ]);

        const teamsData = teamsResponse.data;
        const matchesData = matchesResponse.data;

        const sortedTeams = sortTeams(teamsData, matchesData);

        setTeams(sortedTeams);
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
        return b.points - a.points;
      } else {
        const headToHeadResult = getHeadToHeadResult(b, a, matches);

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
        // checking matches where these two teams played each other
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
      return teamAWins - teamBWins;
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

  return (
    <div className="leaderboard">
      <div>
        <h2>Lestvica</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th className="teamsTh">Ekipa</th>
                <th className="matchesPlayedTh"></th>
                <th className="winsTh"></th>
                <th className="drawsTh"></th>
                <th className="lossesTh"></th>
                <th className="pointsTh"></th>
                <th className="goalsScoredTh"></th>
                <th className="goalsConcededTh"></th>
                <th className="goalDiffrenceTh"></th>
                <th className="cardsTh"></th>
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
      <Footer />
    </div>
  );
}

export default Teams;
