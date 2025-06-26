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
exports.generateResetToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;
/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
});
exports.hashPassword = hashPassword;
/**
 * Verify a password against a hash
 * @param password Plain text password to check
 * @param hash Stored hash to compare against
 * @returns Boolean indicating if password matches
 */
const verifyPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hash);
});
exports.verifyPassword = verifyPassword;
/**
 * Generate a random password reset token
 * @returns Random string token
 */
const generateResetToken = () => {
    // Generate a random string of 32 characters
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};
exports.generateResetToken = generateResetToken;
exports.default = {
    hashPassword: exports.hashPassword,
    verifyPassword: exports.verifyPassword,
    generateResetToken: exports.generateResetToken,
};
