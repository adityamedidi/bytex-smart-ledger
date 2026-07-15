const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Route: Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error("GET Error:", err.message);
        res.status(500).json({ error: "Failed to fetch transactions", details: err.message });
    }
});

// Route: Add new transaction (with detailed logging)
app.post('/api/transactions', async (req, res) => {
    const { description, amount, type } = req.body;
    
    console.log("Received POST request:", { description, amount, type });

    try {
        const query = 'INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(query, [description, amount, type]);
        
        console.log("Database insert successful:", rows[0]);
        res.json(rows[0]);
    } catch (err) {
        console.error("POST Database Error:", err.message);
        // This log will appear in your Render dashboard, telling us exactly why it failed
        res.status(500).json({ error: "Database insert failed", details: err.message });
    }
});

app.get('/', (req, res) => res.send('Server is live!'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is LIVE on port ${PORT}`);
});