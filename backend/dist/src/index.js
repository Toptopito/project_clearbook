"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const labResult_routes_1 = __importDefault(require("./routes/labResult.routes"));
const error_1 = require("./middleware/error");
const swagger_1 = __importDefault(require("./config/swagger"));
// Load environment variables
dotenv_1.default.config();
// Create Express application
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
// Define port
const PORT = process.env.PORT || 5000;
// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});
app.get('/api/hello', (req, res) => {
    res.status(200).json({
        message: 'Hello World from Clearbook API!',
        project: 'Clearbook Personal Health Records',
        version: '0.1.0'
    });
});
// Mount auth routes
app.use('/api/auth', auth_routes_1.default);
// Mount lab result routes
app.use('/api/lab-results', labResult_routes_1.default);
// API Documentation with Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Endpoint to get the OpenAPI spec in JSON format
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
});
// Error handling middleware (must be after all other middleware and routes)
app.use(error_1.notFoundHandler);
app.use(error_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
