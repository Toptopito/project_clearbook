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
const user_1 = __importDefault(require("../../models/user"));
const setup_1 = require("../setup");
describe('User Model', () => {
    let sequelize;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new in-memory database for testing
        sequelize = (0, setup_1.createTestDb)();
        // Initialize the User model with the test database
        user_1.default.initialize(sequelize);
        // Sync the model with the database (create the table)
        yield sequelize.sync({ force: true });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Close the database connection
        yield sequelize.close();
    }));
    it('should create a user with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test user data
        const userData = {
            email: 'test@example.com',
            password_hash: 'hashedpassword123',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: new Date('1990-01-01'),
            gender: 'Male',
            phone: '123-456-7890',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        };
        // Create a new user
        const user = yield user_1.default.create(userData);
        // Assertions
        expect(user).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(user.first_name).toBe('John');
        expect(user.last_name).toBe('Doe');
        expect(user.onboarding_completed).toBe(false); // Default value
    }));
    it('should not create a user without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test user with missing required fields
        const userData = {
            email: 'incomplete@example.com',
            // Missing password_hash
            first_name: 'Jane',
            // Missing last_name
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        };
        // Attempt to create a new user and expect it to fail
        yield expect(user_1.default.create(userData)).rejects.toThrow();
    }));
    it('should not create a user with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test user with invalid email
        const userData = {
            email: 'not-an-email',
            password_hash: 'hashedpassword123',
            first_name: 'Invalid',
            last_name: 'Email',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        };
        // Attempt to create a new user and expect it to fail
        yield expect(user_1.default.create(userData)).rejects.toThrow();
    }));
    it('should update user data correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create test user
        const user = yield user_1.default.create({
            email: 'update@example.com',
            password_hash: 'hashedpassword123',
            first_name: 'Before',
            last_name: 'Update',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        });
        // Update user data
        user.first_name = 'After';
        user.phone = '555-123-4567';
        yield user.save();
        // Fetch the updated user
        const updatedUser = yield user_1.default.findByPk(user.id);
        // Assertions
        expect(updatedUser).toBeDefined();
        expect(updatedUser.first_name).toBe('After');
        expect(updatedUser.last_name).toBe('Update'); // Unchanged
        expect(updatedUser.phone).toBe('555-123-4567');
    }));
    it('should enforce unique email constraint', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create first user
        yield user_1.default.create({
            email: 'duplicate@example.com',
            password_hash: 'hashedpassword123',
            first_name: 'First',
            last_name: 'User',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        });
        // Try to create second user with same email
        const duplicateUser = {
            email: 'duplicate@example.com', // Same email
            password_hash: 'anotherpassword',
            first_name: 'Second',
            last_name: 'User',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        };
        // Attempt should fail due to unique constraint
        yield expect(user_1.default.create(duplicateUser)).rejects.toThrow();
    }));
});
