const axios = require('axios');
const db = require('./database');

const API_KEY = '731e41f';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=Harry%20Potter&type=movie`;

//  obtiene los datos y guardar en la base de datos
async function obtenerPeliculasHarryPotter() {
    try {
        console.log("🔍 Consultando API de OMDb...");

        // Llamada a la API 
        const respuesta = await axios.get(API_URL);

        if (respuesta.data.Response === "True") {
            const peliculas = respuesta.data.Search;

            peliculas.forEach((pelicula) => {
                const id = pelicula.imdbID;
                const titulo = pelicula.Title;
                const year = pelicula.Year;
                const imagen = pelicula.Poster;
                const valoracion = Math.floor(Math.random() * 10) + 1; // Valoracio de 1 y 10

                
                db.get("SELECT * FROM peliculas WHERE id = ?", [id], (err, row) => {
                    if (err) {
                        console.error(`❌ Error al consultar ${titulo}:`, err);
                        return;
                    }

                    if (!row) {
                        
                        db.run(
                            `INSERT INTO peliculas (id, titulo, year, imagen, valoracion) 
                            VALUES (?, ?, ?, ?, ?)`,
                            [id, titulo, year, imagen, valoracion],
                            (err) => {
                                if (err) {
                                    console.error(`Error al insertar ${titulo}:`, err);
                                } else {
                                    console.log(`✅ Película guardada en BD: ${titulo} `);
                                }
                            }
                        );
                    } else {
                        console.log(`La película ya existe en BD: ${titulo}`);
                    }
                });
            });
        } else {
            console.error('Error al obtener los  datos de la API:', respuesta.data.Error);
        }
    } catch (error) {
        console.error('Error en la solicitud a la API:', error);
    }
}


obtenerPeliculasHarryPotter();

module.exports = obtenerPeliculasHarryPotter;
