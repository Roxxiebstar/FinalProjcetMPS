const pool = require('../db');


const obtenerVentas = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM viewVenta`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

const crearVenta = async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);

    const { id_cliente, id_vendedor, total, muebles } = req.body;

    if (!id_cliente || !id_vendedor || !total || !muebles) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud' });
    }

    try {
        // Insertar la venta principal
        const ventaResult = await pool.query(
            'INSERT INTO venta (id_cliente, id_vendedor, total, fecha) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *',
            [id_cliente, id_vendedor, total]
        );

        console.log('Venta creada:', ventaResult.rows[0]);

        // Insertar los muebles asociados
        for (const mueble of muebles) {
            await pool.query(
                'INSERT INTO venta_mueble (id_mueble, id_venta, cantidad) VALUES ($1, $2, $3)',
                [mueble.id_mueble, ventaResult.rows[0].id_venta, mueble.cantidad]
            );
            console.log(`Mueble ${mueble.id_mueble} insertado para la venta ${ventaResult.rows[0].id_venta}`);
        }

        res.status(201).json({ message: 'Venta registrada exitosamente' });
    } catch (error) {
        console.error('Error al crear la venta:', error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};



module.exports = { obtenerVentas, crearVenta };
