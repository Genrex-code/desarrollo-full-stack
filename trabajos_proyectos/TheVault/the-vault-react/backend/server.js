const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

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

// Registrar usuario
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


// Login usuario
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE username=? AND password=?",
        [username, password],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error DB" });

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

app.listen(3000, () => {
    console.log("Servidor backend en http://localhost:3000");
});
app.use("/images", express.static("images"));
