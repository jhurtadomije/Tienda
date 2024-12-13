const API_BASE_URL = "https://api.escuelajs.co/api/v1";

/**
 * Obtener todas las categorías
 * @returns {Promise<Array>} Lista de categorías
 */
export async function obtenerCategorias() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`Error al obtener categorías: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}

/**
 * Obtener productos de una categoría específica
 * @param {number} categoriaId - ID de la categoría
 * @returns {Promise<Array>} Lista de productos de la categoría
 */
export async function obtenerProductosPorCategoria(categoriaId, offset = 0, limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/products?categoryId=${categoriaId}&offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error al obtener productos por categoría: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        return [];
    }
}



/**
 * Obtener detalles de un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} - Detalles del producto
 */
export async function obtenerProductoPorId(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener producto: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw error;
    }
}

