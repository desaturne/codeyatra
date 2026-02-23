# AASHA - Maternal and Child Health Records System

AASHA is a comprehensive, offline-first web application designed to manage maternal and child health records, along with inventory tracking for medicines and supplies. It is built to function reliably even in areas with poor or no internet connectivity, ensuring that healthcare workers can always access and update critical information.

## Project Overview

The project is divided into two main components:

- **[Frontend](./frontend/README.md)**: A React 19 application built with Vite, featuring an offline-first architecture using Dexie.js (IndexedDB) for local data storage and synchronization. It includes bilingual support (English and Nepali) and generates PDF reports.
- **[Backend](./backend/README.md)**: A Node.js and Express RESTful API powered by Prisma ORM and PostgreSQL. It handles authentication, data persistence, and synchronization of offline data from the frontend.

## Key Features

- **Offline-First Capabilities**: Healthcare workers can continue to register patients, update records, and manage inventory without an internet connection. Data is stored locally and automatically synced with the server once connectivity is restored.
- **Maternal & Child Health Records**: Dedicated modules for tracking the health status of mothers and children, including specific fields for each category (e.g., pregnancy month, birth weight, vaccines).
- **Inventory Management**: Track medicines and supplies, monitor stock levels, set thresholds, and manage expiry dates.
- **High-Risk Alerts**: Automated identification and alerting for high-risk patients based on health indicators.
- **Bilingual Interface**: The application supports both English and Nepali, making it accessible to a wider range of users.
- **Reporting**: Generate and download PDF reports for patient records and inventory status.

## Getting Started

To run the complete application locally, you will need to set up both the frontend and backend environments.

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/desaturne/codeyatra2.0_TeamSynapse_aasha.git
   cd codeyatra2.0_TeamSynapse_aasha
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory.
   - Install dependencies (`npm install`).
   - Configure your `.env` file with the database connection string and JWT secret.
   - Run Prisma migrations (`npm run prisma:migrate`).
   - Start the development server (`npm run dev`).
   - For detailed instructions, see the [Backend README](./backend/README.md).

3. **Frontend Setup**:
   - Navigate to the `frontend` directory.
   - Install dependencies (`npm install`).
   - Configure your `.env` file with the backend API URL.
   - Start the development server (`npm run dev`).
   - For detailed instructions, see the [Frontend README](./frontend/README.md).

## Team Synapse

This project was developed by Team Synapse for CodeYatra 2.0.
