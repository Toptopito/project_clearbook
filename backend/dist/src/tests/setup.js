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
exports.createTestDb = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Increase Jest timeout for database operations
jest.setTimeout(30000);
// Set up global beforeAll and afterAll hooks for database testing
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Any setup required before all tests (could initialize a test database)
    console.log('Setting up test environment...');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clean up after all tests
    console.log('Cleaning up test environment...');
}));
// Helper function to create an in-memory SQLite database for tests
const createTestDb = () => {
    const sequelize = new sequelize_1.Sequelize('sqlite::memory:', {
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
exports.createTestDb = createTestDb;
