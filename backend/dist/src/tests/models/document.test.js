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
const document_1 = __importDefault(require("../../models/document"));
const setup_1 = require("../setup");
describe('Document Model', () => {
    let sequelize;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new in-memory database for testing
        sequelize = (0, setup_1.createTestDb)();
        // Initialize the models with the test database
        user_1.default.initialize(sequelize);
        labResult_1.default.initialize(sequelize);
        document_1.default.initialize(sequelize);
        // Create a mock TrendData model to satisfy User associations
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
        // Set up associations with all models including TrendData mock
        const models = { LabResult: labResult_1.default, Document: document_1.default, User: user_1.default, TrendData };
        user_1.default.associate(models);
        labResult_1.default.associate(models);
        document_1.default.associate(models);
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
        // Create a test lab result for optional association
        yield labResult_1.default.create({
            id: '98765432-9876-9876-9876-987654321098',
            user_id: '12345678-1234-1234-1234-123456789012',
            test_name: 'Complete Blood Count',
            test_date: new Date('2025-01-15'),
            result_value: 7000,
            unit: 'cells/mcL',
            is_abnormal: false,
            created_at: new Date(),
            updated_at: new Date()
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Close the database connection
        yield sequelize.close();
    }));
    it('should create a document with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test document data
        const documentData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            lab_result_id: '98765432-9876-9876-9876-987654321098',
            file_name: 'blood_test_results.pdf',
            file_type: 'application/pdf',
            file_size: 1024,
            file_path: '/uploads/blood_test_results.pdf',
            upload_date: new Date(),
            description: 'Complete blood count lab report',
            created_at: new Date(),
            updated_at: new Date()
        };
        // Create a new document
        const document = yield document_1.default.create(documentData);
        // Assertions
        expect(document).toBeDefined();
        expect(document.id).toBeDefined();
        expect(document.user_id).toBe('12345678-1234-1234-1234-123456789012');
        expect(document.lab_result_id).toBe('98765432-9876-9876-9876-987654321098');
        expect(document.file_name).toBe('blood_test_results.pdf');
        expect(document.file_type).toBe('application/pdf');
        expect(document.file_size).toBe(1024);
        expect(document.file_path).toBe('/uploads/blood_test_results.pdf');
        expect(document.description).toBe('Complete blood count lab report');
    }));
    it('should create a document without lab result association', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test document data without lab_result_id (optional in our model)
        const documentData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            file_name: 'prescription.jpg',
            file_type: 'image/jpeg',
            file_size: 512,
            file_path: '/uploads/prescription.jpg',
            upload_date: new Date(),
            description: 'Medication prescription',
            created_at: new Date(),
            updated_at: new Date(),
            lab_result_id: null
        };
        // Create a new document
        const document = yield document_1.default.create(documentData);
        // Assertions
        expect(document).toBeDefined();
        expect(document.id).toBeDefined();
        expect(document.user_id).toBe('12345678-1234-1234-1234-123456789012');
        expect(document.lab_result_id).toBeNull();
        expect(document.file_name).toBe('prescription.jpg');
    }));
    it('should not create a document without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test document with missing required fields
        const documentData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            // Missing file_name
            // Missing file_type
            // Missing file_size
            // Missing file_path
            upload_date: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            lab_result_id: null
        };
        // Attempt to create a new document and expect it to fail
        yield expect(document_1.default.create(documentData)).rejects.toThrow();
    }));
    it('should update document data correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test document
        const documentData = {
            user_id: '12345678-1234-1234-1234-123456789012',
            file_name: 'original.pdf',
            file_type: 'application/pdf',
            file_size: 2048,
            file_path: '/uploads/original.pdf',
            upload_date: new Date(),
            description: 'Original document',
            created_at: new Date(),
            updated_at: new Date(),
            lab_result_id: null
        };
        // Create a new document
        const document = yield document_1.default.create(documentData);
        // Update document data
        document.file_name = 'updated.pdf';
        document.file_path = '/uploads/updated.pdf';
        document.description = 'Updated document';
        yield document.save();
        // Fetch the updated document
        const updatedDocument = yield document_1.default.findByPk(document.id);
        // Assertions
        expect(updatedDocument).toBeDefined();
        expect(updatedDocument.file_name).toBe('updated.pdf');
        expect(updatedDocument.file_path).toBe('/uploads/updated.pdf');
        expect(updatedDocument.description).toBe('Updated document');
        expect(updatedDocument.file_type).toBe('application/pdf'); // Unchanged
        expect(updatedDocument.file_size).toBe(2048); // Unchanged
    }));
    it('should associate document with user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test document
        const document = yield document_1.default.create({
            user_id: '12345678-1234-1234-1234-123456789012',
            file_name: 'user_test.pdf',
            file_type: 'application/pdf',
            file_size: 1000,
            file_path: '/uploads/user_test.pdf',
            upload_date: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            lab_result_id: null
        });
        // Get the associated user
        const user = yield document.getUser();
        // Assertions
        expect(user).toBeDefined();
        expect(user.id).toBe('12345678-1234-1234-1234-123456789012');
        expect(user.email).toBe('test@example.com');
    }));
    it('should support lab result association in model structure', () => {
        // Verify the model has the structure to support lab result associations
        // This is a structure test that doesn't rely on database operations
        // Check if the model has the lab_result_id field in its attributes
        expect(document_1.default.getAttributes()).toHaveProperty('lab_result_id');
        // Check if the association method is defined on the prototype
        // Sequelize uses snake_case for association methods when the model name is snake_case
        expect(document_1.default.prototype).toHaveProperty('getLab_result');
        // Document model properly includes lab_result_id field
        const docInstance = document_1.default.build({
            user_id: '12345678-1234-1234-1234-123456789012',
            file_name: 'test.pdf',
            file_type: 'application/pdf',
            file_size: 1000,
            file_path: '/path/to/test.pdf',
            upload_date: new Date()
        });
        // Verify instance can hold lab_result_id
        docInstance.lab_result_id = '98765432-9876-9876-9876-987654321098';
        expect(docInstance.lab_result_id).toBe('98765432-9876-9876-9876-987654321098');
    });
});
