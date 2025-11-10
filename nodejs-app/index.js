import express from "express";
import mariadb from "mariadb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // JSON-Body aktivieren

// === Datenbankkonfiguration ===
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
  connectionLimit: 5,
});

const PORT = process.env.PORT || 3000;

// === Hilfsfunktionen ===
function success(res, message, data = null) {
  res.status(200).json({ success: true, message, data });
}

function failure(res, message, err) {
  console.error(`❌ ${message}:`, err);
  res.status(500).json({ success: false, error: message });
}

// === Generische GET-Handler ===
async function getTableData(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${tableName}`);
    return rows;
  } catch (err) {
    console.error(`❌ Fehler beim Abrufen von ${tableName}:`, err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// === API: GET-Endpunkte ===
const tables = [
  "m_stamm",
  "m_status",
  "m_zeiten",
  "m_position",
  "m_stamm_view",
];

tables.forEach((table) => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const data = await getTableData(table);
      success(res, `${table} geladen`, data);
    } catch (err) {
      failure(res, `Fehler beim Laden von ${table}`, err);
    }
  });
});

// 🔹 Einzelnen Mitarbeiter abrufen
app.get("/api/m_stamm/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const id = req.params.id;

    const rows = await conn.query(
      "SELECT * FROM m_stamm WHERE stammid = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: "Mitarbeitende nicht gefunden" });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    failure(res, "Fehler beim Laden des Mitarbeitenden", err);
  } finally {
    if (conn) conn.release();
  }
});


// === API: POST/PUT-Endpunkte ===

// 🔹 Mitarbeiter anlegen
app.post("/api/m_stamm", async (req, res) => {
  let conn;
  try {

    conn = await pool.getConnection();
    const m = req.body;
    for (const key in m) {
      if (m[key] === "") m[key] = null;
    } 

    const result = await conn.query(
      `INSERT INTO m_stamm 
        (
          nachname, vorname, mail, tel, tel_p, geburtstag, strasse, nr, plz, ort, posid, statusid, soll, team, vorbereitung
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.nachname,
        m.vorname ?? null,
        m.mail ?? null,
        m.tel ?? null,
        m.tel_p ?? null,
        m.geburtstag ?? null,
        m.strasse ?? null,
        m.nr ?? null,
        m.plz ?? null,
        m.ort ?? null,
        m.posid ?? null,
        m.statusid ?? null,
        m.soll ?? null,
        m.team ?? null,
        m.vorbereitung ?? null
      ]
    );

    success(res, "Mitarbeitende angelegt", { id: result.insertId ?? null });
  } catch (err) {
    console.error(err);       // MariaDB-Fehler direkt sehen
    res.status(500).json({ success: false, error: err.sqlMessage ?? err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Mitarbeiter aktualisieren
app.put("/api/m_stamm/:id", async (req, res) => {
  let conn;
  try {
    
    conn = await pool.getConnection();
    const id = req.params.id;
    const m = req.body;
    for (const key in m) {
      if (m[key] === "") m[key] = null;
    }

    await conn.query(
      `UPDATE m_stamm 
         SET 
         nachname = COALESCE(?, nachname),
         vorname = COALESCE(?, vorname),
         mail = COALESCE(?, mail),
         tel = COALESCE(?, tel),
         tel_p = COALESCE(?, tel_p),
         geburtstag = COALESCE(?, geburtstag),
         strasse = COALESCE(?, strasse),
         nr = COALESCE(?, nr),
         plz = COALESCE(?, plz),
         ort = COALESCE(?, ort),
         posid = COALESCE(?, posid),
         statusid = COALESCE(?, statusid),
         soll = COALESCE(?, soll),
         team = COALESCE(?, team),
         vorbereitung = COALESCE(?, vorbereitung)
       WHERE stammid = ?`,
        [
          m.nachname, 
          m.vorname, 
          m.mail, 
          m.tel, 
          m.tel_p, 
          m.geburtstag, 
          m.strasse, 
          m.nr, 
          m.plz, 
          m.ort, 
          m.posid, 
          m.statusid,
          m.soll,
          m.team,
          m.vorbereitung,
          id
        ]
    );

    success(res, "Mitarbeitende aktualisiert");
  } catch (err) {
    failure(res, "Fehler beim Aktualisieren des Mitarbeitenden", err);
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Position anlegen
app.post("/api/m_position", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { position } = req.body;

    const result = await conn.query(
      "INSERT INTO m_position (position) VALUES (?)",
      [position]
    );

    success(res, "Position angelegt", { id: result.insertId ?? null });
  } catch (err) {
    failure(res, "Fehler beim Anlegen der Position", err);
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Status anlegen
app.post("/api/m_status", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { status } = req.body;

    const result = await conn.query(
      "INSERT INTO m_status (status) VALUES (?)",
      [status]
    );

    success(res, "Status angelegt", { id: result.insertId ?? null });
  } catch (err) {
    failure(res, "Fehler beim Anlegen des Status", err);
  } finally {
    if (conn) conn.release();
  }
});

// === Serverstart ===
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server läuft auf Port ${PORT}`)
);
