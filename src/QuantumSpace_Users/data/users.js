import {users} from "../config/mongoCollections.js";
import express from 'express';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

const saltRounds = 10;

const createUser = async (
  email,
  username,
  password,
  ) => {
      if (!email) throw "You must provide an email";
      if (!username) throw "You must provide a username";
      if (!password) throw "You must provide a password";
      
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      let newUser = {
          email: email,
          password: hashedPassword,
      };
      
      const userCollection = await users();
      const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
          throw 'Could not add user';
};


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

export { createUser, updatePassword }
