import {users} from "../config/mongoCollections.js";
import express from 'express';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

const saltRounds = 10;

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if user already exists
  const userCollection = await users();
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use.' });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser = {
    email: email,
    password: hashedPassword,
  };

  // Save user to database
  try {
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user.' });
  }
});


const updatePassword = async (id, newPassword) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  if (!newPassword) throw 'You must provide a passwoord for your user';
  if (typeof newPassword !== 'string') throw 'Password must be a string';
  if (newPassword.trim().length === 0)
    throw 'Password cannot be an empty string or string with just spaces';

  newPassword = newPassword.trim();

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  const updatedUser = {
      password: hashedPassword,
  };
  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updatedUser},
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update user successfully';
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
