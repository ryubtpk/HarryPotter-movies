const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
const db = new sqlite3.Database('./backend/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log(' Conectado a la base de datos SQLite');
    }
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS peliculas (
            id TEXT PRIMARY KEY,
            titulo TEXT,
            year TEXT,
            imagen TEXT,
            valoracion INTEGER CHECK(valoracion BETWEEN 1 AND 10)
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla:", err.message);
        } else {
            console.log("Tabla 'peliculas' creada ");
        }
    });
});

module.exports = db;
