import Database from "better-sqlite3";
const db = new Database("marine.db");
const services = db.prepare("SELECT * FROM services").all();
console.log(JSON.stringify(services, null, 2));
