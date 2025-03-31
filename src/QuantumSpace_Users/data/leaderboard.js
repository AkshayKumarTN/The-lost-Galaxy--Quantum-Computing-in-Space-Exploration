import { leaderboardCollection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const leaderboard = {
  async getTopPlayers(limit = 10) {
    const collection = await leaderboardCollection();
    return collection.find().sort({ score: -1 }).limit(limit).toArray();
  },

  async addPlayer(name, score) {
    const collection = await leaderboardCollection();
    const newPlayer = { name, score, createdAt: new Date() };
    const result = await collection.insertOne(newPlayer);
    return result.insertedId;
  },
};

export default leaderboard;
