import express from "express";
import * as inventoryController from "./inventory.controller.js";
import { authMiddleware } from "../../middlelewares/auth.middleware.js";

const router = express.Router();

// All inventory routes are protected
router.use(authMiddleware);

router.get("/", inventoryController.getAllInventory);
router.post("/", inventoryController.createInventory);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

export default router;