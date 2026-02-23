import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import patientRoutes from "./modules/patients/patients.routes.js";
import syncRoutes from "./modules/sync/sync.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/sync", syncRoutes);

export default app;