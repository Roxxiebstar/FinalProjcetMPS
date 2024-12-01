const pool = require('../db');

const getColor = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM color');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los colores' });
    }
};

const getMaterial = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM material');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los materiales' });
    }
};

const getTipo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tipo');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los tipos' });
    }
};

module.exports = {
    getColor,
    getMaterial,
    getTipo
};