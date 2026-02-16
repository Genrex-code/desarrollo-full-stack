export default ({user,onLogout})=>(
 <div>
  <h1>Bienvenido {user.fullName}</h1>
  <button onClick={onLogout}>Salir</button>
 </div>
);
