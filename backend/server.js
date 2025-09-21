import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./mailer.js"; // <- Only import here

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = await open({
  filename: path.join(__dirname, "data.db"),
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
  )
`);

app.get("/api/faqs", async (req, res) => {
  try {
    const faqs = await db.all("SELECT id, question, answer FROM faqs ORDER BY id ASC");
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.run(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    // Send email notification
    await sendMail({ name, email, message });

    res.json({ success: true, message: "Your message has been sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
