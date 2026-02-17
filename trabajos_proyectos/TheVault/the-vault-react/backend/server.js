// ===============================
// server.js
// Backend principal The Vault
// ===============================

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(cors());
app.use(express.json());

// Servir imágenes físicas
app.use("/images", express.static("images"));


// ----------------------
// TEST SERVER
// ----------------------
app.get("/api", (req, res) => {
    res.json({ ok: true, mensaje: "Backend The Vault funcionando" });
});


// =======================
// DISCOS
// =======================
app.get("/api/discos", (req, res) => {
    db.query("SELECT * FROM discos", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error DB" });
        }
        res.json({ discos: results });
    });
});


// =======================
// USUARIOS
// =======================

// Registrar
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "INSERT INTO usuarios (username,password) VALUES (?,?)",
        [username, password],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Usuario ya existe o error DB" });
            }
            res.json({ ok: true });
        }
    );
});

// Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE username=? AND password=?",
        [username, password],
        (err, results) => {

            if (err)
                return res.status(500).json({ error: "Error DB" });

            if (results.length === 0)
                return res.json({ ok: false });

            res.json({
                ok: true,
                user: {
                    id: results[0].id,
                    username: results[0].username,
                    admin: results[0].is_admin
                }
            });
        }
    );
});


// =======================
// INICIAR SERVIDOR
// =======================
app.listen(PORT, () => {
    console.log(`Servidor backend en http://localhost:${PORT}`);
});
