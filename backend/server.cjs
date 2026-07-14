const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Configure CORS to trust your specific Vercel URL
app.use(cors({
  origin: 'https://bytex-smart-ledger-n14n.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { description, amount, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *',
      [description, amount, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));