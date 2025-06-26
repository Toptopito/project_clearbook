"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.runMigrations = exports.createDatabaseIfNotExists = void 0;
const pg_1 = require("pg");
const child_process_1 = require("child_process");
const util_1 = require("util");
const database_1 = __importDefault(require("../../config/database"));
const execPromise = (0, util_1.promisify)(child_process_1.exec);
// Function to create database if it doesn't exist
const createDatabaseIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    const { database, username, password, host, port } = database_1.default;
    // Connect to postgres database to create our app database
    const pool = new pg_1.Pool({
        user: username,
        host: host,
        password: password,
        port: port,
        database: 'postgres', // Connect to default postgres database
    });
    try {
        // Check if our database exists
        const res = yield pool.query("SELECT 1 FROM pg_database WHERE datname = $1", [database]);
        // If database doesn't exist, create it
        if (res.rowCount === 0) {
            console.log(`Database ${database} does not exist. Creating...`);
            yield pool.query(`CREATE DATABASE ${database}`);
            console.log(`Database ${database} created successfully.`);
        }
        else {
            console.log(`Database ${database} already exists.`);
        }
    }
    catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
    finally {
        yield pool.end();
    }
});
exports.createDatabaseIfNotExists = createDatabaseIfNotExists;
// Function to run migrations
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Running database migrations...');
        // Use sequelize-cli to run migrations
        const { stdout, stderr } = yield execPromise('npx sequelize-cli db:migrate');
        if (stderr) {
            console.error('Migration stderr:', stderr);
        }
        console.log('Migration stdout:', stdout);
        console.log('Database migrations completed successfully.');
    }
    catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    }
});
exports.runMigrations = runMigrations;
// Initialize database
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.createDatabaseIfNotExists)();
        yield (0, exports.runMigrations)();
        console.log('Database initialization completed successfully.');
        return true;
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        return false;
    }
});
exports.initializeDatabase = initializeDatabase;
// If script is run directly
if (require.main === module) {
    (0, exports.initializeDatabase)()
        .then((success) => {
        if (success) {
            console.log('Database setup completed successfully.');
            process.exit(0);
        }
        else {
            console.error('Database setup failed.');
            process.exit(1);
        }
    })
        .catch((err) => {
        console.error('Unhandled error during database setup:', err);
        process.exit(1);
    });
}
