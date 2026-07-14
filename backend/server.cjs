const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests to verify the server is actually receiving them
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/transactions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const { description, amount, type } = req.body;
    try {
        const query = 'INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(query, [description, amount, type]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Default route to confirm the server is working at all
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is LIVE on port ${PORT}`);
});