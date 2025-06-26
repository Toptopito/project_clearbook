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
const models_1 = require("../models");
// Test database connection and exit
const runTest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connected = yield (0, models_1.testConnection)();
        if (connected) {
            console.log('Database connection test successful!');
            process.exit(0);
        }
        else {
            console.error('Database connection test failed.');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error during database connection test:', error);
        process.exit(1);
    }
    finally {
        yield models_1.sequelize.close();
    }
});
// Run the test if this script is executed directly
if (require.main === module) {
    runTest();
}
