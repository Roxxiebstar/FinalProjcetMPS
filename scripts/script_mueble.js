document.addEventListener('DOMContentLoaded', async () => {
    await cargarMuebles();
    await cargarSelect('color', 'http://localhost:5500/muebleC');
    await cargarSelect('material', 'http://localhost:5500/muebleM');
    await cargarSelect('tipo', 'http://localhost:5500/muebleT', true);
    document.getElementById('formMueble').addEventListener('submit', registrarMueble);
});

const eliminarRegistroSelect = document.getElementById("eliminar-registro");

async function cargarSelect(id, url) {
    const select = document.getElementById(id) || document.querySelector(`.${id}`);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar ${id}`);
        const data = await response.json();

        const options = data.map(item => 
            `<option value="${item.id}">
                ${item.nombre}
            </option>`
        ).join('');
        
        select.innerHTML = `<option value="">Seleccione una opción</option>` + options;
    } catch (error) {
        console.error(error);
        alert(`No se pudo cargar ${id}`);
    }
}

async function registrarMueble(event) {
    event.preventDefault();
    const precio = document.getElementById('precio').value;
    const altura = document.getElementById('altura').value;
    const ancho = document.getElementById('ancho').value;
    const profundidad = document.getElementById('profundidad').value;
    const color = document.getElementById('color').value;
    const material = document.getElementById('material').value;
    const tipo = document.getElementById('tipo').value;

    const mueble = { precio, altura, ancho, profundidad, color, material, tipo };
    console.log("Datos del Mueble:", mueble);

    try {
        const response = await fetch('http://localhost:5500/mueble', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mueble),
        });

        if (response.ok) {
            alert('Mueble registrado con éxito');
            cargarMuebles()
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Error al registrar el mueble');
    }
}

async function cargarMuebles() {
    try {
        const response = await fetch('http://localhost:5500/mueble');
        if (!response.ok) throw new Error('Error al obtener los muebles');
        const muebles = await response.json();
        const tbody = document.getElementById('muebleTable').getElementsByTagName('tbody')[0];
        
        tbody.innerHTML = '';
        formContainer.innerHTML = "";

        muebles.forEach(mueble => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = mueble.id;
            row.insertCell(1).textContent = mueble.precio;
            row.insertCell(2).textContent = mueble.dimensiones;
            row.insertCell(3).textContent = mueble.color;
            row.insertCell(4).textContent = mueble.material;
            row.insertCell(5).textContent = mueble.tipo;
        });
        cargarEliminarRegistros(muebles);

    } catch (error) {
        console.error(error);
        alert('Error al cargar los muebles');
    }
}

function cargarEliminarRegistros(registros) {
    eliminarRegistroSelect.innerHTML = "<option value=''>Seleccionar registro</option>";
    registros.forEach(registro => {
        const option = document.createElement("option");
        option.value = registro.id;
        option.textContent = `${registro.tipo} - ${registro.color} - ${registro.material}`;
        eliminarRegistroSelect.appendChild(option);
    });
}

document.getElementById("eliminar").addEventListener("click", async () => {
    const id = eliminarRegistroSelect.value;
    console.log("ID seleccionado:", eliminarRegistroSelect.value);
    if (id) {
        try {
            await axios.delete(`http://localhost:5500/mueble/${id}`);
            alert("Registro eliminado");
            cargarMuebles();
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
        }
    }
});