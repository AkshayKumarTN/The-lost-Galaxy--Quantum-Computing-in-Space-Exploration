import React, { useEffect, useState } from "react";
import './Leaderboard.css'; // 引入 CSS 樣式文件

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard");
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Leaderboard</h1>
      <table style={{ margin: "auto", borderCollapse: "collapse", width: "50%" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th style={{ padding: "10px" }}>Rank</th>
            <th style={{ padding: "10px" }}>Player</th>
            <th style={{ padding: "10px" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player._id} style={{ borderBottom: "1px solid gray" }}>
              <td style={{ padding: "10px" }}>{index + 1}</td>
              <td style={{ padding: "10px" }}>{player.name}</td>
              <td style={{ padding: "10px" }}>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
