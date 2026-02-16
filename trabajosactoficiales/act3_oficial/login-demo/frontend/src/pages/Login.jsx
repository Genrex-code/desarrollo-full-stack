import { useState } from "react";
import { login, register } from "../api";

export default function Login({ onLogin }) {

  const [u,setU] = useState("");
  const [p,setP] = useState("");
  const [n,setN] = useState("");
  const [msg,setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!u || !p) {
      setMsg("Rellena todos los campos");
      return;
    }

    const d = await login(u,p);

    console.log("Respuesta backend:", d); // DEBUG

    // 🔥 SOLO SI ES LOGIN CORRECTO
    if (d.message === "Login correcto") {
      onLogin(d);
      setMsg("");
    } else {
      setMsg(d.message);
    }
  };

  const handleRegister = async () => {

    if (!u || !p || !n) {
      setMsg("Completa todos los campos");
      return;
    }

    const r = await register(u,p,n);
    setMsg(r.message);
  };

  return(
    <form onSubmit={handleLogin}>

      <input placeholder="user" onChange={e=>setU(e.target.value)}/>
      <input placeholder="name" onChange={e=>setN(e.target.value)}/>
      <input type="password" placeholder="pass" onChange={e=>setP(e.target.value)}/>

      <button>Login</button>
      <button type="button" onClick={handleRegister}>Register</button>

      <p style={{color:"red"}}>{msg}</p>

    </form>
  );
}
