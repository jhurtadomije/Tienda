export function inicializarMenuHamburguesa() {
    const menuHamburguesa = document.getElementById("menu-hamburguesa");
    const navMenu = document.querySelector(".header__nav");

    if (menuHamburguesa && navMenu) {
        // Alternamos clase activo en el menú y actualizamos aria-expanded
        menuHamburguesa.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita cerrar inmediatamente tras abrir
            const isOpen = navMenu.classList.toggle("activo");
            menuHamburguesa.setAttribute("aria-expanded", isOpen.toString());
        });

        // Delegar evento para cerrar el menú al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && e.target !== menuHamburguesa) {
                navMenu.classList.remove("activo");
                menuHamburguesa.setAttribute("aria-expanded", "false");
            }
        });

        // Cerrar el menú al hacer clic en un enlace
        navMenu.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                navMenu.classList.remove("activo");
                menuHamburguesa.setAttribute("aria-expanded", "false");
            }
        });
    } else {
        console.error("Menú hamburguesa o navegación no encontrado.");
    }
}
