import db from "./schema.js";

export function insertFile(filename, mimetype, file) {
  try {
    const stmt = db.prepare(`
            INSERT INTO files (file_name, mime_type, file) VALUES (?, ?, ?)
            `);
    stmt.run(filename, mimetype, file);
  } catch (e) {
    console.error(e);
  }
}
