document.addEventListener("DOMContentLoaded", () => {
    const tablaSelect = document.getElementById("tabla");
    const tablaRegistros = document.getElementById("tabla-registros");
    const modal = document.getElementById("myModal");
    const span = modal.querySelector(".close");
    const formModificarContainer = document.getElementById("form-modificar-container");
    const formModificar = document.getElementById("form-modificar");
    const formContainer = document.getElementById("form-container");
    const formRegistro = document.getElementById("form-registro");
    const eliminarRegistroSelect = document.getElementById("eliminar-registro");

    tablaSelect.addEventListener("change", cargarRegistros);

    cargarRegistros();

    async function cargarRegistros() {
        const tabla = tablaSelect.value;
        try {
            const response = await axios.get(`http://localhost:5500/${tabla}`);
            const registros = response.data;
            
            tablaRegistros.querySelector("thead").innerHTML = "";
            tablaRegistros.querySelector("tbody").innerHTML = "";
            formContainer.innerHTML = "";

            if (registros.length > 0) {
                const cabecera = Object.keys(registros[0]);
                const thRow = document.createElement("tr");
                cabecera.forEach(campo => {
                    const th = document.createElement("th");
                    th.textContent = campo;
                    thRow.appendChild(th);
                });
                tablaRegistros.querySelector("thead").appendChild(thRow);
                
                registros.forEach(registro => {
                    const tr = document.createElement("tr");
                    cabecera.forEach(campo => {
                        const td = document.createElement("td");
                        td.textContent = registro[campo];
                        tr.appendChild(td);
                    });

                    const tdModificar = document.createElement("td");
                    const botonModificar = document.createElement("button");
                    botonModificar.textContent = "Modificar";
                    botonModificar.addEventListener("click", () => abrirModal(registro));
                    tdModificar.appendChild(botonModificar);
                    tr.appendChild(tdModificar);

                    tablaRegistros.querySelector("tbody").appendChild(tr);
                });

                cargarFormulario(registros[0], tabla);
                cargarEliminarRegistros(registros);
            }
        } catch (error) {
            console.error("Error al cargar los registros:", error);
        }
    }

    function abrirModal(registro) {
        registroAEditar = registro; 
        formModificarContainer.innerHTML = ""; 

        const cabecera = Object.keys(registro);
        cabecera.forEach(campo => {
            const div = document.createElement("div");
            const label = document.createElement("label");
            label.textContent = campo + ': ';
            const input = document.createElement("input");
            input.name = campo;
            input.value = registro[campo] || ''; // Rellenar con los datos del registro

            div.appendChild(label);
            div.appendChild(input);
            formModificarContainer.appendChild(div);
        });

        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    formModificar.onsubmit = async (e) => {
        e.preventDefault();
        
        const data = {};
        const cabecera = Object.keys(registroAEditar);
        
        cabecera.forEach(campo => {
            data[campo] = formModificar.querySelector(`[name=${campo}]`).value;
        });

        if (!registroAEditar.id) {
            alert("No se ha encontrado el ID del registro");
            return;
        }

        try {
            const id = registroAEditar.id;
            console.log(id);
            await axios.put(`http://localhost:5500/${tablaSelect.value}/${id}`, data);
            alert("Registro modificado correctamente");
            modal.style.display = "none"; // Cerrar el modal
            cargarRegistros(); // Recargar los registros después de la modificación
        } catch (error) {
            console.error("Error al modificar el registro:", error);
            alert("Error al modificar el registro");
        }
    }


    function cargarFormulario(registroEjemplo, tabla) {
    formContainer.innerHTML = "";
    const cabecera = Object.keys(registroEjemplo);

    cabecera.forEach(campo => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = campo + ': ';
        const input = document.createElement("input");
        input.name = campo;
        input.type = "text";
        input.value = '';

        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);
    });

    formRegistro.onsubmit = async (e) => {
        e.preventDefault();
        const data = {};
        cabecera.forEach(campo => {
            data[campo] = formContainer.querySelector(`[name=${campo}]`).value;
        });
		
        try {
                await axios.post(`http://localhost:5500/${tabla}`, data);
                alert("Registro creado");
                cargarRegistros();
        } catch (error) {
            console.error("Error al guardar el registro:", error);
            alert("Error al guardar el registro");
        }
    };
}

    function cargarEliminarRegistros(registros) {
        eliminarRegistroSelect.innerHTML = "<option value=''>Seleccionar registro</option>";
        registros.forEach(registro => {
            const option = document.createElement("option");
            option.value = registro.id;
            if (tablaSelect.value === "mueble") {
                option.textContent = `${registro.tipo} - ${registro.color} - ${registro.material}`;
            } else {
                option.textContent = registro.nombre;
            }
            eliminarRegistroSelect.appendChild(option);
        });
    }
    
    document.getElementById("eliminar").addEventListener("click", async () => {
        const id = eliminarRegistroSelect.value;
        console.log("ID seleccionado:", eliminarRegistroSelect.value);
        if (id) {
            const tabla = tablaSelect.value;
            try {
                await axios.delete(`http://localhost:5500/${tabla}/${id}`);
                alert("Registro eliminado");
                cargarRegistros();
            } catch (error) {
                console.error("Error al eliminar el registro:", error);
            }
        }
    });
});
