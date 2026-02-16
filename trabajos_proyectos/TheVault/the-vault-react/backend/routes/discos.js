app.post("/api/discos", (req, res) => {
  const { titulo, artista, genero, formato, top } = req.body;

  db.query(
    "INSERT INTO discos (titulo, artista, genero, formato, top) VALUES (?,?,?,?,?)",
    [titulo, artista, genero, formato, top],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true });
    }
  );
});
app.put("/api/discos/:id", (req, res) => {
  const { titulo, artista } = req.body;

  db.query(
    "UPDATE discos SET titulo=?, artista=? WHERE id=?",
    [titulo, artista, req.params.id],
    () => res.json({ ok: true })
  );
});
app.delete("/api/discos/:id", (req, res) => {
  db.query("DELETE FROM discos WHERE id=?", [req.params.id],
    () => res.json({ ok: true })
  );
});
