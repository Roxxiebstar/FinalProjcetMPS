const pool = require('../db');


const getMueble = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM viewMueble');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los muebles' });
    }
};

const addMueble = async (req, res) => {
    const { precio, altura, ancho, profundidad, color, material, tipo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Mueble (precio, altura, ancho, profundidad, id_color, id_material, id_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [precio, altura, ancho, profundidad, color, material, tipo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el Mueble' });
    }
};

const updateMueble = async (req, res) => {
    const { id } = req.params;
    const { precio, dimensiones, color, material, tipo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE mueble SET precio = $1, dimesiones = $2, id_color = $3, id_material = $4, id_tipo = $5 WHERE id_vendedor = $6 RETURNING *',
            [precio, dimensiones, color, material, tipo, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al modificar el Mueble' });
    }
};


const deleteMueble = async (req, res) => {
    const { id } = req.params;
    try {
		await pool.query('DELETE FROM mueble_proveedor WHERE id_mueble = $1', [id]);
        await pool.query('DELETE FROM mueble WHERE id_mueble = $1', [id]);
        res.status(200).json({ message: 'Mueble eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el mueble' });
    }
};

module.exports = {
    getMueble,
    addMueble,
    updateMueble,
    deleteMueble,
};