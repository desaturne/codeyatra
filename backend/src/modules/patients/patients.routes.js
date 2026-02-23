import express from "express";
import * as patientsController from "./patients.controller.js";
import { authMiddleware } from "../../middlelewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", patientsController.getAllPatients);
router.post("/", patientsController.createPatient);

export default router;