const input_busqueda = document.getElementById("div__input");
const boton_buscar = document.getElementById("div__boton");
const seccionBusqueda = document.getElementById("section__busqueda");
const seccionTareas = document.getElementById("section__tareas");

let tareasTotal = [];

const API_URL = `https://693393c24090fe3bf01d804d.mockapi.io/api/v1`;

async function fetchAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${API_URL}/${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al cargar los datos", error);
    }
}

async function agregarTarea(nombreTarea) {
    try {
        const nuevaTarea = {
            name: nombreTarea,
            completed: false
        }

        const tareaCreada = await fetchAPI('tasks', 'POST', nuevaTarea);
        return tareaCreada;
    } catch (error) {
        console.log("Error al agregar la tarea", error);
    }
}

async function cargarTareas() {
    try {
        const tareas = await fetchAPI('tasks');
        tareasTotal = tareas;
        mostrarTareas(tareasTotal);
        return tareasTotal;
    } catch (error) {
        console.log("Error al mostrar las tareas", error);
    }
}

async function editarTarea(id, estado) {
    try {
        const datos = {
            isCompleted: !estado
        }
        const tareaEditada = await fetchAPI(`tasks/${id}`, 'PUT', datos);
        const index = tareasTotal.findIndex(tarea => tarea.id === id);
        if (index !== -1) {
            tareasTotal[index] = tareaEditada;
        }
    } catch (error) {
        console.log("Error al editar la tarea", error);
    }
}

async function borrarTarea(id) {
    const respuesta = await fetchAPI(`tasks/${id}`, "DELETE");

    if (respuesta) {
        tareasTotal = tareasTotal.filter(tarea => tarea.id !== id);
    }
}

function mostrarTareas(tareas) {
    tareas.forEach(tarea => {
        const contenedor_tarea = document.createElement("div")
        const nombreTarea = document.createElement("span");
        nombreTarea.textContent = tarea.name;
        const completar_button = document.createElement("button");
        const borrar_button = document.createElement("button");
        contenedor_tarea.appendChild(nombreTarea);
        contenedor_tarea.appendChild(completar_button);
        contenedor_tarea.appendChild(borrar_button);
        seccionTareas.appendChild(contenedor_tarea);
    })
}

cargarTareas();