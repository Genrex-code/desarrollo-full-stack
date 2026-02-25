// ===============================
// server.js - Backend The Vault
// ===============================
const express = require("express");
const cors = require("cors");
const db = require("./db");
const discosRoutes = require("./routes/discos");
const usuariosRoutes = require("./routes/usuarios");

const app = express();
const PORT = 3000;

// 1. MIDDLEWARES (Configuración básica)
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// 2. RUTAS DE LOS ARCHIVOS EXTERNOS
app.use("/api/discos", discosRoutes);
app.use("/api/usuarios", usuariosRoutes);

// 3. RUTAS DIRECTAS (Login y Registro)
app.get("/api", (req, res) => {
    res.json({ ok: true, mensaje: "Backend funcionando" });
});

app.post("/api/register", (req, res) => {
    const { username, password } = req.body;
    db.query(
        "INSERT INTO usuarios (username, password) VALUES (?,?)",
        [username, password],
        (err) => {
            if (err) return res.status(500).json({ error: "Error al registrar" });
            res.json({ ok: true });
        }
    );
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    db.query(
        "SELECT * FROM usuarios WHERE username=? AND password=?",
        [username, password],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            if (results.length === 0) return res.json({ ok: false });
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

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});