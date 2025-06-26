"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility script to export the OpenAPI specification to a file
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_1 = __importDefault(require("../config/swagger"));
// Directory to save the output file
const outputDir = path_1.default.join(__dirname, '../../api-docs');
// Create the directory if it doesn't exist
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
// Output file path
const outputPath = path_1.default.join(outputDir, 'openapi.json');
// Write the Swagger specification to file
fs_1.default.writeFileSync(outputPath, JSON.stringify(swagger_1.default, null, 2), { encoding: 'utf8' });
console.log(`OpenAPI specification exported to ${outputPath}`);
