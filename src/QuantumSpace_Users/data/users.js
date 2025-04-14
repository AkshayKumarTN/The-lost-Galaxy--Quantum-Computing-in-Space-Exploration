import express from 'express';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import cors from 'cors';
import { users} from '../config/mongoCollections.js'; // Import existing collections
import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017/";
const dbName = "QuantumComputing_Users";
const collectionName = "storeUserProgress";

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// Signup API
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const userCollection = await users();
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { 
      email, 
      password: hashedPassword, 
      level: 0,       // <-- new add
    };

    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

// Update Password Function
const updatePassword = async (id, newPassword) => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw 'Invalid ID';
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length === 0) {
    throw 'Invalid Password';
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  const userCollection = await users();

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { password: hashedPassword } },
    { returnDocument: 'after' }
  );

  if (!updatedInfo) {
    throw 'Could not update user successfully';
  }

  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};


// Store Progress API - Store player progress
app.post('/api/storeProgress', async (req, res) => {
  const { level, secretKey, email } = req.body;  // Expecting level, secretKey, and email
  
  if (!level || !secretKey || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB for storing progress');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if progress for the given player and level already exists
    const existingProgress = await collection.findOne({ email, level });

    if (existingProgress) {
      // If progress exists, update the progress
      await collection.updateOne(
        { email, level },
        { $set: { secretKey, timestamp: new Date() } }
      );
      res.json({ message: 'Progress updated successfully' });
    } else {
      // If no progress exists, insert a new progress record
      const newProgress = { email, level, secretKey, timestamp: new Date() };
      await collection.insertOne(newProgress);
      res.json({ message: 'Progress saved successfully' });
    }
  } catch (error) {
    console.error('Error storing progress:', error);
    res.status(500).json({ message: 'Error storing progress', error });
  } finally {
    await client.close();
  }
});

// Leaderboard API - Fetch leaderboard data
app.get('/api/leaderboard', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("QuantumComputing_Users");
    const collection = db.collection("users");
 
    const leaderboard = await collection.aggregate([
      {
        $project: {
          username: 1,
          email: 1,
          level: { $toInt: "$level" },
          score: { $toInt: "$score" }
        }
      },
      { $sort: { score: -1, level: -1 } }, // prioritize high score, then level
      { $limit: 10 }
    ]).toArray();
 
    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Error fetching leaderboard", error: err });
  } finally {
    await client.close();
  }
});

// Update Level API
app.post('/api/updateLevel', async (req, res) => {
  const { email, level } = req.body;

  if (!email || typeof email !== 'string' || !level || typeof level !== 'number') {
    return res.status(400).json({ message: 'Invalid email or level.' });
  }

  try {
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
      { email },
      { $set: { level } },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Level updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ message: 'Failed to update level.' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});