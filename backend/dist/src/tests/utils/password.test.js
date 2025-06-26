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
Object.defineProperty(exports, "__esModule", { value: true });
const password_1 = require("../../utils/password");
describe('Password Utilities', () => {
    const testPassword = 'TestPassword123!';
    it('should hash a password', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, password_1.hashPassword)(testPassword);
        // Hash should be defined and a string
        expect(hashedPassword).toBeDefined();
        expect(typeof hashedPassword).toBe('string');
        // Hash should be different from original password
        expect(hashedPassword).not.toBe(testPassword);
        // BCrypt hashes start with $2b$ (algorithm identifier)
        expect(hashedPassword.startsWith('$2')).toBe(true);
    }));
    it('should verify a correct password against its hash', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, password_1.hashPassword)(testPassword);
        const isValid = yield (0, password_1.verifyPassword)(testPassword, hashedPassword);
        expect(isValid).toBe(true);
    }));
    it('should reject an incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, password_1.hashPassword)(testPassword);
        const isValid = yield (0, password_1.verifyPassword)('WrongPassword123!', hashedPassword);
        expect(isValid).toBe(false);
    }));
    it('should generate a reset token of sufficient length', () => {
        const resetToken = (0, password_1.generateResetToken)();
        expect(resetToken).toBeDefined();
        expect(typeof resetToken).toBe('string');
        expect(resetToken.length).toBeGreaterThan(20); // Should be reasonably long
    });
    it('should generate unique reset tokens', () => {
        const token1 = (0, password_1.generateResetToken)();
        const token2 = (0, password_1.generateResetToken)();
        expect(token1).not.toBe(token2);
    });
});
