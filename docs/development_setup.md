# Clearbook Development Environment Setup

This guide provides step-by-step instructions for setting up the development environment for the Clearbook Personal Health Records application.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v13+) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

## Repository Setup

1. Clone the Clearbook repository:
   ```bash
   git clone https://github.com/Toptopito/project_clearbook.git
   cd project_clearbook
   ```

## Database Setup

1. Create a PostgreSQL database for Clearbook:
   ```bash
   psql -U postgres
   CREATE DATABASE clearbook;
   \q
   ```

2. Note: The application is configured to use the following database connection string:
   ```
   postgres://localhost:5432/clearbook
   ```
   
   If your PostgreSQL setup uses different credentials or ports, you'll need to update the `.env` file in the backend directory.

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and modify as needed:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   
   The backend API should now be running at http://localhost:5000.

## Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```
   
   The frontend application should now be running at http://localhost:3000.

## Verifying Setup

1. Access the frontend application at http://localhost:3000
2. You should see the Clearbook welcome page with a "Hello World" message from the API
3. If you can see data loading from the API, your setup is complete!

## Troubleshooting

### Backend Issues

- **Error: EADDRINUSE (Address already in use)**: Another process is using port 5000. Change the port in the `.env` file.
- **Database connection errors**: Ensure PostgreSQL is running and the connection string in `.env` is correct.
- **TypeScript errors**: Run `npm install` to ensure all dependencies are properly installed.

### Frontend Issues

- **Network errors when connecting to API**: Ensure the backend server is running. Check that CORS is properly configured.
- **Module not found errors**: Run `npm install` to ensure all dependencies are properly installed.

## Development Workflow

1. Pull the latest changes from the main branch before starting work
2. Create a new branch for your feature/fix
3. Make your changes, following the project's coding standards
4. Write tests for your changes when applicable
5. Submit a pull request for review

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Next Steps

After setting up the environment, refer to:
- `docs/clearbook_project_plan.md` for the overall project vision and roadmap
- `docs/clearbook_project_tasks.md` for specific tasks and their status
