# Clearbook - Personal Health Records Application

A web application that empowers individuals in developing countries to manage their health records and those of their dependents, starting with lab results tracking.

## Project Overview

Clearbook allows users to:
- Securely store and manage lab test results
- Upload and store scanned lab reports
- View historical data and basic trends
- Manage their profile and dependents (future)

## Repository Structure

- `frontend/` - React frontend application
- `backend/` - Node.js/Express backend API
- `database/` - Database migration scripts and schema
- `docs/` - Project documentation and design assets

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL (v13+)

### Development Setup
1. Clone this repository
2. Set up the backend: `cd backend && npm install`
3. Set up the frontend: `cd frontend && npm install`
4. Create a PostgreSQL database for the project
5. Configure environment variables (see backend/.env.example)
6. Run database migrations: `cd backend && npm run migrate`
7. Start the backend: `cd backend && npm run dev`
8. Start the frontend: `cd frontend && npm start`

## Contributing
Please refer to `docs/CONTRIBUTING.md` for development guidelines and processes.

## License
[License details to be determined]
