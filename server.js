const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const vendedorRoutes = require('./routes/vendedor');
const clienteRoutes = require('./routes/cliente');
const muebleRoutes = require('./routes/mueble');
const proveedorRoutes = require('./routes/proveedor');
const ventaRoutes = require('./routes/venta')

app.use(vendedorRoutes);
app.use(clienteRoutes);
app.use(muebleRoutes);
app.use(proveedorRoutes);
app.use(ventaRoutes);

app.listen(5500, () => {
    console.log('Servidor corriendo en http://localhost:5500');
});

