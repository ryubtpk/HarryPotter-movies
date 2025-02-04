const express = require('express');
const cors = require('cors');
const path = require('path'); 
const db = require('./database');
const obtenerPeliculasHarryPotter = require('./omdbService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/peliculas', (req, res) => {
    db.all("SELECT * FROM peliculas", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

//Filtra peliculas por titulo, año y valoracion
app.get('/peliculas/search', (req, res) => {
    const { titulo, year, valoracion } = req.query;
    let query = "SELECT * FROM peliculas WHERE 1=1";
    let params = [];

    if (titulo) {
        query += " AND titulo LIKE ?";
        params.push(`%${titulo}%`);
    }
    if (year) {
        query += " AND year = ?";
        params.push(year);
    }
    if (valoracion) {
        query += " AND valoracion = ?";
        params.push(valoracion);
    }

    db.all(query, params, async (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (rows.length === 0) {
            console.log(" No hay datos en BD, consultando API...");
            await obtenerPeliculasHarryPotter(); 
            db.all(query, params, (err, newRows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(newRows);
            });
        } else {
            res.json(rows);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
