# AASHA Backend

This is the backend service for the AASHA application, a maternal and child health records system with inventory management and offline-first capabilities.

## Tech Stack

- **Node.js & Express**: RESTful API framework.
- **Prisma ORM**: Database interaction and schema management.
- **PostgreSQL**: Primary relational database.
- **JWT & bcrypt**: Secure authentication and password hashing.

## Features

- **Authentication**: User registration and login with JWT-based authorization.
- **Inventory Management**: CRUD operations for tracking medicine and supplies, including stock levels, thresholds, and expiry dates.
- **Patient Records**: Management of maternal and child health records with specific fields for each type.
- **High-Risk Alerts**: Functionality to identify and send alerts for high-risk patients.
- **Offline Synchronization**: Dedicated sync endpoints (`/api/sync`) to handle bulk data synchronization from the offline-first frontend.

## Project Structure

- `src/server.js`: Application entry point.
- `src/app.js`: Express application setup and route configuration.
- `src/config/db.js`: Database configuration.
- `src/middlewares/`: Custom Express middlewares (e.g., authentication).
- `src/modules/`: Feature-based modules containing controllers, routes, and services:
  - `auth/`: Authentication logic.
  - `inventory/`: Inventory management.
  - `patients/`: Patient records management.
  - `sync/`: Offline data synchronization logic.
- `src/utils/`: Utility functions (e.g., hashing, JWT generation).
- `prisma/schema.prisma`: Prisma database schema definition.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following variables:

   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/aasha_db?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   ```

4. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

### Running the Application

- **Development mode**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

The server will start on the port specified in your `.env` file (default is 5000).
