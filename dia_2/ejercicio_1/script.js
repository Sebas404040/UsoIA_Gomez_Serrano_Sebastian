const input_busqueda = document.getElementById("div__input");
const boton_agregar = document.getElementById("div__button");
const seccionBusqueda = document.getElementById("section__busqueda");
const seccionTareas = document.getElementById("section__tareas");
const boton_borrar = document.getElementById("div__deleteButton");

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

async function agregarTarea() {
    try {
        const inputValor = input_busqueda.value;
        input_busqueda.value = '';
        if (inputValor.trim() === '') {
            return alert("El nombre de la tarea no puede estar vacía");
        }
        const nuevaTarea = {
            name: inputValor,
            completed: false
        }

        const tareaCreada = await fetchAPI('tasks', 'POST', nuevaTarea);
        if (tareaCreada) {
            tareasTotal.push(tareaCreada);
        }
        mostrarTareas([tareaCreada]);
    } catch (error) {
        console.log("Error al agregar la tarea", error);
    }
}

async function cargarTareas() {
    try {
        const tareas = await fetchAPI('tasks');
        tareasTotal = tareas;
        mostrarTareas(tareasTotal);
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
        contenedor_tarea.classList.add("div__taskContainer");

        const nombreTarea = document.createElement("span");
        nombreTarea.classList.add("span__taskName")
        nombreTarea.textContent = tarea.name;

        const completar_button = document.createElement("img");
        completar_button.setAttribute("src", "./icons/complete.png");
        completar_button.setAttribute("alt", "completar tarea");
        completar_button.classList.add("img__buttons");

        const borrar_button = document.createElement("img");
        borrar_button.setAttribute("src", "./icons/delete.png");
        borrar_button.setAttribute("alt", "borrar tarea");
        borrar_button.classList.add("img__buttons");

        contenedor_tarea.appendChild(nombreTarea);
        contenedor_tarea.appendChild(borrar_button);
        contenedor_tarea.appendChild(completar_button);
        seccionTareas.appendChild(contenedor_tarea);
    })
}

boton_agregar.addEventListener("click", agregarTarea)

cargarTareas();