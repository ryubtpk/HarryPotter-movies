const API_URL = "http://localhost:3000/peliculas";

// Ocultar/Mostrar filtros
document.getElementById("toggleFilters").addEventListener("click", function () {
    const filterContainer = document.getElementById("filterContainer");
    filterContainer.classList.toggle("hidden"); 
});

// Obtener peliculas
async function obtenerPeliculas() {
    try {
        const response = await fetch(API_URL);
        const peliculas = await response.json();
        mostrarPeliculas(peliculas);
    } catch (error) {
        console.error("Error al obtener las películas:", error);
    }
}

// Filtrado Peliculas
async function buscarPeliculas() {
    const titulo = document.getElementById("search").value.trim();
    const year = document.getElementById("year").value.trim();
    const valoracion = document.getElementById("rating").value.trim();
    
    let url = API_URL + "/search?";
    if (titulo) url += `titulo=${encodeURIComponent(titulo)}&`;
    if (year) url += `year=${encodeURIComponent(year)}&`;
    if (valoracion) url += `valoracion=${encodeURIComponent(valoracion)}`;

    try {
        const response = await fetch(url);
        const peliculas = await response.json();
        mostrarPeliculas(peliculas);
    } catch (error) {
        console.error(" Error en la búsqueda:", error);
    }
}

//  Muestra las peliculas en la tabla
function mostrarPeliculas(peliculas) {
    const tabla = document.getElementById("peliculas-table");
    tabla.innerHTML = ""; 

    peliculas.forEach(pelicula => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${pelicula.imagen}" alt="${pelicula.titulo}" width="100"></td>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.year}</td>
            <td>${pelicula.valoracion}/10</td>
        `;
        tabla.appendChild(fila);
    });
}

window.onload = obtenerPeliculas;
