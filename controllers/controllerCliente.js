const pool = require('../db');


const getCliente = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM viewCliente');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

const addCliente = async (req, res) => {
    const { nombre, correo, direccion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cliente (nombre, correo, direccion) VALUES ($1, $2, $3) RETURNING *',
            [nombre, correo, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el cliente' });
    }
};

const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, direccion } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cliente SET nombre = $1, correo = $2, direccion = $3 WHERE id_cliente = $4 RETURNING *',
            [nombre, correo, direccion, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al modificar el cliente' });
    }
};


const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cliente WHERE id_cliente = $1', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

module.exports = {
    getCliente,
    addCliente,
    updateCliente,
    deleteCliente,
};