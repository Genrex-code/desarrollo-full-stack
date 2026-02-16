app.post("/api/contacto", (req,res)=>{
  const { nombre,email,mensaje } = req.body;
  db.query(
    "INSERT INTO contacto (nombre,email,mensaje) VALUES (?,?,?)",
    [nombre,email,mensaje],
    ()=> res.json({ok:true})
  );
});
