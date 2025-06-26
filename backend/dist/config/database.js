"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Database configuration
const dbConfig = {
    development: {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'clearbook_dev',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true,
        },
    },
    test: {
        username: process.env.TEST_DB_USERNAME || 'postgres',
        password: process.env.TEST_DB_PASSWORD || 'postgres',
        database: process.env.TEST_DB_NAME || 'clearbook_test',
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT || '5432'),
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
        },
    },
    production: {
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        port: parseInt(process.env.PROD_DB_PORT || '5432'),
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
            timestamps: true,
            underscored: true,
        },
    },
};
// Export the configuration for the current environment
const env = process.env.NODE_ENV || 'development';
exports.default = dbConfig[env];
