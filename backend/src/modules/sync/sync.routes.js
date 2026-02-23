import express from "express";
import * as syncController from "./sync.controller.js";
import { authMiddleware } from "../../middlelewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", syncController.bulkSync);


export default router;