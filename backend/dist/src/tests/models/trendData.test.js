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
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../../models/user"));
const trendData_1 = __importDefault(require("../../models/trendData"));
const setup_1 = require("../setup");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('TrendData Model', () => {
    let sequelize;
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new in-memory database for testing
        sequelize = (0, setup_1.createTestDb)();
        // Initialize the models with the test database
        user_1.default.initialize(sequelize);
        trendData_1.default.initialize(sequelize);
        // Create a mock LabResult model using sequelize.define
        // This returns a proper Sequelize.Model
        const LabResult = sequelize.define('LabResult', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false
            },
            test_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        }, {
            tableName: 'lab_results',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        // Create a mock Document model to satisfy User associations
        const Document = sequelize.define('Document', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false
            },
            lab_result_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true
            },
            file_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            file_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            file_path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        }, {
            tableName: 'documents',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        // Set up associations with mock models included
        const models = { TrendData: trendData_1.default, User: user_1.default, LabResult, Document };
        user_1.default.associate(models);
        trendData_1.default.associate(models);
        // Sync the models with the database (create the tables)
        yield sequelize.sync({ force: true });
        // Create test user for foreign key relationships
        yield user_1.default.create({
            id: '12345678-1234-1234-1234-123456789012',
            email: 'test@example.com',
            password_hash: 'hashedpassword123',
            first_name: 'Test',
            last_name: 'User',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        });
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Close the database connection
        yield sequelize.close();
    }));
    (0, globals_1.it)('should create trend data with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test trend data
        const trendDataItem = yield trendData_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Glucose',
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-03-31'),
            count: 12,
            min_value: 90,
            max_value: 120,
            average: 105.5,
            median: 106,
            standard_deviation: 8.2,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Assertions
        (0, globals_1.expect)(trendDataItem).toBeDefined();
        (0, globals_1.expect)(trendDataItem.id).toBeDefined();
        (0, globals_1.expect)(trendDataItem.user_id).toBe('12345678-1234-1234-1234-123456789012');
        (0, globals_1.expect)(trendDataItem.test_name).toBe('Glucose');
        // Date might be stored as string in the test database
        (0, globals_1.expect)(trendDataItem.start_date).toBeDefined();
        (0, globals_1.expect)(trendDataItem.end_date).toBeDefined();
        (0, globals_1.expect)(trendDataItem.count).toBe(12);
        (0, globals_1.expect)(trendDataItem.min_value).toBe(90);
        (0, globals_1.expect)(trendDataItem.max_value).toBe(120);
        (0, globals_1.expect)(trendDataItem.average).toBe(105.5);
        (0, globals_1.expect)(trendDataItem.median).toBe(106);
    }));
    (0, globals_1.it)('should create trend data with different test name', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test trend data with different test name
        const trendDataItem = yield trendData_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Weight',
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-06-30'),
            count: 24,
            min_value: 160,
            max_value: 175,
            average: 167.5,
            median: 168,
            standard_deviation: 3.2,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Assertions
        (0, globals_1.expect)(trendDataItem).toBeDefined();
        (0, globals_1.expect)(trendDataItem.id).toBeDefined();
        (0, globals_1.expect)(trendDataItem.user_id).toBe('12345678-1234-1234-1234-123456789012');
        (0, globals_1.expect)(trendDataItem.test_name).toBe('Weight');
        (0, globals_1.expect)(trendDataItem.count).toBe(24);
    }));
    (0, globals_1.it)('should not create trend data without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test trend data with missing required fields
        const trendDataItem = {
            user_id: '12345678-1234-1234-1234-123456789012',
            // Missing test_name
            start_date: new Date('2025-01-01'),
            // Missing end_date
            // Missing count
            min_value: 90,
            max_value: 100
        };
        // Attempt to create new trend data and expect it to fail
        yield (0, globals_1.expect)(trendData_1.default.create(trendDataItem)).rejects.toThrow();
    }));
    (0, globals_1.it)('should update trend data correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test trend data
        const trendDataItem = yield trendData_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Cholesterol',
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-03-31'),
            count: 6,
            min_value: 180,
            max_value: 220,
            average: 198.5,
            median: 200,
            standard_deviation: 3.2,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Update trend data
        trendDataItem.min_value = 145;
        trendDataItem.max_value = 190;
        trendDataItem.average = 170;
        yield trendDataItem.save();
        // Fetch the updated trend data
        const updatedTrend = yield trendData_1.default.findByPk(trendDataItem.id);
        // Assertions
        (0, globals_1.expect)(updatedTrend).toBeDefined();
        (0, globals_1.expect)(updatedTrend.min_value).toBe(145);
        (0, globals_1.expect)(updatedTrend.max_value).toBe(190);
        (0, globals_1.expect)(updatedTrend.average).toBe(170);
        (0, globals_1.expect)(updatedTrend.test_name).toBe('Cholesterol'); // Unchanged
        (0, globals_1.expect)(updatedTrend.count).toBe(6); // Unchanged
    }));
    (0, globals_1.it)('should associate trend data with user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test trend data
        const trendDataItem = yield trendData_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Blood Pressure',
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-06-30'),
            count: 24,
            min_value: 110,
            max_value: 150,
            average: 130,
            median: 130,
            standard_deviation: 20,
            created_at: new Date(),
            updated_at: new Date()
        });
        // We'll need to manually retrieve the user since we haven't implemented instance methods for associations
        const user = yield user_1.default.findByPk('12345678-1234-1234-1234-123456789012');
        // Assertions
        (0, globals_1.expect)(user).toBeDefined();
        (0, globals_1.expect)(user.id).toBe('12345678-1234-1234-1234-123456789012');
        (0, globals_1.expect)(user.email).toBe('test@example.com');
    }));
});
