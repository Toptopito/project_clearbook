import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Increase Jest timeout for database operations
jest.setTimeout(30000);

// Set up global beforeAll and afterAll hooks for database testing
beforeAll(async () => {
  // Any setup required before all tests (could initialize a test database)
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Clean up after all tests
  console.log('Cleaning up test environment...');
});

// Helper function to create an in-memory SQLite database for tests
export const createTestDb = () => {
  const sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });

  // Enable SQLite foreign key constraints
  sequelize.query('PRAGMA foreign_keys = ON')
    .catch(err => console.error('Error enabling SQLite foreign keys:', err));

  return sequelize;
};
