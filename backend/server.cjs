const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors({
    origin: 'https://bytex-smart-ledger-n14n.vercel.app', // Your Vercel frontend
    credentials: true
}));
app.use(express.json());

// 2. Database Connection (using your Neon string)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon/Render
});

// 3. Health Check Route (for debugging)
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 4. API Endpoints
// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a transaction
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

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));