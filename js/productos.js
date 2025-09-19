document.addEventListener('DOMContentLoaded', () => {

    const contenedorProductoDetalle = document.querySelector('.contenedor-producto-detalle');
    let productos;

    const rutaArchivoJSON = './datos/productos.json';

    // obtener producto
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(urlParams.get('id'));

    fetch(rutaArchivoJSON)
        .then(response => response.json())
        .then(data => {
            productos = data;
            const productoElegido = productos.find(producto => producto.id === idProducto);

            if (productoElegido) {
                cargarDetallesProducto(productoElegido);
            } else {
                contenedorProductoDetalle.innerHTML = `<p>Producto no encontrado.</p>`;
            }
        })
        .catch(error => {
            console.error(`Error al cargar el archivo JSON:`, error);
            contenedorProductoDetalle.innerHTML = `<p>Error al cargar los productos.</p>`;
        });

  function cargarDetallesProducto(producto) {
    const imagenProducto = document.getElementById('imagen-producto');
    const nombreProducto = document.getElementById('nombre-producto');
    const precioProducto = document.getElementById('precio-producto');
    const descripcionProducto = document.getElementById('descripcion-producto');
    const botonAgregar = document.getElementById('agregar-producto-detalle');

    if (imagenProducto) {
        imagenProducto.src = producto.imagen;
    }
    if (nombreProducto) {
        nombreProducto.innerText = producto.nombre;
    }
    if (precioProducto) {
        precioProducto.innerText = `$${producto.precio}`;
    }
    if (descripcionProducto) {
        descripcionProducto.innerText = producto.descripcion;
    }
    if (botonAgregar) {
        botonAgregar.id = producto.id;
    }
}

 function actualizarNumerito() {
        // Asegúrate de que 'numerito' esté definido aquí
        const numerito = document.querySelector(".numerito"); 
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = nuevoNumerito;
    }

    // agregar
    let productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];

    const botonAgregarProductoDetalle = document.getElementById('agregar-producto-detalle');
    if (botonAgregarProductoDetalle) {
        botonAgregarProductoDetalle.addEventListener('click', (e) => {
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
        });
    }
});