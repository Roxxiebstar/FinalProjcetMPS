const pool = require('../db');


const getProveedor = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM viewProveedor');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
};

const addProveedor = async (req, res) => {
    const { nombre, telefono, direccion, contacto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proveedor (nombre, telefono, direccion, contacto) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, telefono, direccion, contacto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el proveedor' });
    }
};

const updateProveedor = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, contacto } = req.body;
    try {
        const result = await pool.query(
            'UPDATE proveedor SET nombre = $1, telefono = $2, direccion = $3, contacto = $4 WHERE id_proveedor = $5 RETURNING *',
            [nombre, telefono, direccion, contacto, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al modificar el proveedor' });
    }
};


const deleteProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM proveedor WHERE id_proveedor = $1', [id]);
        res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
};

module.exports = {
    getProveedor,
    addProveedor,
    updateProveedor,
    deleteProveedor,
};