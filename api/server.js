const express = require('express');
const mysql = require('mysql2'); // Using mysql2 for modern features/promises
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection Configuration
// NOTE: Make sure your MySQL server is running!
const db = mysql.createConnection({
    host: 'localhost',       // Keep this localhost (Node is running on same machine as MySQL)
    user: 'app_user',            // Your MySQL username
    password: 'app_user',            // Your MySQL password
    database: 'workoutdb'
});

db.connect(err => {
    if (err) {
        // Log the error and the likely issue (DB not running or wrong credentials)
        console.error('Error connecting to MySQL. Is the database running? Error:', err.message);
        return;
    }
    console.log('Connected to MySQL database: workoutdb');
});

// =========================================================================
// NEW ENDPOINT: FETCH ALL SAVED WORKOUTS FOR THE HOME SCREEN
// =========================================================================
// For now, this fetches ALL workouts regardless of user. 
// In a production app, you would pass a user_id parameter to filter this data.
app.get('/workouts', (req, res) => {
    // We join Workouts and Users so we can see which user owns the routine.
    const query = `
        SELECT 
            w.workout_id, 
            w.workout_name, 
            u.username 
        FROM 
            Workouts w
        JOIN 
            Users u ON w.user_id = u.user_id;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error (GET /workouts):', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Successfully fetched ${results.length} workouts.`);
        res.json(results);
    });
});

// =========================================================================
// NEW ENDPOINT: CREATE A NEW WORKOUT (Place holder for future functionality)
// =========================================================================
app.post('/workouts', (req, res) => {
    // This is a placeholder. For now, it requires a user_id to assign the workout.
    // Assuming 'testuser' (ID 1) for immediate testing based on SQL inserts.
    const { workout_name, user_id = 1 } = req.body; 

    if (!workout_name) {
        return res.status(400).json({ error: "Workout name is required" });
    }
    
    // Inserting the routine name. Exercises would be handled in subsequent calls.
    const query = 'INSERT INTO Workouts (user_id, workout_name) VALUES (?, ?)';
    db.query(query, [user_id, workout_name], (err, result) => {
        if (err) {
            console.error('Database query error (POST /workouts):', err.message);
            // Unique key constraint error will show if user tries to save two workouts with the same name
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Workout routine created!', id: result.insertId });
    });
});


// =========================================================================
// ORIGINAL USER ENDPOINTS (Corrected for schema consistency)
// =========================================================================

// GET Endpoint: Fetch all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST Endpoint: Add a new user (Requires username and email as per schema)
app.post('/users', (req, res) => {
    // We assume the mobile client sends 'username' and 'email' based on your schema
    const { username, email } = req.body; 
    
    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }
    const query = 'INSERT INTO Users (username, email) VALUES (?, ?)';
    db.query(query, [username, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added!', id: result.insertId });
    });
});

// Listen on all network interfaces (0.0.0.0) so your phone can reach it
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000. Accessing DB: workoutdb');
    console.log('Endpoints: /workouts (GET, POST), /users (GET, POST)');
});