import prisma from "../../config/db.js";
import * as patientsService from "../patients/patients.service.js";

const httpError = (statusCode, message) => {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
};

const toInt = (v, name = "value") => {
  const n = Number(v);
  if (!Number.isInteger(n)) throw httpError(400, `${name} must be an integer`);
  return n;
};

const isValidOperation = (op) => ["POST", "PUT", "DELETE"].includes(op);
const isValidTable = (t) => ["patients", "inventory"].includes(t);

export const bulkSync = async (operations, userId) => {
  // Strategy: process sequentially, stop on first failure (safe + predictable)
  // If you want "best-effort", you can continue and return per-op errors.
  const results = [];

  for (let i = 0; i < operations.length; i++) {
    const item = operations[i];

    if (!item || typeof item !== "object") {
      throw httpError(400, `Operation at index ${i} must be an object`);
    }

    const { operation, table, recordId, payload } = item;

    if (!isValidOperation(operation)) throw httpError(400, `Invalid operation at index ${i}`);
    if (!isValidTable(table)) throw httpError(400, `Invalid table at index ${i}`);

    // INVENTORY
    if (table === "inventory") {
      if (operation === "POST") {
        const created = await prisma.inventory.create({
          data: {
            name: String(payload?.name || "").trim(),
            stock: Number(payload?.stock ?? 0),
            threshold: Number(payload?.threshold ?? 0),
            expiryDate: payload?.expiryDate ? new Date(payload.expiryDate) : new Date(),
            createdAt: payload?.createdAt ? new Date(payload.createdAt) : undefined,
          },
        });

        results.push({ index: i, ok: true, action: "inventory:POST", id: created.id });
        continue;
      }

      const id = toInt(recordId, "recordId");

      if (operation === "PUT") {
        const updated = await prisma.inventory.update({
          where: { id },
          data: {
            name: payload?.name !== undefined ? String(payload.name).trim() : undefined,
            stock: payload?.stock !== undefined ? Number(payload.stock) : undefined,
            threshold: payload?.threshold !== undefined ? Number(payload.threshold) : undefined,
            expiryDate: payload?.expiryDate !== undefined ? new Date(payload.expiryDate) : undefined,
            updatedAt: payload?.updatedAt !== undefined ? new Date(payload.updatedAt) : undefined,
          },
        });

        results.push({ index: i, ok: true, action: "inventory:PUT", id: updated.id });
        continue;
      }

      if (operation === "DELETE") {
        await prisma.inventory.delete({ where: { id } });
        results.push({ index: i, ok: true, action: "inventory:DELETE", id });
        continue;
      }
    }

    // PATIENTS
    if (table === "patients") {
      if (operation === "POST") {
        const created = await patientsService.create(payload, userId);
        results.push({ index: i, ok: true, action: "patients:POST", id: created.id });
        continue;
      }

      // Your frontend syncQueue spec only needs POST for patients right now
      throw httpError(400, `patients only supports POST in bulk sync (index ${i})`);
    }
  }

  return { message: "Sync completed", processed: results.length, results };
};