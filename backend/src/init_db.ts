import fs from 'fs';
import path from 'path';
import { pool } from './db';

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, '../sql/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Database tables initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  } finally {
    await pool.end();
  }
};

initDb();
