"use strict";
// Script to list all users in the database
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
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
// Load environment variables
dotenv_1.default.config();
function listUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.User.findAll({
                attributes: ['id', 'email', 'first_name', 'last_name', 'onboarding_completed']
            });
            console.log('Users in the database:');
            console.log('----------------------');
            if (users.length === 0) {
                console.log('No users found');
            }
            else {
                users.forEach((user, index) => {
                    console.log(`User #${index + 1}:`);
                    console.log(`  ID: ${user.id}`);
                    console.log(`  Email: ${user.email}`);
                    console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
                    console.log(`  Onboarding completed: ${user.onboarding_completed ? 'Yes' : 'No'}`);
                    console.log('----------------------');
                });
            }
        }
        catch (error) {
            console.error('Error listing users:', error);
        }
        finally {
            process.exit(0);
        }
    });
}
// Run the function
listUsers();
