import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { username, password, full_name } = req.body;

  if (!username || !password || !full_name) {
    return res.json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si usuario existe
    const [exists] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (exists.length > 0) {
      return res.json({ message: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)",
      [username, hash, full_name]
    );

    res.json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "Debes llenar todos los campos" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    const validPass = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPass) {
      return res.json({ message: "Contraseña incorrecta" });
    }

    // 🔥 ESTA LÍNEA SOLUCIONA EL UNDEFINED
    res.json({
      message: "Login correcto",
      full_name: user.full_name
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
