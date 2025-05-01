import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import cors from 'cors';
import session from 'express-session';
import { users, storeUserProgress } from '../config/mongoCollections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const saltRounds = 10;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: 'AuthenticationState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}));


app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


app.use(express.static(path.join(__dirname, 'build')));


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
    const newUser = { email, password: hashedPassword };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

// Signin
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    req.session.user = {
      email: user.email,
      score: user.score,
      level: user.level
    };
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        score: user.score || 0,
        level: user.level || 1
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    let userCollection = await users();
    const leaderboard = await userCollection.aggregate([
      {
        $project: {
          username: 1,
          email: 1,
          level: { $toInt: "$level" },
          score: { $toInt: "$score" }
        }
      },
      { $sort: { score: -1, level: -1 } },
      { $limit: 10 }
    ]).toArray();
    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Error fetching leaderboard", error: err });
  }
});

app.post('/api/updateProgress', async (req, res) => {
  const { level, score } = req.body;

  if (!req.session.user || !req.session.user.email) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  if (level == null || score == null) {
    return res.status(400).json({ message: "Missing level or score." });
  }

  try {
    const userCollection = await users();
    const result = await userCollection.updateOne(
      { email: req.session.user.email },
      {
        $set: {
          level,
          score
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or progress not updated." });
    }

    res.status(200).json({ message: "Progress updated successfully." });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress." });
  }
});

app.get('/api/currentUser', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.json({ user: null });
  }
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'Home.js'));
// });

app.post('/api/storeProgress', async (req, res) => {
  const { level, secretKey } = req.body;

  if (!level || !secretKey) {
    return res.status(400).json({ message: 'Both level and secretKey are required.' });
  }

  try {
    const storeUserProgressCollection = await storeUserProgress();
    const existingProgress = await storeUserProgressCollection.findOne({ level });

    if (existingProgress) {
      await storeUserProgressCollection.updateOne(
        { level },
        { $set: { secretKey, timestamp: new Date() } }
      );
    } else {
      await storeUserProgressCollection.insertOne({ level, secretKey, timestamp: new Date() });
    }
    const storedProgress = await storeUserProgressCollection.findOne({ level });
    console.log("Stored Progress:", storedProgress);
    return res.json({ message: 'Progress saved successfully!', storedProgress });

  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress." });
  }

});

app.get('/api/Level3Scene', async (req, res) => {
  try {
    const storeUserProgressCollection = await storeUserProgress();
    // Fix: use number not string
    const progress = await storeUserProgressCollection.findOne({ level: 2 });

    if (progress && progress.secretKey) {
      return res.json({ secretKey: progress.secretKey });
    } else {
      return res.status(404).json({ message: 'Secret key not found for Level3.' });
    }

  } catch (err) {
    console.error('Error retrieving secret key:', err);
    res.status(500).json({ message: 'Error retrieving secret key', error: err });

  }
});


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});