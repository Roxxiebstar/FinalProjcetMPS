document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    await cargarVentas();

    await cargarSelect('cliente', 'http://localhost:5500/cliente');
    await cargarSelect('vendedor', 'http://localhost:5500/vendedor');
    await cargarSelect('mueble', 'http://localhost:5500/mueble', true);

    document.getElementById('agregarMueble').addEventListener('click', agregarMueble);

    document.getElementById('formVenta').addEventListener('input', calcularTotal);

    document.getElementById('formVenta').addEventListener('submit', registrarVenta);
});

async function cargarSelect(id, url, isMueble = false) {
    const select = document.getElementById(id) || document.querySelector(`.${id}`);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar ${id}`);
        const data = await response.json();

        const options = data.map(item => 
            `<option value="${item.id}" data-precio="${item.precio || 0}">
                ${item.nombre || item.tipo}
            </option>`
        ).join('');

        if (isMueble) {
            document.querySelector('.mueble').innerHTML = options;
        } else {
            select.innerHTML = `<option value="">Seleccione una opción</option>` + options;
        }
    } catch (error) {
        console.error(error);
        alert(`No se pudo cargar ${id}`);
    }
}


function agregarMueble() {
    const container = document.getElementById('mueblesContainer');
    const row = document.createElement('div');
    row.classList.add('muebleRow');
    row.innerHTML = `
        <select class="mueble" name="mueble[]" required>
            ${document.querySelector('.mueble').innerHTML}
        </select>
        <input type="number" name="cantidad[]" placeholder="Cantidad" min="1" required>
    `;
    container.appendChild(row);

    calcularTotal()
}

function calcularTotal() {
    const muebles = [...document.querySelectorAll('.muebleRow')];
    let total = 0;

    muebles.forEach(row => {
        const muebleSelect = row.querySelector('.mueble');
        const cantidad = parseInt(row.querySelector('[name="cantidad[]"]').value || 0, 10);
        const precio = parseFloat(muebleSelect.options[muebleSelect.selectedIndex]?.dataset?.precio || 0);

        if (!isNaN(cantidad) && !isNaN(precio)) {
            total += cantidad * precio;
        }
    });

    document.getElementById('total').textContent = total.toFixed(2);
}

document.getElementById('mueblesContainer').addEventListener('input', calcularTotal);
document.getElementById('mueblesContainer').addEventListener('change', calcularTotal);

async function registrarVenta(event) {
    event.preventDefault();
    const cliente = document.getElementById('cliente').value;
    const vendedor = document.getElementById('vendedor').value;
    const fecha = document.getElementById('fecha').value;

    const muebles = [...document.querySelectorAll('.muebleRow')].map(row => ({
        id_mueble: row.querySelector('.mueble').value,
        cantidad: row.querySelector('[name="cantidad[]"]').value
    }));

    const total = parseFloat(document.getElementById('total').textContent).toFixed(2);
    console.log(muebles);

    const venta = { id_cliente: cliente, id_vendedor: vendedor, fecha, total, muebles };
    console.log("Datos de la venta:", venta);

    try {
        const response = await fetch('http://localhost:5500/venta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(venta),
        });

        if (response.ok) {
            alert('Venta registrada con éxito');
            cargarVentas()
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Error al registrar la venta');
    }
}

async function cargarVentas() {
    try {
        const response = await fetch('http://localhost:5500/venta');
        if (!response.ok) throw new Error('Error al obtener las ventas');
        const ventas = await response.json();
        const tbody = document.getElementById('ventasTable').getElementsByTagName('tbody')[0];
        
        tbody.innerHTML = '';

        // Agregar una fila por cada venta
        ventas.forEach(venta => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = venta.id;
            row.insertCell(1).textContent = venta.cliente;
            row.insertCell(2).textContent = venta.vendedor;
            row.insertCell(3).textContent = venta.fecha;
            row.insertCell(4).textContent = venta.total;
            row.insertCell(5).textContent = venta.cantidad;
            row.insertCell(6).textContent = venta.tipo;
        });
    } catch (error) {
        console.error(error);
        alert('Error al cargar las ventas');
    }
}