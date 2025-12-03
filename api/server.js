// api/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 
const db = mysql.createConnection({
  host: 'localhost',      // Keep this localhost (Node is running on same machine as MySQL)
  user: 'app_user',       // Your MySQL username
  password: 'app_user',   // Your MySQL password
  database: 'testdb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// GET Endpoint: Fetch all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST Endpoint: Add a new user
app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
      return res.status(400).json({ error: "Name is required" });
  }
  const query = 'INSERT INTO users (name) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User added!', id: result.insertId });
  });
});

// Listen on all network interfaces (0.0.0.0) so your phone can reach it
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});