import Database from "better-sqlite3";
const db = new Database("marine.db");

const settings = db.prepare("SELECT key, value FROM settings").all();
const services = db.prepare("SELECT * FROM services").all();

console.log(JSON.stringify({ settings, services }, null, 2));
