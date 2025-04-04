# Overview
![image](https://github.com/user-attachments/assets/20f5cc98-1f75-4c47-a129-15898ea3ac60)


The Lost Galaxy is an interactive quantum computing game where players embark on a thrilling space adventure, solving quantum puzzles to restore balance to a galaxy disrupted by quantum anomalies. Players pilot a quantum-powered spaceship, navigate cosmic challenges, and apply principles of quantum computing to progress.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the project's dependencies from the `package.json` file. This ensures all required libraries and packages are available for the application to run.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Database Setup

The game requires a database to store player progress, game states, a secret key, and user data. Follow these steps to set up the database.

### Requirements:
- **Database**: MongoDB  
- **Database Name**: `QuantumComputing_Users`  
- **Library**: Mongoose  

### Steps to Set Up MongoDB:
1. Ensure MongoDB is installed and running on your local machine.  
2. The database name used is `QuantumComputing_Users`.  
3. Configure the `.env` file:  
   ```env
   MONGO_URI=mongodb://localhost:27017/QuantumComputing_Users 

4. Navigate to the directory where users.js is stored.
5. Run the following command to start the server on port 3000:
   node users.js

This will connect the application to the MongoDB database and start the server, allowing user data, the secret key, and progress to be stored and retrieved correctly.
