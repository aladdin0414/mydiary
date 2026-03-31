import { Client, Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 确保数据库和表结构已就绪
 */
export const ensureDatabaseReady = async () => {
  const dbName = process.env.DB_NAME || 'mydiary';
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };

  // 1. 尝试创建数据库（如果不存在）
  const adminClient = new Client({
    ...config,
    database: 'postgres', // 连接到默认库以执行创建库操作
  });

  try {
    console.log(`Connecting to PostgreSQL at ${config.host}:${config.port}...`);
    await adminClient.connect();
    
    const res = await adminClient.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // 注意：CREATE DATABASE 不支持参数化查询，需确保 dbName 安全
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      console.log(`✅ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to check/create database:', err);
    throw err;
  } finally {
    try {
      await adminClient.end();
    } catch (e) {
      // Ignore
    }
  }

  // 2. 运行 init.sql 创建表结构
  const pool = new Pool({
    ...config,
    database: dbName,
  });

  try {
    // 在 CommonJS 环境下可以直接使用 __dirname
    const sqlPath = path.join(__dirname, '../sql/init.sql');
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await pool.query(sql);
      console.log('✅ Database tables initialized/verified.');
    } else {
      console.warn('⚠️  SQL init file not found at:', sqlPath);
    }
  } catch (err) {
    console.error('❌ Failed to initialize tables:', err);
    throw err;
  } finally {
    try {
      await pool.end();
    } catch (e) {
      // Ignore
    }
  }
};
