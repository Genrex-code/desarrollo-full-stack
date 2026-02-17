// ===========================
// ADMIN - CREAR DISCO
// ===========================
app.post("/api/discos", (req, res) => {

    const {
        titulo,
        artista,
        genero,
        formato,
        imagen_path,
        anio,
        descripcion,
        top,
        admin
    } = req.body;

    // 🔒 Verificar admin simple
    if (!admin) {
        return res.status(403).json({ error: "Solo admin puede crear discos" });
    }

    // ✔ Validar datos mínimos
    if (!titulo || !artista || !formato) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    db.query(
        `
        INSERT INTO discos
        (titulo, artista, genero, formato, imagen_path, anio, descripcion, top)
        VALUES (?,?,?,?,?,?,?,?)
        `,
        [
            titulo,
            artista,
            genero || "",
            formato,
            imagen_path || "",
            anio || null,
            descripcion || "",
            top || 0
        ],
        (err, result) => {
            if (err) {
                console.error("Error DB:", err);
                return res.status(500).json({ error: "Error al crear disco" });
            }

            res.json({
                ok: true,
                id: result.insertId
            });
        }
    );
});
