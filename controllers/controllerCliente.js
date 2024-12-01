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
	console.log(req.body);
    const { nombre, correo, direccion, telefonos } = req.body;	
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

    
        const clienteResult = await client.query(
            'INSERT INTO cliente (nombre, correo, direccion) VALUES ($1, $2, $3) RETURNING *',
            [nombre, correo, direccion]
        );

        const cliente = clienteResult.rows[0];
        console.log('Cliente agregado:', cliente);


        const telefonoResult = await client.query(
            'INSERT INTO cliente_telefono (id_cliente, telefono) VALUES ($1, $2) RETURNING *',
            [cliente.id_cliente, telefonos]
        );

        const telefonoData = telefonoResult.rows[0];
        console.log(`Teléfono ${telefonos} agregado al cliente ${cliente.id_cliente}`);

        await client.query('COMMIT');

        res.status(201).json({
            cliente,
            telefono: telefonoData,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el cliente y su teléfono' });
    } finally {
        client.release();
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
        await pool.query('DELETE FROM cliente_telefono WHERE id_cliente = $1', [id]);
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