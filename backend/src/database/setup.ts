import { Pool } from 'pg';
import { exec } from 'child_process';
import { promisify } from 'util';
import dbConfig from '../../config/database';

const execPromise = promisify(exec);

// Function to create database if it doesn't exist
export const createDatabaseIfNotExists = async () => {
  const { database, username, password, host, port } = dbConfig;
  
  // Connect to postgres database to create our app database
  const pool = new Pool({
    user: username as string,
    host: host as string,
    password: password as string,
    port: port as number,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    // Check if our database exists
    const res = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [database]
    );

    // If database doesn't exist, create it
    if (res.rowCount === 0) {
      console.log(`Database ${database} does not exist. Creating...`);
      await pool.query(`CREATE DATABASE ${database}`);
      console.log(`Database ${database} created successfully.`);
    } else {
      console.log(`Database ${database} already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Function to run migrations
export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    // Use sequelize-cli to run migrations
    const { stdout, stderr } = await execPromise('npx sequelize-cli db:migrate');
    if (stderr) {
      console.error('Migration stderr:', stderr);
    }
    console.log('Migration stdout:', stdout);
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  try {
    await createDatabaseIfNotExists();
    await runMigrations();
    console.log('Database initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// If script is run directly
if (require.main === module) {
  initializeDatabase()
    .then((success) => {
      if (success) {
        console.log('Database setup completed successfully.');
        process.exit(0);
      } else {
        console.error('Database setup failed.');
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unhandled error during database setup:', err);
      process.exit(1);
    });
}
