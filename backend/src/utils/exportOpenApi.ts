/**
 * Utility script to export the OpenAPI specification to a file
 */
import fs from 'fs';
import path from 'path';
import swaggerSpec from '../config/swagger';

// Directory to save the output file
const outputDir = path.join(__dirname, '../../api-docs');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Output file path
const outputPath = path.join(outputDir, 'openapi.json');

// Write the Swagger specification to file
fs.writeFileSync(
  outputPath, 
  JSON.stringify(swaggerSpec, null, 2), 
  { encoding: 'utf8' }
);

console.log(`OpenAPI specification exported to ${outputPath}`);
