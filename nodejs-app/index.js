import express from "express";
import mariadb from "mariadb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

const isDocker = process.env.DOCKER_ENV === "true";
const DB_HOST = isDocker ? process.env.DOCKER_DB_HOST : process.env.LOCAL_DB_HOST;
const DB_PORT = isDocker ? process.env.DOCKER_DB_PORT : process.env.LOCAL_DB_PORT;
const DB_USER = isDocker ? process.env.DOCKER_DB_USER : process.env.LOCAL_DB_USER;
const DB_PASSWORD = isDocker ? process.env.DOCKER_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD;
const DB_NAME = isDocker ? process.env.DOCKER_DB_NAME : process.env.LOCAL_DB_NAME;

const pool = mariadb.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 5
});

const PORT = process.env.PORT || 3000;

// Helper-Funktion für GET-Endpoints
async function getTableData(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${tableName}`);
    return rows;
  } finally {
    if (conn) conn.release();
  }
}

// Dynamische Endpoints für jede Tabelle
const tables = [
  "m_stamm", 
  "m_status", 
  "m_zeiten", 
  "m_position", 
  "m_stamm_position", 
  "m_stamm_status",
  "stamm_status", //view
  "stamm_zeiten"  //view
];
tables.forEach(table => {
  app.get(`/${table}`, async (req, res) => {
    try {
      const data = await getTableData(table);
      res.json(data);
    } catch (err) {
      console.error(`DB-Fehler (${table}):`, err);
      res.status(500).send(`DB-Fehler bei ${table}`);
    }
  });
});


app.listen(PORT, "0.0.0.0", () => console.log(`Server läuft auf Port ${PORT}`));
