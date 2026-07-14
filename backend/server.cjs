require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test the database connection on startup
pool.connect()
    .then(() => console.log("Successfully connected to Neon PostgreSQL database"))
    .catch(err => console.error("Database connection error", err.stack));

// GET: Fetch all transactions and calculate summary
app.get('/api/transactions', async (req, res) => {
    try {
        // Changed "date" to "created_at" to match the database table
        const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        const transactions = result.rows;

        // Calculate Income, Expense, and Balance for the frontend cards
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            const amount = parseFloat(t.amount);
            if (t.type === 'income') {
                income += amount;
            } else if (t.type === 'expense') {
                expense += amount;
            }
        });

        const balance = income - expense;

        // Send back the exact structure the React app expects
        res.json({
            transactions,
            summary: { income, expense, balance }
        });
    } catch (error) {
        console.error("Database read error:", error);
        res.status(500).json({ error: "Internal server error while fetching transactions" });
    }
});

// POST: Add a new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { type, amount, category, description } = req.body;

        // Basic validation
        if (!type || !amount || !category) {
            return res.status(400).json({ error: "Type, amount, and category are required." });
        }

        // Anomaly Detection: Flag any expense over $1000
        const is_anomaly = type === 'expense' && parseFloat(amount) >= 1000;

        // Insert into database
        const result = await pool.query(
            'INSERT INTO transactions (type, amount, category, description, is_anomaly) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [type, amount, category, description, is_anomaly]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Database write error:", error);
        res.status(500).json({ error: "Internal server error while saving transaction" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});