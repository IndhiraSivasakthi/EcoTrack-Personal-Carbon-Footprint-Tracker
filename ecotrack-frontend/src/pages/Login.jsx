import { useEffect, useState } from "react";
import API from "../services/api";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/api/leaderboard");
      setLeaders(res.data || []);
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <span className="leaderboard-pill">Community Impact</span>
        <h1>Eco Leaderboard</h1>
        <p>Users with lower total CO₂ are ranked higher.</p>
      </div>

      <div className="leaderboard-table-wrap">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total CO₂</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {leaders.length > 0 ? (
              leaders.map((user) => (
                <tr key={user.rank}>
                  <td>#{user.rank}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.totalCO2?.toFixed(2)} kg</td>
                  <td>{user.activityCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No leaderboard data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
