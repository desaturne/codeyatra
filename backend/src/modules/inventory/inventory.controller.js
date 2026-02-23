import * as inventoryService from "./inventory.service.js";

export const getAllInventory = async (req, res) => {
  try {
    const items = await inventoryService.getAll(req.user.id);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const createInventory = async (req, res) => {
  try {
    const created = await inventoryService.create(req.body, req.user.id);
    return res.status(201).json(created);
  } catch (err) {
    const code = err.statusCode || 400;
    return res.status(code).json({ message: err.message || "Bad request" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const updated = await inventoryService.update(req.params.id, req.body, req.user.id);
    console.log(req.body)
    return res.json(updated);
  } catch (err) {
    const code = err.statusCode || 400;
    return res.status(code).json({ message: err.message || "Bad request" });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const deleted = await inventoryService.remove(req.params.id, req.user.id);
    return res.json({ message: "Deleted", deleted });
  } catch (err) {
    const code = err.statusCode || 400;
    return res.status(code).json({ message: err.message || "Bad request" });
  }
};