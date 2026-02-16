import { useState } from "react";

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const API = "http://localhost:3001/api/auth";

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {

    if (!username.trim() || !password.trim()) {
      alert("Debes rellenar todos los campos");
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      // 🔥 VALIDAMOS POR MENSAJE, NO res.ok
      if (data.message !== "Login correcto") {
        alert(data.message);
        return;
      }

      alert("Bienvenido " + data.full_name);

    } catch {
      alert("Error al conectar con el servidor");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {

    if (!username.trim() || !password.trim() || !fullName.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 4) {
      alert("La contraseña debe tener mínimo 4 caracteres");
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          full_name: fullName
        })
      });

      const data = await res.json();

      alert(data.message);

    } catch {
      alert("Error del servidor");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login / Register</h2>

      <input
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Nombre completo"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <button onClick={handleRegister} style={{ marginLeft: "10px" }}>
        Register
      </button>
    </div>
  );
}

export default App;
