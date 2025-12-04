const contenedor_personajes = document.getElementById("contenedor_personajes")

const API_URL = "https://rickandmortyapi.com/api/character/?name=morty&status=alive"

let personajesTotal = [];

async function cargarPersonajes() {
    try {
        const response = await fetch(API_URL);
        const personajes = await response.json(); 

        personajesTotal = personajes;
        mostrarPersonajes(personajesTotal);
    } catch (error) {
        console.log("Error al cargar los productos", error)
    }
}

function mostrarPersonajes(personajes) {

    personajes.results.forEach(personaje => {
        const contenedor_personaje = document.createElement("div")
        contenedor_personaje.classList.add("contenedor_personaje")
        
        const img = document.createElement("img")
        img.setAttribute("src", personaje.image);
        img.setAttribute("alt", personaje.title);
        img.classList.add("imagen_personaje")

        const nombre = document.createElement("span");
        nombre.className.add("nombre_span")
        nombre.textContent = personaje.name

        const status = document.createElement("span")
        status.className.add("status_span")
        status.textContent = `Estado: ${personaje.status}`

        contenedor_personaje.appendChild(img)
        contenedor_personaje.appendChild(nombre)
        contenedor_personaje.appendChild(status)

        contenedor_personajes.appendChild(contenedor_personaje)
    });
}

cargarPersonajes()