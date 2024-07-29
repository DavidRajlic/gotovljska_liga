import React from "react";

const EditMatch = ({
  team,
  handleGoalClick,
  handleYellowCardClick,
  handleRedCardClick,
}) => {
  return (
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
            onClick={() => handleGoalClick(team.name, index)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            ⚽{" "}
          </span>
          <span
            onClick={() => handleYellowCardClick(team.name, index)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            🟨{" "}
          </span>
          <span
            onClick={() => handleRedCardClick(team.name, index)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            🟥{" "}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EditMatch;
