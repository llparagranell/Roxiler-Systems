import { initDb } from './db.js';

async function main() {
  try {
    await initDb();
    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

main();
