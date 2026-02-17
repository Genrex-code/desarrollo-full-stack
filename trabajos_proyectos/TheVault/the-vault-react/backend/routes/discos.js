// routes/discos.js

const express = require("express");
const router = express.Router();
const db = require("../db");


// ===========================
// GET TODOS LOS DISCOS
// ===========================
router.get("/", (req, res) => {
    db.query("SELECT * FROM discos", (err, results) => {
        if (err) return res.status(500).json({ error: "Error DB" });
        res.json({ discos: results });
    });
});


// ===========================
// GET POR FORMATO
// ===========================
router.get("/formato/:formato", (req, res) => {
    db.query(
        "SELECT * FROM discos WHERE formato=?",
        [req.params.formato],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ discos: results });
        }
    );
});


// ===========================
// GET DESTACADOS
// ===========================
router.get("/top", (req, res) => {
    db.query(
        "SELECT * FROM discos WHERE top=1",
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ discos: results });
        }
    );
});


// ===========================
// ADMIN - CREAR DISCO
// ===========================
router.post("/", (req, res) => {
    const { titulo, artista, genero, formato, imagen_path, anio, descripcion, top } = req.body;

    db.query(
        "INSERT INTO discos (titulo,artista,genero,formato,imagen_path,anio,descripcion,top) VALUES (?,?,?,?,?,?,?,?)",
        [titulo, artista, genero, formato, imagen_path, anio, descripcion, top],
        (err) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ ok: true });
        }
    );
});


// ===========================
// ADMIN - EDITAR DISCO
// ===========================
router.put("/:id", (req, res) => {
    const { titulo, artista, genero, formato, imagen_path, anio, descripcion, top } = req.body;

    db.query(
        "UPDATE discos SET titulo=?, artista=?, genero=?, formato=?, imagen_path=?, anio=?, descripcion=?, top=? WHERE id=?",
        [titulo, artista, genero, formato, imagen_path, anio, descripcion, top, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ ok: true });
        }
    );
});


// ===========================
// ADMIN - BORRAR DISCO
// ===========================
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM discos WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ ok: true });
        }
    );
});

module.exports = router;
