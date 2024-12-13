import { inicializarMenuHamburguesa } from './hamburguesa.js';
import { mostrarCarrito, cerrarCarrito, vaciarCarrito } from './carrito.js';



window.onload = () => {
    inicializarMenuHamburguesa();
    inicializarEventosCarrito();
    inicializarEventosHero();
};

/**
 * Configuramos eventos del carrito.
 */
function inicializarEventosCarrito() {
    const abrirCarritoBtn = document.getElementById("abrir-carrito");
    const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

    if (abrirCarritoBtn) {
        abrirCarritoBtn.addEventListener("click", (e) => {
            mostrarCarrito();
        });
    }

    if (cerrarCarritoBtn) {
        cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    }
}

/**
 * Configurar eventos en las tarjetas del Hero
 */
function inicializarEventosHero() {
    const heroCards = document.querySelectorAll(".hero__cards .card");
    const loadingGif = document.getElementById("loading");

    if (heroCards.length === 0) {
        mostrarError("No se encontraron tarjetas en el Hero.");
        return;
    }

    heroCards.forEach((card) => {
        card.addEventListener("click", (e) => manejarClickTarjetaHero(e, card, loadingGif));
    });
}

/**
 * Manejar clic en tarjetas del Hero
 */
function manejarClickTarjetaHero(event, card, loadingGif) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    const categoriaId = card.dataset.id;

    if (!categoriaId) {
        mostrarError("El atributo data-id no está configurado en esta tarjeta.");
        return;
    }

    mostrarCarga(loadingGif);

    // Redirigir a la página de categorías con la categoría especificada
    setTimeout(() => {
        ocultarCarga(loadingGif);
        window.location.href = `categorias.html`;
    }, 300);
}

/**
 * Mostrar GIF de carga
 */
function mostrarCarga(elemento) {
    if (elemento) {
        elemento.classList.remove("oculto");
    }
}

/**
 * Ocultar GIF de carga
 */
function ocultarCarga(elemento) {
    if (elemento) {
        elemento.classList.add("oculto");
    }
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    console.error(mensaje);
    alert(mensaje);
}
