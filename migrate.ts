import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function migrate(): Promise<void> {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'epytodo',
    password: process.env.MYSQL_ROOT_PASSWORD || 'password',
    multipleStatements: true,
  });

  try {
    const sqlFile = fs.readFileSync(
      path.join(__dirname, 'epytodo.sql'),
      'utf8'
    );
    await connection.query(sqlFile);
    // eslint-disable-next-line no-console
    console.log('Migration completed successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
