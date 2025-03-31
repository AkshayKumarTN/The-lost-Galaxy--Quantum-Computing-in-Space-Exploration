
// import { createUser, updatePassword } from './data/users.js';
// import { dbConnection, closeConnection } from './config/mongoConnection.js';


// const db = await dbConnection();
// await db.dropDatabase();

// let user = undefined;

// try{
// user = await createUser('remese@gmail.com', 'rme101', "testing123");
//     console.log(user);

// } catch(e) {
//     console.log(e);
// }

import express from "express";
import cors from "cors";
import leaderboard from "./data/leaderboard.js";

const app = express();
app.use(cors());
app.use(express.json());

// get leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const topPlayers = await leaderboard.getTopPlayers();
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add player's score
app.post("/api/leaderboard", async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
      return res.status(400).json({ error: "Invalid input" });
    }
    const playerId = await leaderboard.addPlayer(name, score);
    res.json({ message: "Score added!", playerId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











