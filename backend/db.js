import db from "./schema.js";

export async function createUser(email, username, password) {
  const stmt = await db.execute(
    "INSERT INTO users (email, username, password) VALUES (?, ?, ?) RETURNING *",
    [email, username, password],
  );

  return stmt.rows[0];
}

export async function getUser(username) {
  const stmt = await db.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  return stmt.rows[0];
}

export async function createFile(userid, filename, file) {
  const stmt = await db.execute(
    "INSERT INTO files (user_id, file_name, file) VALUES (?, ?, ?) RETURNING *",
    [userid, filename, file],
  );

  return stmt.rows[0].file_name;
}

export async function getFile(filename) {
  const stmt = await db.execute("SELECT * FROM files WHERE file_name = ?", [
    filename,
  ]);

  return stmt.rows[0];
}

export async function updateFile(file, filename) {
  const stmt = await db.execute("UPDATE files SET file = ? WHERE file_name = ? RETURNING *", 
    [file, filename]
);

  return stmt.rows[0];
}