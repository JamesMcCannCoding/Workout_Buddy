const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

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
// NEW ENDPOINT: FETCH ALL SAVED WORKOUTS FOR THE HOME SCREEN
// =========================================================================
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
// FETCH FULL WORKOUT DETAILS BY ID
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
            wes.set_number,
            wes.target_reps AS reps,
            wes.target_weight AS weight
        FROM Workouts w
        JOIN WorkoutExercises we ON w.workout_id = we.workout_id
        JOIN Exercises e ON we.exercise_id = e.exercise_id
        LEFT JOIN WorkoutExerciseSets wes ON we.workout_exercise_id = wes.workout_exercise_id
        WHERE w.workout_id = ?
        ORDER BY we.exercise_order ASC, wes.set_number ASC;
    `;

    db.query(query, [workoutId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        // --- Aggregation logic to group sets under exercises ---
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
                    sets: [] // Will now hold the set objects
                });
            }
            if (row.set_number) {
                exercisesMap.get(row.workout_exercise_id).sets.push({
                    set_number: row.set_number,
                    reps: row.reps,
                    weight: row.weight,
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
    // We now expect 'setsData' to be an array: [{reps: 10, weight: 50}, ...]
    const { exercise_id, setsData } = req.body; 

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: "Transaction failed" });

        // 1. Get the current highest sort order
        const orderQuery = 'SELECT MAX(exercise_order) as maxOrder FROM WorkoutExercises WHERE workout_id = ?';
        
        db.query(orderQuery, [workoutId], (err, orderResult) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Error getting order" }));
            
            const nextOrder = (orderResult[0].maxOrder || 0) + 1;

            // 2. Insert the main link into WorkoutExercises (default sets/reps are no longer needed here)
            // We just need the number of sets.
            const insertExerciseQuery = `
                INSERT INTO WorkoutExercises 
                (workout_id, exercise_id, default_sets, default_reps, exercise_order)
                VALUES (?, ?, ?, ?, ?)
            `;
            // NOTE: We use the length of the setsData array for default_sets
            const totalSets = setsData.length;
            const defaultReps = setsData[0]?.reps || 0; // Use first set's reps as default for main table

            db.query(insertExerciseQuery, [workoutId, exercise_id, totalSets, defaultReps, nextOrder], (err, result) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Error inserting exercise" }));
                
                const workoutExerciseId = result.insertId;
                
                // 3. Insert each set into WorkoutExerciseSets
                const setValues = setsData.map((set, index) => [
                    workoutExerciseId,
                    index + 1, // set_number
                    set.reps,  // target_reps
                    set.weight // target_weight
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
// DELETE ENDPOINT: REMOVE EXERCISE FROM WORKOUT
// =========================================================================
app.delete('/workouts/:workoutId/exercises/:exerciseId', (req, res) => {
    const { workoutId, exerciseId } = req.params;

    // We now delete by exerciseId AND workoutId (since the unique key is the link table)
    const getLinkQuery = 'SELECT workout_exercise_id FROM WorkoutExercises WHERE workout_id = ? AND exercise_id = ?';

    db.query(getLinkQuery, [workoutId, exerciseId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Exercise link not found.' });
        }

        const workoutExerciseId = results[0].workout_exercise_id;

        db.beginTransaction(err => {
            if (err) return res.status(500).json({ error: "Transaction failed" });

            // 1. Delete associated sets first
            const deleteSetsQuery = 'DELETE FROM WorkoutExerciseSets WHERE workout_exercise_id = ?';
            db.query(deleteSetsQuery, [workoutExerciseId], (err, setResults) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Error deleting sets" }));

                // 2. Delete the main exercise link
                const deleteExerciseQuery = 'DELETE FROM WorkoutExercises WHERE workout_exercise_id = ?';
                db.query(deleteExerciseQuery, [workoutExerciseId], (err, linkResults) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Error deleting exercise link" }));

                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                        res.json({ message: 'Exercise and sets deleted successfully' });
                    });
                });
            });
        });
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