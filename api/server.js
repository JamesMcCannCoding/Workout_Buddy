const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection Configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_user',
    password: 'app_user',
    database: 'workoutdb'
});

// =========================================================================
// NEW ENDPOINT: FETCH ALL SAVED WORKOUTS FOR THE HOME SCREEN (MODIFIED)
// =========================================================================
app.get('/workouts', (req, res) => {
    // 1. Extract the user_id from the query parameters
    const { user_id } = req.query;

    if (!user_id) {
        // If user_id is missing (unauthenticated access), return an empty list or an error.
        // Returning an empty list is safer for the front-end.
        console.warn('GET /workouts attempted without user_id query parameter.');
        return res.json([]); 
    }

    // 2. Modify the query to filter by the user_id
    const query = `
        SELECT 
            w.workout_id, 
            w.workout_name
        FROM 
            Workouts w
        WHERE
            w.user_id = ?;
    `;
    
    // 3. Pass the user_id to the query
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error (GET /workouts):', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Successfully fetched ${results.length} workouts for user ${user_id}.`);
        res.json(results);
    });
});
// =========================================================================
// FETCH FULL WORKOUT DETAILS BY ID (Corrected SQL)
// =========================================================================
app.get('/workouts/:workoutId', (req, res) => {
    const { workoutId } = req.params;

    const query = `
        SELECT 
            w.workout_name,
            we.workout_exercise_id,
            we.exercise_id,
            we.exercise_order,
            e.exercise_name,
            e.image_url,
            wes.set_id,
            wes.set_number,
            wes.target_reps AS reps,
            wes.target_weight AS weight,
            pd.performance_id,
            pd.is_completed
        FROM Workouts w
        JOIN WorkoutExercises we ON w.workout_id = we.workout_id
        JOIN Exercises e ON we.exercise_id = e.exercise_id
        LEFT JOIN WorkoutExerciseSets wes ON we.workout_exercise_id = wes.workout_exercise_id
        LEFT JOIN Performancedata pd ON 
            pd.workout_id = w.workout_id AND 
            pd.exercise_id = we.exercise_id AND 
            pd.set_number = wes.set_number
        WHERE w.workout_id = ?
        ORDER BY we.exercise_order ASC, wes.set_number ASC;
    `;

    db.query(query, [workoutId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        const workoutData = {
            workout_name: results[0]?.workout_name || 'Workout',
            exercises: []
        };
        const exercisesMap = new Map();

        results.forEach(row => {
            if (!exercisesMap.has(row.workout_exercise_id)) {
                exercisesMap.set(row.workout_exercise_id, {
                    workout_exercise_id: row.workout_exercise_id,
                    exercise_id: row.exercise_id,
                    exercise_name: row.exercise_name,
                    exercise_order: row.exercise_order,
                    image_url: row.image_url,
                    sets: [] 
                });
            }
            if (row.set_number) {
                exercisesMap.get(row.workout_exercise_id).sets.push({
                    set_id: row.set_id,
                    set_number: row.set_number,
                    reps: row.reps,
                    weight: row.weight,
                    performance_id: row.performance_id || null, 
                    is_completed: row.is_completed === 1 
                });
            }
        });

        workoutData.exercises = Array.from(exercisesMap.values());
        res.json(workoutData);
    });
});

// ==========================================================
// 1. ADD STATIC FILE SERVING FOR IMAGES
// ==========================================================
app.use('/images', express.static(path.join(__dirname, 'public/images'))); 

// =========================================================================
// NEW ENDPOINT: CREATE A NEW WORKOUT (No change needed here, as it uses user_id from req.body)
// =========================================================================
app.post('/workouts', (req, res) => {
    // user_id is passed from the front-end (home.tsx)
    const { workout_name, user_id } = req.body; 

    if (!workout_name || !user_id) {
        return res.status(400).json({ error: "Workout name and user_id are required" });
    }
    // Inserting the routine name. Exercises would be handled in subsequent calls.
    const query = 'INSERT INTO Workouts (user_id, workout_name) VALUES (?, ?)';
    db.query(query, [user_id, workout_name], (err, result) => {
        if (err) {
            console.error('Database query error (POST /workouts):', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Workout routine created!', id: result.insertId });
    });
});

// =========================================================================
// ORIGINAL USER ENDPOINTS (Corrected for schema consistency)
// =========================================================================
app.get('/users', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// FETCH ALL AVAILABLE EXERCISES (For the dropdown list)
app.get('/exercises', (req, res) => {
    const query = 'SELECT exercise_id, exercise_name FROM Exercises ORDER BY exercise_name ASC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ADD EXERCISE TO WORKOUT
app.post('/workouts/:workoutId/exercises', (req, res) => {
    const { workoutId } = req.params;
    const { exercise_id, setsData } = req.body; 

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: "Transaction failed" });

        const orderQuery = 'SELECT MAX(exercise_order) as maxOrder FROM WorkoutExercises WHERE workout_id = ?';
        
        db.query(orderQuery, [workoutId], (err, orderResult) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Error getting order" }));
            
            const nextOrder = (orderResult[0].maxOrder || 0) + 1;

            const insertExerciseQuery = `
                INSERT INTO WorkoutExercises 
                (workout_id, exercise_id, default_sets, default_reps, exercise_order)
                VALUES (?, ?, ?, ?, ?)
            `;
            const totalSets = setsData.length;
            const defaultReps = setsData[0]?.reps || 0;

            db.query(insertExerciseQuery, [workoutId, exercise_id, totalSets, defaultReps, nextOrder], (err, result) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Error inserting exercise" }));
                
                const workoutExerciseId = result.insertId;
                
                const setValues = setsData.map((set, index) => [
                    workoutExerciseId,
                    index + 1,
                    set.reps,
                    set.weight
                ]);

                const insertSetsQuery = `
                    INSERT INTO WorkoutExerciseSets 
                    (workout_exercise_id, set_number, target_reps, target_weight)
                    VALUES ?
                `;

                db.query(insertSetsQuery, [setValues], (err, setResults) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Error inserting sets" }));
                    
                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                        res.json({ message: 'Exercise and sets added!', workout_exercise_id: workoutExerciseId });
                    });
                });
            });
        });
    });
});

