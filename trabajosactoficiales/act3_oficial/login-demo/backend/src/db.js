import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Actividad3!",
  database: "login_demo",
  port: 3306
});

console.log("✅ Conectado a MySQL");

export default db;
