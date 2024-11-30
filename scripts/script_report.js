document.getElementById('queryForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const mes = +document.getElementById('mes').value;
    const year = +document.getElementById('year').value;
    const consulta = document.getElementById('consultaSelect').value;

    try {
        const response = await fetch(`http://localhost:5500/reporte?consulta=${consulta}&mes=${mes}&year=${year}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
            renderTable(data);
        } else {
            console.error(data.error || 'Error al obtener datos');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
});

function renderTable(data) {
    const tableHead = document.querySelector('#resultsTable thead tr');
    const tableBody = document.querySelector('#resultsTable tbody');

    // Limpiar la tabla
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 999;
        cell.textContent = 'No hay resultados para los parámetros seleccionados.';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    // Generar encabezados dinámicos
    const keys = Object.keys(data[0]);
    keys.forEach((key) => {
        const th = document.createElement('th');
        th.textContent = key;
        tableHead.appendChild(th);
    });

    // Generar filas dinámicas
    data.forEach((row) => {
        const tr = document.createElement('tr');
        keys.forEach((key) => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
