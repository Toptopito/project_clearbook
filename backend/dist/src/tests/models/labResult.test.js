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
const labResult_1 = __importDefault(require("../../models/labResult"));
const setup_1 = require("../setup");
describe('LabResult Model', () => {
    let sequelize;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new in-memory database for testing
        sequelize = (0, setup_1.createTestDb)();
        // Initialize the models with the test database
        user_1.default.initialize(sequelize);
        labResult_1.default.initialize(sequelize);
        // Create a mock Document model to satisfy associations
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
            file_size: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            file_path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            upload_date: {
                type: sequelize_1.DataTypes.DATE,
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
        // Create a mock TrendData model to satisfy associations
        const TrendData = sequelize.define('TrendData', {
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
            start_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            end_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            count: {
                type: sequelize_1.DataTypes.INTEGER,
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
            tableName: 'trend_data',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        // Set up associations with all mocked models
        const models = { LabResult: labResult_1.default, User: user_1.default, Document, TrendData };
        user_1.default.associate(models);
        labResult_1.default.associate(models);
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
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Close the database connection
        yield sequelize.close();
    }));
    it('should create a lab result with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test lab result data
        const labResultData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Complete Blood Count',
            test_date: new Date('2025-01-15'),
            result_value: 7000,
            unit: 'cells/mcL',
            reference_range_low: 4500,
            reference_range_high: 11000,
            lab_name: 'City Medical Lab',
            ordering_doctor: 'Dr. Smith',
            notes: 'Normal range',
            is_abnormal: false,
            created_at: new Date(),
            updated_at: new Date()
        };
        // Create a new lab result
        const labResult = yield labResult_1.default.create(labResultData);
        // Assertions
        expect(labResult).toBeDefined();
        expect(labResult.id).toBeDefined();
        expect(labResult.user_id).toBe('12345678-1234-1234-1234-123456789012');
        expect(labResult.test_name).toBe('Complete Blood Count');
        expect(labResult.result_value).toBe(7000);
        expect(labResult.is_abnormal).toBe(false);
    }));
    it('should not create a lab result without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test lab result with missing required fields
        const labResultData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            // Missing test_name
            test_date: new Date('2025-01-15'),
            // Missing result_value
            unit: 'mg/dL'
        };
        // Attempt to create a new lab result and expect it to fail
        yield expect(labResult_1.default.create(labResultData)).rejects.toThrow();
    }));
    it('should create a lab result with minimal required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test lab result with only required fields
        const labResultData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'HbA1c',
            test_date: new Date('2025-01-10'),
            result_value: 5.7,
            unit: '%',
            is_abnormal: false,
            created_at: new Date(),
            updated_at: new Date()
        };
        // Create a new lab result
        const labResult = yield labResult_1.default.create(labResultData);
        // Assertions
        expect(labResult).toBeDefined();
        expect(labResult.test_name).toBe('HbA1c');
        expect(labResult.result_value).toBe(5.7);
        expect(labResult.reference_range_low).toBeFalsy();
        expect(labResult.reference_range_high).toBeFalsy();
        expect(labResult.lab_name).toBeFalsy();
        expect(labResult.ordering_doctor).toBeFalsy();
        expect(labResult.notes).toBeFalsy();
        expect(labResult.is_abnormal).toBe(false); // Default value
    }));
    it('should update lab result data correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test lab result
        const labResult = yield labResult_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Lipid Panel',
            test_date: new Date('2025-01-20'),
            result_value: 180,
            unit: 'mg/dL',
            is_abnormal: false,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Update lab result data
        labResult.result_value = 140;
        labResult.is_abnormal = true;
        labResult.notes = 'Updated after review';
        yield labResult.save();
        // Fetch the updated lab result
        const updatedLabResult = yield labResult_1.default.findByPk(labResult.id);
        // Assertions
        expect(updatedLabResult).toBeDefined();
        expect(updatedLabResult.result_value).toBe(140);
        expect(updatedLabResult.is_abnormal).toBe(true);
        expect(updatedLabResult.notes).toBe('Updated after review');
        expect(updatedLabResult.test_name).toBe('Lipid Panel'); // The value wasn't changed in the update
    }));
    it('should associate lab result with user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test lab result
        const labResult = yield labResult_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Vitamin D',
            test_date: new Date('2025-01-20'),
            result_value: 45,
            unit: 'ng/mL',
            is_abnormal: false,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Get the associated user (requires proper association setup)
        const user = yield labResult.getUser();
        // Assertions
        expect(user).toBeDefined();
        expect(user.id).toBe('12345678-1234-1234-1234-123456789012');
        expect(user.email).toBe('test@example.com');
    }));
});
