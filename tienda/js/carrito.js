/**
 * Mostrar el modal del carrito
 */
export function mostrarCarrito() {
    const modalCarrito = document.getElementById("modal-carrito");
    const carritoItems = document.getElementById("carrito-items");
    const carritoTotal = document.getElementById("carrito-total");

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carritoItems && carritoTotal) {
        // Generar el contenido del carrito
        carritoItems.innerHTML = carrito
            .map((item) => `
                <li>
                    ${item.title} x${item.cantidad} - ${(item.price * item.cantidad).toFixed(2)} €
                    <button class="btn-modificar" data-id="${item.id}" data-action="incrementar">+</button>
                    <button class="btn-modificar" data-id="${item.id}" data-action="decrementar">-</button>
                    <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
                </li>
            `)
            .join("");


        // Calcular y mostrar el total
        const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);
        carritoTotal.textContent = `Total: ${total.toFixed(2)} €`;

        // Mostrar el modal del carrito
        modalCarrito.style.display = "block";

        // Configurar eventos de modificación y eliminación
        configurarEventosCarrito();
    }else {
        console.error("No se encontraron los elementos del carrito.");
    }
}



/**
 * Cerrar el modal del carrito
 */
export function cerrarCarrito() {
    const modalCarrito = document.getElementById("modal-carrito");
    if (modalCarrito) {
        modalCarrito.style.display = "none";
    }
}

/**
 * Vaciar el carrito
 */
export function vaciarCarrito() {
    localStorage.removeItem("carrito");

    const modalCarrito = document.getElementById("modal-carrito");
    const carritoItems = document.getElementById("carrito-items");
    const carritoTotal = document.getElementById("carrito-total");

    if (carritoItems) carritoItems.innerHTML = "<li>No hay productos en el carrito.</li>";
    if (carritoTotal) carritoTotal.textContent = "Total: 0.00 €";

    alert("El carrito ha sido vaciado.");
}
/**
 * Agregar producto al carrito
 * @param {number} id - ID del producto
 * @param {string} title - Nombre del producto
 * @param {number} price - Precio del producto
 * @param {number} cantidad - Cantidad del producto a agregar
 */
export function agregarAlCarrito(id, title, price, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find((item) => item.id === id);

    if (productoExistente) {
        // Incrementar la cantidad si ya existe
        productoExistente.cantidad += cantidad;
    } else {
        // Agregar un nuevo producto
        carrito.push({ id, title, price, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${cantidad} unidad(es) de "${title}" añadida(s) al carrito.`);
}

/**
 * Modificar la cantidad de un producto
 * @param {number} id - ID del producto
 * @param {string} action - Acción ("incrementar" o "decrementar")
 */
function modificarCantidad(id, action) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = carrito.find((item) => item.id === id);

    if (producto) {
        if (action === "incrementar") {
            producto.cantidad++;
        } else if (action === "decrementar") {
            producto.cantidad--;
            if (producto.cantidad <= 0) {
                eliminarProducto(id);
                return;
            }
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    } else {
        console.error(`Producto con ID ${id} no encontrado en el carrito.`);
    }
}


/**
 * Eliminar un producto del carrito
 * @param {number} id - ID del producto
 */
function eliminarProducto(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const nuevoCarrito = carrito.filter((item) => item.id !== id);

    // Actualizar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    // Refrescar la interfaz del carrito
    mostrarCarrito();
}



/**
 * Configurar eventos dentro del carrito
 */
function configurarEventosCarrito() {
    const botonesModificar = document.querySelectorAll(".btn-modificar");
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesModificar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id, 10); // Convertir ID a número
            const action = e.target.dataset.action;
            modificarCantidad(id, action);
        });
    });

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id, 10); // Convertir ID a número
            eliminarProducto(id);
        });
    });
}