// =========================================================================
// CORRECTED DELETE ENDPOINT: REMOVE EXERCISE FROM WORKOUT
// =========================================================================
app.delete('/workouts/:workoutId/exercises/:workoutExerciseId', (req, res) => {
    const { workoutExerciseId } = req.params;

    if (!workoutExerciseId) {
        return res.status(400).json({ error: 'Workout exercise ID is missing.' });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction failed to start:", err);
            return res.status(500).json({ error: "Transaction failed to start" });
        }

        const getSetsQuery = 'SELECT set_id FROM WorkoutExerciseSets WHERE workout_exercise_id = ?';
        db.query(getSetsQuery, [workoutExerciseId], (err, setResults) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Error getting sets for cleanup" }));
            
            const setIds = setResults.map(row => row.set_id);
            
            const deletePerformanceQuery = `
                DELETE pd FROM Performancedata pd
                JOIN WorkoutExercises we 
                    ON pd.workout_id = we.workout_id AND pd.exercise_id = we.exercise_id
                WHERE we.workout_exercise_id = ?;
            `;
            
            db.query(deletePerformanceQuery, [workoutExerciseId], (err, perfResults) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Error deleting performance data" }));
                console.log(`Deleted ${perfResults.affectedRows} performance records.`);

                const deleteSetsQuery = 'DELETE FROM WorkoutExerciseSets WHERE workout_exercise_id = ?';
                db.query(deleteSetsQuery, [workoutExerciseId], (err, setResults) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Error deleting sets" }));
                    console.log(`Deleted ${setResults.affectedRows} set records.`);

                    const deleteExerciseQuery = 'DELETE FROM WorkoutExercises WHERE workout_exercise_id = ?';
                    db.query(deleteExerciseQuery, [workoutExerciseId], (err, linkResults) => {
                        if (err) return db.rollback(() => res.status(500).json({ error: "Error deleting exercise link" }));

                        if (linkResults.affectedRows === 0) {
                            console.warn("Attempted to delete non-existent WorkoutExercise record.");
                        }

                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                            
                            res.status(204).send(); 
                        });
                    });
                });
            });
        });
    });
});

// =========================================================================
// NEW ENDPOINT: UPDATE SET COMPLETION STATUS
// =========================================================================
app.put('/performance/:performanceId', (req, res) => {
    const { performanceId } = req.params;
    const { is_completed } = req.body; 

    if (is_completed === undefined) {
        return res.status(400).json({ error: "is_completed status is required." });
    }

    const completionValue = is_completed ? 1 : 0;
    const query = 'UPDATE Performancedata SET is_completed = ? WHERE performance_id = ?';

    db.query(query, [completionValue, performanceId], (err, result) => {
        if (err) {
            console.error('Database query error (PUT /performance):', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Performance record not found.' });
        }

        res.json({ 
            message: `Performance record ${performanceId} updated.`,
            is_completed: is_completed 
        });
    });
});

// =========================================================================
// CREATE PERFORMANCE RECORD (For first-time completion) (MODIFIED)
// =========================================================================
app.post('/performance', (req, res) => {
    const { user_id, workout_id, exercise_id, set_number, weight_kg, reps_completed, is_completed } = req.body;
    
    if (!user_id) { // <-- ADDED check for user_id
        return res.status(400).json({ error: "user_id is required to log performance data." });
    }
    
    // Default to current date
    const date_performed = new Date(); 

    const query = `
        INSERT INTO Performancedata 
        (user_id, workout_id, exercise_id, date_performed, set_number, weight_kg, reps_completed, is_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // const userId = 1; // <-- REMOVED HARDCODED USER ID

    db.query(query, [user_id, workout_id, exercise_id, date_performed, set_number, weight_kg, reps_completed, is_completed], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Performance created', performance_id: result.insertId });
    });
});

// =========================================================================
// AUTHENTICATION: SIGN UP
// =========================================================================
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // 1. Check if user exists
        const checkQuery = 'SELECT * FROM Users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) return res.status(409).json({ error: "User already exists" });

            // 2. Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Insert new user
            const insertQuery = 'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "User registered successfully", userId: result.insertId });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// =========================================================================
// AUTHENTICATION: LOGIN
// =========================================================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        res.json({ message: "Login successful", userId: user.user_id, username: user.username });
    });
});

// POST Endpoint: Add a new user (Requires username and email as per schema)
app.post('/users', (req, res) => {
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