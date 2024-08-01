import React from "react";

const EditMatch = ({
  match,
  goals,
  yellowCards,
  redCards,
  team,
  teamName,
  handleGoalClick,
  handleYellowCardClick,
  handleRedCardClick,
}) => {
  return (
    <>
      <div className="changedMatchData">
        <div className={`changedMatchData${teamName}`}>
          <h2>{match}</h2>

          <div>
            <b>⚽:</b>
            {Object.keys(goals[teamName]).map((index) => (
              <span style={{ padding: "10px" }} key={index}>
                {team.players[index].name} {goals[teamName][index]}x.
              </span>
            ))}
          </div>

          <div>
            <b>🟨:</b>
            {yellowCards[teamName].map((index, idx) => (
              <span style={{ padding: "10px" }} key={index}>
                {team.players[index].name}
              </span>
            ))}
          </div>
          <div>
            <b>🟥:</b>
            {redCards[teamName].map((index, idx) => (
              <span style={{ padding: "10px" }} key={index}>
                {team.players[index].name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="editMatchTeam">
        <h2>{team.name}</h2>
        {team.players.map((player, index) => (
          <div className="player" key={index}>
            <span
              style={{
                fontWeight: 700,
                display: "inline-block",
                width: "30%",
              }}
            >
              {player.name}:
            </span>
            <span
              onClick={() => handleGoalClick(teamName, index)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              ⚽{" "}
            </span>
            <span
              onClick={() => handleYellowCardClick(teamName, index)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              🟨{" "}
            </span>
            <span
              onClick={() => handleRedCardClick(teamName, index)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              🟥{" "}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default EditMatch;
