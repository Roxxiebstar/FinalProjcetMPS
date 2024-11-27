const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;

app.get('/vendedor', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM venta');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5500, () => {
    console.log('Servidor corriendo en http://localhost:5500');
});

