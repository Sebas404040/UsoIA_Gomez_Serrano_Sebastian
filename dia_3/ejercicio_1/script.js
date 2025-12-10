document.addEventListener('DOMContentLoaded', () => {

    const seccionProductos = document.getElementById("main__container");
    const modal = document.getElementById('edit-modal');
    const closeButton = document.querySelector('.close-button');
    const editForm = document.getElementById('edit-form');
    const editProductId = document.getElementById('edit-product-id');
    const editName = document.getElementById('edit-name');
    const editDescription = document.getElementById('edit-description');
    const editPrice = document.getElementById('edit-price');
    const editCategory = document.getElementById('edit-category');
    const editImage = document.getElementById('edit-image');
    const editInStock = document.getElementById('edit-inStock');

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

    function abrirModalEdicion(id) {
        const producto = productosTotal.find(p => p.id === id);
        if (producto) {
            editProductId.value = producto.id;
            editName.value = producto.name;
            editDescription.value = producto.description;
            editPrice.value = parseFloat(producto.price);
            editCategory.value = producto.category;
            editImage.value = producto.image;
            editInStock.checked = producto.inStock;
            modal.style.display = 'block';
        }
    }

    function cerrarModal() {
        modal.style.display = 'none';
    }

    closeButton.addEventListener('click', cerrarModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            cerrarModal();
        }
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = editProductId.value;
        const updatedData = {
            name: editName.value,
            description: editDescription.value,
            price: editPrice.value,
            category: editCategory.value,
            image: editImage.value,
            inStock: editInStock.checked,
        };

        try {
            const productoActualizado = await fetchAPI(`tasks/${id}`, 'PUT', updatedData);
            const index = productosTotal.findIndex(producto => producto.id === id);
            if (index !== -1) {
                productosTotal[index] = productoActualizado;
                mostrarProductos(productosTotal);
                cerrarModal();
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    });

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
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
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

            const divButtons = document.createElement('div');
            divButtons.classList.add('div__buttons');

            const editarButton = document.createElement('button');
            editarButton.textContent = 'Editar';
            editarButton.classList.add('button__edit');
            editarButton.addEventListener('click', () => abrirModalEdicion(producto.id));

            const eliminarButton = document.createElement('button');
            eliminarButton.textContent = 'Eliminar';
            eliminarButton.classList.add('button__delete');
            eliminarButton.addEventListener('click', () => eliminarProducto(producto.id));

            divContainer.appendChild(imagenProducto);
            divContainer.appendChild(nombreProducto);
            divContainer.appendChild(descripcionProducto);
            divContainer.appendChild(precioProducto);
            divContainer.appendChild(categoriaProducto);
            divContainer.appendChild(stockProducto);
            divButtons.appendChild(editarButton);
            divButtons.appendChild(eliminarButton);
            divContainer.appendChild(divButtons);
            seccionProductos.appendChild(divContainer);
        });
    }

    cargarProductos();
});
