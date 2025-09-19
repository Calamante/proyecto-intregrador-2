//carga local storage
let productosEnCarrito = localStorage.getItem('productos-en-carrito');
productosEnCarrito = JSON.parse(productosEnCarrito);

//elementos
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
let botonesEliminar;

// funciones
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
       
        contenedorCarritoVacio.classList.add('disabled');
        contenedorProductos.classList.remove('disabled');
        contenedorCarritoAcciones.classList.remove('disabled');
        contenedorCarritoComprado.classList.add('disabled');
        contenedorProductos.innerHTML = ''; 

        productosEnCarrito.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('carrito-producto');
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3"></i></button>
            `;
            contenedorProductos.append(div);
        });
    } else {
        
        contenedorCarritoVacio.classList.remove('disabled');
        contenedorProductos.classList.add('disabled');
        contenedorCarritoAcciones.classList.add('disabled');
        contenedorCarritoComprado.classList.add('disabled');
    }
    actualizarBotonesEliminar();
    actualizarTotal();
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id);
    const productoExistente = productosEnCarrito.find(producto => producto.id === idBoton);

    if (productoExistente.cantidad > 1) {
        productoExistente.cantidad--;
    } else {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idBoton);
    }
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

function vaciarCarrito() {
    productosEnCarrito = []; 
    localStorage.removeItem('productos-en-carrito'); 
    cargarProductosCarrito(); 
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

function comprarCarrito() {
    productosEnCarrito = []; 
    localStorage.removeItem('productos-en-carrito'); 
    
    contenedorCarritoVacio.classList.add('disabled');
    contenedorProductos.classList.add('disabled');
    contenedorCarritoAcciones.classList.add('disabled');
    contenedorCarritoComprado.classList.remove('disabled');
}


if (botonVaciar) {
    botonVaciar.addEventListener('click', vaciarCarrito);
}
if (botonComprar) {
    botonComprar.addEventListener('click', comprarCarrito);
}


cargarProductosCarrito();