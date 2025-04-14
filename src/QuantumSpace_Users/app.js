import express from 'express';
import { dbConnection } from './config/mongoConnection.js';
import { saveGameResult } from './data/users.js'; // Import the saveGameResult function

const app = express();
app.use(express.json());

app.post('/api/gameResult', async (req, res) => {
  try {
    const { email, level, score, time } = req.body;
    if (!email || level === undefined || score === undefined || time === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await saveGameResult(email, level, score, time);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

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












