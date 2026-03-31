import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { ensureDatabaseReady } from './db_init';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🔄 Initializing database...');
    await ensureDatabaseReady();
    
    app.listen(port, () => {
      console.log(`Backend Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start application due to database error:', err);
    process.exit(1);
  }
};

startServer();
