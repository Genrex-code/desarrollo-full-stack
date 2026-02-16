app.post("/api/discos", (req, res) => {
    const { titulo, artista, genero, formato, top, admin } = req.body;

    if (!admin)
        return res.status(403).json({ error: "Solo admin" });

    db.query(
        "INSERT INTO discos (titulo,artista,genero,formato,top) VALUES (?,?,?,?,?)",
        [titulo, artista, genero, formato, top],
        (err) => {
            if (err) return res.status(500).json({ error: "Error DB" });
            res.json({ ok: true });
        }
    );
});
