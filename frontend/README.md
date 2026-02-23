# AASHA Frontend

This is the frontend application for AASHA, a maternal and child health records system with inventory management. It is built with an offline-first architecture to ensure functionality even in areas with poor internet connectivity.

## Tech Stack

- **React 19**: UI library.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Zustand**: Lightweight state management.
- **Dexie.js**: IndexedDB wrapper for offline data storage.
- **React Router DOM**: Application routing.
- **i18next**: Internationalization (supports English and Nepali).
- **jsPDF**: PDF report generation.
- **Axios**: HTTP client for API requests.
- **Lucide React**: Icon library.

## Features

- **Offline-First Architecture**: Uses IndexedDB (via Dexie.js) to store inventory and patient records locally. Changes made offline are queued and automatically synchronized with the backend when the connection is restored.
- **Bilingual Support**: Full support for English and Nepali languages.
- **Authentication**: Secure login and registration flows.
- **Dashboard & Visualisation**: Overview of health records and inventory status.
- **Patient Registration**: Dedicated forms for registering maternal and child health records.
- **Inventory Tracker**: Manage medicines and supplies, track stock levels, and monitor expiry dates.
- **PDF Reports**: Generate downloadable PDF reports for records and inventory.

## Project Structure

- `src/components/`: Reusable UI components and layouts.
- `src/pages/`: Application pages (Dashboard, Login, Register, Tracker, etc.).
- `src/routes/`: Route definitions and protected route wrappers.
- `src/store/`: Zustand stores for global state management (`useAuthStore`, `useInventoryStore`).
- `src/lib/`: Core libraries and utilities:
  - `axios.js`: Configured Axios instance.
  - `db.js`: Dexie.js database configuration for offline storage.
  - `sync.js`: Logic for synchronizing offline data with the backend.
- `src/i18n/`: Internationalization configuration and translation files.
- `public/assets/`: Static assets like images and icons.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `frontend` directory and add the necessary variables (e.g., API base URL):
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

### Running the Application

- **Development mode**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```

The development server will typically start on `http://localhost:5173`.
