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
exports.testConnection = exports.sequelize = exports.TrendData = exports.Document = exports.LabResult = exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
// Import models
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const labResult_1 = __importDefault(require("./labResult"));
exports.LabResult = labResult_1.default;
const document_1 = __importDefault(require("./document"));
exports.Document = document_1.default;
const trendData_1 = __importDefault(require("./trendData"));
exports.TrendData = trendData_1.default;
// Create Sequelize instance
const sequelize = new sequelize_1.Sequelize(database_1.default.database, database_1.default.username, database_1.default.password, {
    host: database_1.default.host,
    port: database_1.default.port,
    dialect: 'postgres',
    logging: database_1.default.logging,
    define: {
        timestamps: true,
        underscored: true,
    },
});
exports.sequelize = sequelize;
// Initialize models
user_1.default.initialize(sequelize);
labResult_1.default.initialize(sequelize);
document_1.default.initialize(sequelize);
trendData_1.default.initialize(sequelize);
// Setup associations
user_1.default.associate({ LabResult: labResult_1.default, Document: document_1.default, TrendData: trendData_1.default });
labResult_1.default.associate({ User: user_1.default, Document: document_1.default });
document_1.default.associate({ User: user_1.default, LabResult: labResult_1.default });
trendData_1.default.associate({ User: user_1.default });
// Test database connection
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
});
exports.testConnection = testConnection;
exports.default = sequelize;
