// backend/insert_faqs.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({
  filename: path.join(__dirname, "data.db"),
  driver: sqlite3.Database,
});

const faqs = [
  { question: "What is this site?", answer: "This is a demo FAQ/contact project." },
  { question: "How do I contact you?", answer: "Use the contact form on this page." },
  { question: "Is my data safe?", answer: "Yes, it is stored in SQLite locally." }
];

for (const { question, answer } of faqs) {
  await db.run("INSERT INTO faqs (question, answer) VALUES (?, ?)", question, answer);
}

console.log("✅ Sample FAQs inserted.");
await db.close();
