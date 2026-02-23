import * as syncService from "./sync.service.js";

export const bulkSync = async (req, res) => {
  try {
    const ops = req.body;
    if (!Array.isArray(ops)) {
      return res.status(400).json({ message: "Payload must be an array of operations" });
    }

    const result = await syncService.bulkSync(ops, req.user.id);
    return res.json(result);
  } catch (err) {
    const code = err.statusCode || 400;
    return res.status(code).json({ message: err.message || "Sync failed" });
  }
};