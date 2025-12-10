document.addEventListener('DOMContentLoaded', () => {

    const seccionProductos = document.getElementById("main__container")
    let productosTotal = [];
    const API_URL = `https://693316e6e5a9e342d271e285.mockapi.io/api/v1`;
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

    async function cargarProductos() {
        try {
            const productos = await fetchAPI('tasks');
            productosTotal = productos;
            mostrarProductos(productosTotal);
        } catch (error) {
            console.log("Error al mostrar los productos", error);
        }
    }

    async function editarProducto(id, updatedData) {
        try {
            const productoActualizado = await fetchAPI(`tasks/${id}`, 'PUT', updatedData);
            const index = productosTotal.findIndex(producto => producto.id === id);
            if (index !== -1) {
                productosTotal[index] = productoActualizado;
                mostrarProductos(productosTotal);
            }
        } catch (error) {
            console.log("Error al editar el producto", error);
        }
    }

    async function eliminarProducto(id) {
        try {
            const respuesta = await fetchAPI(`tasks/${id}`, 'DELETE');
            if (respuesta) {
                productosTotal = productosTotal.filter(producto => producto.id !== id);
                mostrarProductos(productosTotal);
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }

    function mostrarProductos(productos) {
        seccionProductos.innerHTML = '';
        productos.forEach(producto => {
            const divContainer = document.createElement('div');
            divContainer.classList.add('product__card');

            const nombreProducto = document.createElement('h3');
            nombreProducto.textContent = producto.name;
            nombreProducto.classList.add('product__name');

            const descripcionProducto = document.createElement('p');
            descripcionProducto.textContent = producto.description;
            descripcionProducto.classList.add('product__description');

            const precioProducto = document.createElement('p');
            precioProducto.textContent = producto.price;
            precioProducto.classList.add('product__price');

            const categoriaProducto = document.createElement('p');
            categoriaProducto.textContent = producto.category;
            categoriaProducto.classList.add('product__category');

            const stockProducto = document.createElement('p');
            stockProducto.textContent = producto.inStock ? 'En stock' : 'Agotado';
            stockProducto.classList.add('product__stock');

            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.image;
            imagenProducto.alt = producto.name;
            imagenProducto.classList.add('product__image');

            divContainer.appendChild(imagenProducto);
            divContainer.appendChild(nombreProducto);
            divContainer.appendChild(descripcionProducto);
            divContainer.appendChild(precioProducto);
            divContainer.appendChild(categoriaProducto);
            divContainer.appendChild(stockProducto);
            seccionProductos.appendChild(divContainer);
        });
    }

    cargarProductos();
});

