require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id SERIAL PRIMARY KEY,
      temperature REAL,
      weight REAL,
      source_action VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS device_state (
      id INTEGER PRIMARY KEY DEFAULT 1,
      mode VARCHAR(20) DEFAULT 'auto',
      program_state VARCHAR(10) DEFAULT 'off',
      fan VARCHAR(10) DEFAULT 'off',
      heater VARCHAR(10) DEFAULT 'off',
      heater_temp REAL DEFAULT 45,
      dry_time INTEGER DEFAULT 0,
      cabinet_status VARCHAR(50) DEFAULT 'TAT'
    )
  `);

  await pool.query(`
    INSERT INTO device_state (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `);
}

// ================= API =================

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API dang chay" });
});

app.get("/api/state", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM device_state WHERE id = 1`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Loi lay state:", error);
    res.status(500).json({ error: "Loi lay state" });
  }
});

app.get("/api/telemetry", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM telemetry
      ORDER BY created_at DESC
      LIMIT 200
    `);

    res.json(result.rows.reverse());
  } catch (error) {
    console.error("Loi lay telemetry:", error);
    res.status(500).json({ error: "Loi lay telemetry" });
  }
});

app.post("/api/data_receiver", async (req, res) => {
  try {
    const { cambien1, cambien2, action, temperature, weight } = req.body;

    console.log("DATA ESP32 GUI LEN:", req.body);

    const finalTemperature =
      temperature !== undefined && temperature !== ""
        ? parseFloat(temperature)
        : cambien1 !== undefined && cambien1 !== ""
        ? parseFloat(cambien1)
        : null;

    const finalWeight =
      weight !== undefined && weight !== ""
        ? parseFloat(weight)
        : cambien2 !== undefined && cambien2 !== ""
        ? parseFloat(cambien2)
        : null;

    const finalAction = action && action !== "" ? String(action) : "normal";

    await pool.query(
      `INSERT INTO telemetry (temperature, weight, source_action)
       VALUES ($1, $2, $3)`,
      [finalTemperature, finalWeight, finalAction]
    );

    res.send("success");
  } catch (error) {
    console.error("Loi nhan data_receiver:", error);
    res.status(500).send("error");
  }
});

app.get("/api/manual", async (req, res) => {
  try {
    const { action, state } = req.query;

    if (action === "program" && state === "status") {
      const result = await pool.query(`SELECT * FROM device_state WHERE id = 1`);
      const row = result.rows[0];

      return res.json({
        success: true,
        data: {
          state: row.program_state,
          fan: row.fan,
          heater: row.heater,
          mode: row.mode,
          heater_temp: row.heater_temp,
          dry_time: row.dry_time,
          cabinet_status: row.cabinet_status,
        },
      });
    }

    res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  } catch (error) {
    console.error("Loi api/manual GET:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/api/manual", async (req, res) => {
  try {
    console.log("POST /api/manual:", req.body);

    const action = String(req.body.action || "");

    if (action === "program") {
      const state = String(req.body.state || "off");
      const fan = String(req.body.fan || "off");

      await pool.query(
        `UPDATE device_state
         SET program_state = $1,
             fan = $2,
             cabinet_status = CASE
               WHEN $1 = 'on' AND mode = 'auto' THEN 'AUTO_DANG_CHAY'
               WHEN $1 = 'on' AND mode = 'manual' THEN 'MANUAL_DANG_CHAY'
               ELSE 'TAT'
             END
         WHERE id = 1`,
        [state, fan]
      );

      return res.send("success");
    }

    if (action === "fan") {
      const state = String(req.body.state || "off");

      await pool.query(
        `UPDATE device_state
         SET fan = $1
         WHERE id = 1`,
        [state]
      );

      return res.send("success");
    }

    if (action === "heater") {
      const state = String(req.body.state || "off");
      const heater_temp = Number(req.body.heater_temp || 45);

      await pool.query(
        `UPDATE device_state
         SET heater = $1,
             heater_temp = $2
         WHERE id = 1`,
        [state, heater_temp]
      );

      return res.send("success");
    }

    res.status(400).send("invalid");
  } catch (error) {
    console.error("Loi api/manual POST:", error);
    res.status(500).send("error");
  }
});

app.put("/api/control", async (req, res) => {
  try {
    console.log("BACKEND NHAN /api/control:", req.body);

    const mode = String(req.body.mode || "auto");
    const program_state = String(req.body.program_state || "off");
    const fan = String(req.body.fan || "off");
    const heater = String(req.body.heater || "off");
    const heater_temp = Number(req.body.heater_temp || 45);
    const dry_time = Number(req.body.dry_time || 0);
    const cabinet_status = String(req.body.cabinet_status || "TAT");

    await pool.query(
      `UPDATE device_state
       SET mode = $1,
           program_state = $2,
           fan = $3,
           heater = $4,
           heater_temp = $5,
           dry_time = $6,
           cabinet_status = $7
       WHERE id = 1`,
      [mode, program_state, fan, heater, heater_temp, dry_time, cabinet_status]
    );

    const result = await pool.query(`SELECT * FROM device_state WHERE id = 1`);
    const saved = result.rows[0];

    console.log("SAU UPDATE device_state:", saved);

    res.json({
      success: true,
      received: {
        mode,
        program_state,
        fan,
        heater,
        heater_temp,
        dry_time,
        cabinet_status,
      },
      saved,
    });
  } catch (error) {
    console.error("Loi api/control:", error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.delete("/api/telemetry", async (req, res) => {
  try {
    await pool.query(`DELETE FROM telemetry`);
    res.json({ success: true });
  } catch (error) {
    console.error("Loi xoa telemetry:", error);
    res.status(500).json({ success: false });
  }
});

app.get("/api/test-insert", async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO telemetry (temperature, weight, source_action)
      VALUES
      (45.5, 1200, 'normal'),
      (46.2, 1180, 'normal'),
      (47.1, 1150, 'normal'),
      (48.0, 1120, 'normal'),
      (49.3, 1100, 'normal')
    `);

    res.send("Da chen du lieu mau");
  } catch (error) {
    console.error("Loi chen du lieu mau:", error);
    res.status(500).send("Loi chen du lieu");
  }
});

// ============== FRONTEND BUILD ==============
// Sau khi build React, backend sẽ phục vụ web từ frontend/dist

const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 10000;

initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server dang chay tai cong ${PORT}`);
      console.log(`Server dang chay tai cong ${PORT}`);
      console.log("Render service is live");
    });
  })
  .catch((error) => {
    console.error("Loi khoi tao database:", error);
  });