document.addEventListener('DOMContentLoaded', () => {

    //variables y elementos
    let productos = [];
    let productosEnCarrito;

    const contenedorProductos = document.querySelector('.contenedor-productos');
    const botonesCategorias = document.querySelectorAll('.boton-categoria');
    const tituloPrincipal = document.querySelector('.titulo-principal');
    const numerito = document.querySelector(".numerito");
    let botonesAgregar;

    //funciones

    function cargarProductos(productosElegidos) {
        if (!productosElegidos || productosElegidos.length === 0) {
            contenedorProductos.innerHTML = `<p>No hay productos en esta categoría.</p>`;
            return;
        }

        contenedorProductos.innerHTML = '';
        productosElegidos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('producto');
            div.innerHTML = `
                <a href="producto.html?id=${producto.id}" class="producto-link">
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
                </a>
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.nombre}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <button class="producto-agregar" id="${producto.id}">Agregar</button>
                </div>
            `;
            contenedorProductos.append(div);
        });

        actualizarBotonesAgregar();
    }

    function actualizarBotonesAgregar() {
        botonesAgregar = document.querySelectorAll('.producto-agregar');
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    }

    function agregarAlCarrito(e) {
        const idBoton = parseInt(e.currentTarget.id);
        const productoAgregado = productos.find(producto => producto.id === idBoton);
        
        if (productosEnCarrito.some(producto => producto.id === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }
        
        localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
        alert(`Se agregó ${productoAgregado.nombre} al carrito`);
        actualizarNumerito();
    }

    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = nuevoNumerito;
    }

    //categorias

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesCategorias.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            if (e.currentTarget.id === "todos") {
                tituloPrincipal.innerText = 'Todos los productos';
                cargarProductos(productos);
            } else {
                const categoriaElegida = e.currentTarget.id;
                const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaElegida);
                tituloPrincipal.innerText = categoriaElegida;
                cargarProductos(productosFiltrados);
            }
        });
    });

    //carga de pagina

    const rutaArchivoJSON = './datos/productos.json';
    fetch(rutaArchivoJSON)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            cargarProductos(productos);
        })
        .catch(error => {
            console.error(`Error al cargar el archivo JSON:`, error);
            if (contenedorProductos) {
                contenedorProductos.innerHTML = `<p>Error al cargar los productos. Asegúrate de que el archivo 'productos.json' exista y esté en la ubicación correcta.</p>`;
            }
        });

    let productosEnCarritoLS = localStorage.getItem('productos-en-carrito');
    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
        actualizarNumerito();
    } else {
        productosEnCarrito = [];
    }

});