import React, { useEffect, useState } from 'react';
import './LeaderBoard.css';
import axios from 'axios';
 
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
 
  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/leaderboard');
        setLeaderboardData(response.data);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      }
    };
 
    fetchLeaderboard();
  }, []);  
 
  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Email</th>
            <th>Level</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={player._id}>
              <td>{index + 1}</td>  {/* Display rank */}
              <td>{player.email}</td>  {/* Display player's email */}
              <td>{player.level}</td>  {/* Display player's level */}
              <td>{new Date(player.timestamp).toLocaleString()}</td>  {/* Display timestamp */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
export default Leaderboard;