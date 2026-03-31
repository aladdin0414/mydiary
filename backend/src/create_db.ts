import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createDb = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // 连接默认数据库以执行跨库操作
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`);
    if (res.rowCount === 0) {
      console.log(`Database "${process.env.DB_NAME}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`✅ Database "${process.env.DB_NAME}" created.`);
    } else {
      console.log(`✅ Database "${process.env.DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to check/create database:', err);
  } finally {
    await client.end();
  }
};

createDb();
