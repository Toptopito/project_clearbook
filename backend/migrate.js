#!/usr/bin/env node

// This script executes Sequelize CLI migrations using ts-node to support TypeScript
require('ts-node/register');

// Execute migrations programmatically using Umzug
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { Sequelize } = require('sequelize');
const dbConfig = require('./sequelize-config');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  {
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    logging: console.log,
  }
);

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, 'src/database/migrations/*.ts'),
    resolve: ({ name, path, context }) => {
      // Load TypeScript migration file
      const migration = require(path);
      // Handle default export (ES modules)
      const migrationObject = migration.default || migration;
      return {
        name,
        up: async () => migrationObject.up(context.queryInterface, context.Sequelize),
        down: async () => migrationObject.down(context.queryInterface, context.Sequelize)
      };
    }
  },
  context: {
    queryInterface: sequelize.getQueryInterface(),
    Sequelize: Sequelize
  },
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

const runMigrations = async () => {
  try {
    await umzug.up();
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations();
