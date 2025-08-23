const path = require('path');
// load .env from project root (backend/.env) if present
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const fs = require('fs');
const mysql = require('mysql2/promise');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node run-migration.js <sql-file>');
  process.exit(2);
}

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER || 'root';
const pass = process.env.DB_PASS || '';
const db = process.env.DB_NAME || 'catalogo';

async function run() {
  const fullPath = path.resolve(file);
  const sql = fs.readFileSync(fullPath, 'utf8');

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password: pass,
      database: db,
      multipleStatements: true,
    });

    await connection.query(sql);
    console.log('Migration executed successfully:', fullPath);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    if (connection) await connection.end();
    process.exit(1);
  }
}

run();
