import express from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { users } from '../config/mongoCollections.js';
import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017/";
const dbName = "QuantumComputing_Users";
const collectionName = "storeUserProgress";

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// SIGNUP API
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

// UPDATE PASSWORD FUNCTION
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

// STORE PROGRESS API
app.post('/api/storeProgress', async (req, res) => {
  const { level, secretKey } = req.body;

  if (!level || !secretKey) {
    return res.status(400).json({ message: 'Both level and secretKey are required.' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB for storing progress');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const existingProgress = await collection.findOne({ level });

    if (existingProgress) {
      await collection.updateOne(
        { level },
        { $set: { secretKey, timestamp: new Date() } }
      );
    } else {
      await collection.insertOne({ level, secretKey, timestamp: new Date() });
    }

    const storedProgress = await collection.findOne({ level });
    console.log("Stored Progress:", storedProgress);
    return res.json({ message: 'Progress saved successfully!', storedProgress });

  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ message: 'Error updating progress', error: err });

  } finally {
    await client.close();
  }
});

// Get Secret Key for Level3
app.get('/api/Level3Scene', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fix: use number not string
    const progress = await collection.findOne({ level: 2 });

    if (progress && progress.secretKey) {
      return res.json({ secretKey: progress.secretKey });
    } else {
      return res.status(404).json({ message: 'Secret key not found for Level3.' });
    }

  } catch (err) {
    console.error('Error retrieving secret key:', err);
    res.status(500).json({ message: 'Error retrieving secret key', error: err });

  } finally {
    await client.close();
  }
});

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
