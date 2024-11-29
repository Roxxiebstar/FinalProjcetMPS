const pool = require('../db');


const getVendedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM viewVendedor');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los vendedores' });
    }
};

const addVendedor = async (req, res) => {
    const { nombre, telefono } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO vendedor (nombre, telefono) VALUES ($1, $2) RETURNING *',
            [nombre, telefono]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el vendedor' });
    }
};

const updateVendedor = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono } = req.body;
    try {
        const result = await pool.query(
            'UPDATE vendedor SET nombre = $1, telefono = $2 WHERE id_vendedor = $3 RETURNING *',
            [nombre, telefono, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al modificar el vendedor' });
    }
};


const deleteVendedor = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM vendedor WHERE id_vendedor = $1', [id]);
        res.status(200).json({ message: 'Vendedor eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el vendedor' });
    }
};

module.exports = {
    getVendedores,
    addVendedor,
    updateVendedor,
    deleteVendedor,
};
