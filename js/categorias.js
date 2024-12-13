import { inicializarMenuHamburguesa } from './hamburguesa.js';
import { mostrarCarrito, cerrarCarrito, vaciarCarrito, agregarAlCarrito} from './carrito.js';
import { obtenerCategorias, obtenerProductosPorCategoria } from './api.js';

window.onload = async () => {
    inicializarMenuHamburguesa();

    const categoriaId = obtenerParametroURL("categoria");
    if (categoriaId) {
        await mostrarProductosPorCategoria(categoriaId);
        inicializarScrollInfinito(categoriaId);
    } else {
        await mostrarCategorias();
    }

    inicializarEventosGlobales();
};

/**
 * Inicializar eventos globales
 */
function inicializarEventosGlobales() {
    const abrirCarrito = document.getElementById("abrir-carrito");
    const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

    if (abrirCarrito) {
        abrirCarrito.addEventListener("click", mostrarCarrito);
    }

    if (cerrarCarritoBtn) {
        cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    }

    // Cerrar modal de detalles
    const cerrarModalBtn = document.getElementById("cerrar-modal");
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener("click", cerrarModal);
    }
}

/**
 * Obtener un parámetro de la URL
 * @param {string} parametro - Nombre del parámetro
 * @returns {string | null} Valor del parámetro
 */
function obtenerParametroURL(parametro) {
    const params = new URLSearchParams(window.location.search);
    return params.get(parametro);
}


const traduccionesCategorias = {
    "Clothes": "Ropa",
    "Electronics": "Electrónica",
    "Change title": "Hogar",
    "Shoes": "Zapatos",
    "Miscellaneous": "Varios"
};
/**
 * Mostrar todas las categorías
 */
async function mostrarCategorias() {
    const appContainer = document.getElementById("productos-grid");

    if (!appContainer) {
        console.error("Error: No se encontró el contenedor con id 'productos-grid'.");
        return;
    }

    appContainer.innerHTML = "<p>Cargando categorías...</p>";

    try {
        const categorias = await obtenerCategorias();
        const categoriasValidas = categorias.filter(categoria =>
            ["Clothes", "Electronics", "Change title", "Shoes", "Miscellaneous"].includes(categoria.name)
        );

        if (categoriasValidas.length === 0) {
            appContainer.innerHTML = "<p>No se encontraron categorías disponibles.</p>";
            return;
        }

        const categoriasHTML = categoriasValidas.map(categoria => `
            <div class="categoria-card">
                <img src="${categoria.image}" alt="${categoria.name}">
                <h3>${traduccionesCategorias[categoria.name]}</h3>
                <a href="categorias.html?categoria=${categoria.id}" class="btn-ver-productos">Ver productos</a>
            </div>
        `).join("");

        appContainer.innerHTML = categoriasHTML;
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        appContainer.innerHTML = "<p>Error al cargar categorías. Por favor, inténtalo más tarde.</p>";
    }
}

async function asignarEventosInfo(productos) {
    const botonesInfo = document.querySelectorAll(".btn-info");
    if (!botonesInfo.length) {
        console.error("No se encontraron botones 'Info'.");
        return;
    }

    botonesInfo.forEach(boton =>
        boton.addEventListener("click", e => {
            const id = parseInt(e.target.dataset.id, 10);
            const producto = productos.find(p => p.id === id);
            if (producto) {
                mostrarDetallesProducto(producto);
            } else {
                console.error(`Producto con ID ${id} no encontrado.`);
            }
        })
    );
}


/**
 * Mostrar detalles del producto
 */
function mostrarDetallesProducto(producto) {
    const modal = document.getElementById("modal-detalles");
    const modalImagen = document.getElementById("modal-imagen");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalDescripcion = document.getElementById("modal-descripcion");
    const modalPrecio = document.getElementById("modal-precio");
    const modalCantidad = document.getElementById("modal-cantidad");
    const modalAgregarCarrito = document.getElementById("modal-agregar-carrito");

    if (!modal || !modalImagen || !modalTitulo || !modalDescripcion || !modalPrecio) {
        console.error("No se encontraron los elementos necesarios del modal.");
        return;
    }

    modalImagen.src = producto.images?.[0] || "./imagenes/notFound.png";
    modalTitulo.textContent = producto.title;
    modalDescripcion.textContent = producto.description;
    modalPrecio.textContent = `Precio: ${producto.price} €`;
    modalCantidad.value = 1;

    modal.classList.add("activo");

    modalAgregarCarrito.onclick = () => {
        const cantidad = parseInt(modalCantidad.value, 10);
        if (cantidad > 0) {
            agregarAlCarrito(producto.id, producto.title, producto.price, cantidad);
            cerrarModal();
        } else {
            alert("Por favor, selecciona una cantidad válida.");
        }
    };

}


function cerrarModal() {
    const modal = document.getElementById("modal-detalles");
    if (modal) {
        modal.classList.remove("activo");
    }
}

/**
 * Mostrar productos por categoría
 */
let offset = 0;
const limit = 10;
let cargando = false;

async function mostrarProductosPorCategoria(categoriaId) {
    const appContainer = document.getElementById("productos-grid");
    if (!appContainer) {
        console.error("Error: No se encontró el contenedor.");
        return;
    }

    const gifCargando = document.getElementById("loading");
    if (gifCargando) gifCargando.style.display = "block";

    try {
        const productos = await obtenerProductosPorCategoria(categoriaId, offset, limit);

        if (gifCargando) gifCargando.style.display = "none";

        if (productos.length === 0 && offset === 0) {
            appContainer.innerHTML = "<p>No se encontraron productos en esta categoría.</p>";
            return;
        }

        const productosHTML = productos.map((producto) => {
            // Verificar si existe una imagen válida
            const imagen = producto.images?.[0] || "./imagenes/notFound.png";

            return `
                <div class="producto-card">
                    <img src="${imagen}" alt="${producto.title}">
                    <h3>${producto.title}</h3>
                    <p>${producto.price.toFixed(2)} €</p>
                    <button class="btn-info" data-id="${producto.id}">Info</button>
                    <button class="btn-agregar-carrito" data-id="${producto.id}" data-title="${producto.title}" data-price="${producto.price}">
                        Añadir al carrito
                    </button>
                </div>
                `;
        }).join("");

        appContainer.innerHTML += productosHTML;

        offset += limit;

        // Asignar eventos a los nuevos botones
        document.querySelectorAll(".btn-info").forEach(boton => {
            boton.addEventListener("click", async (e) => {
                const id = parseInt(e.target.dataset.id, 10);
                const producto = productos.find(p => p.id === id);
                if (producto) {
                    mostrarDetallesProducto(producto);
                } else {
                    console.error(`Producto con ID ${id} no encontrado.`);
                }
            });
        });

        document.querySelectorAll(".btn-agregar-carrito").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id, 10);
                const title = e.target.dataset.title;
                const price = parseFloat(e.target.dataset.price);
                agregarAlCarrito(id, title, price);
            });
        });
    }
    catch (error) {
        console.error("Error al cargar productos por categoría:", error);
        if (gifCargando) gifCargando.style.display = "none";
        appContainer.innerHTML = "<p>Error al cargar productos. Por favor, inténtalo más tarde.</p>";
    } finally {
        cargando = false;
    }
}

/**
 * Inicializar scroll infinito
 */
function inicializarScrollInfinito(categoriaId) {
    window.addEventListener("scroll", async () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 80 && !cargando) {
            cargando = true;
            await mostrarProductosPorCategoria(categoriaId);
        }
    });
}


/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");
    notificacion.textContent = mensaje;
    notificacion.classList.add("notificacion");
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}
