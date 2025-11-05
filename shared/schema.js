import Database from "better-sqlite3";

const db = new Database("fileData.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT UNIQUE NOT NULL,
    mime_type TEXT NOT NULL,
    file TEXT NOT NULL
    )    
`);

export default db;
