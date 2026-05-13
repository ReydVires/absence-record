import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from apps/api/.env or root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/absence_record';

async function initDb() {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  console.log('🚀 Initializing database...');

  try {
    const schemaPath = path.join(__dirname, '../../../../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Reading schema.sql...');
    
    await pool.query(schemaSql);

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
