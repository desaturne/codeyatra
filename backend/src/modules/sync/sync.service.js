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

export const updateOne = async (table, id, data, userId) => {
  if (!Number.isInteger(id) || id <= 0) throw httpError(400, "id must be a positive integer");

  if (table === "inventory") {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "Inventory item not found");

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        name: data.name !== undefined ? String(data.name).trim() : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        threshold: data.threshold !== undefined ? Number(data.threshold) : undefined,
        expiryDate: data.expiryDate !== undefined ? new Date(data.expiryDate) : undefined,
      },
    });
    return { ok: true, action: "inventory:PUT", id: updated.id, data: updated };
  }

  if (table === "patients") {
    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "Patient not found");
    if (existing.userId !== Number(userId)) throw httpError(403, "Forbidden");

    const patch = {};
    if (data.name !== undefined) patch.name = String(data.name).trim();

    // Maternal fields
    if (data.age !== undefined) patch.age = Number(data.age);
    if (data.contactNumber !== undefined) patch.contactNumber = String(data.contactNumber);
    if (data.wardToleNo !== undefined) patch.wardToleNo = String(data.wardToleNo);
    if (data.husbandName !== undefined) patch.husbandName = String(data.husbandName);
    if (data.lastMenstrualPeriod !== undefined) patch.lastMenstrualPeriod = String(data.lastMenstrualPeriod);
    if (data.parity !== undefined) patch.parity = String(data.parity);
    if (data.pregnancyMonth !== undefined) patch.pregnancyMonth = String(data.pregnancyMonth);
    if (data.weight !== undefined) patch.weight = String(data.weight);
    if (data.bloodPressure !== undefined) patch.bloodPressure = String(data.bloodPressure);
    if (data.symptoms !== undefined) patch.symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];

    // Child fields
    if (data.dob !== undefined) patch.dob = String(data.dob);
    if (data.gender !== undefined) patch.gender = String(data.gender);
    if (data.birthWeight !== undefined) patch.birthWeight = String(data.birthWeight);
    if (data.muac !== undefined) patch.muac = String(data.muac);
    if (data.breastfeedingStatus !== undefined) patch.breastfeedingStatus = String(data.breastfeedingStatus);
    if (data.vaccines !== undefined) patch.vaccines = Array.isArray(data.vaccines) ? data.vaccines : [];

    const updated = await prisma.patient.update({ where: { id }, data: patch });
    return { ok: true, action: "patients:PUT", id: updated.id, data: updated };
  }

  throw httpError(400, `Invalid table: ${table}. Must be 'inventory' or 'patients'`);
};

export const deleteOne = async (table, id, userId) => {
  if (!Number.isInteger(id) || id <= 0) throw httpError(400, "id must be a positive integer");

  if (table === "inventory") {
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "Inventory item not found");

    await prisma.inventory.delete({ where: { id } });
    return { ok: true, action: "inventory:DELETE", id };
  }

  if (table === "patients") {
    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) throw httpError(404, "Patient not found");
    if (existing.userId !== Number(userId)) throw httpError(403, "Forbidden");

    await prisma.patient.delete({ where: { id } });
    return { ok: true, action: "patients:DELETE", id };
  }

  throw httpError(400, `Invalid table: ${table}. Must be 'inventory' or 'patients'`);
};