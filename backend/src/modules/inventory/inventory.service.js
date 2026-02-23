import prisma from "../../config/db.js";

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

const toDate = (v, name = "date") => {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw httpError(400, `${name} is invalid`);
  return d;
};

export const getAll = async (userId) => {
  // Inventory is global (shared) in your current Prisma schema.
  // If you later want per-user inventory, add userId field to Inventory model and filter here.
  return prisma.inventory.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const create = async (data) => {
  if (!data?.name) throw httpError(400, "name is required");
  if (data.stock === undefined) throw httpError(400, "stock is required");
  if (data.threshold === undefined) throw httpError(400, "threshold is required");
  if (!data.expiryDate) throw httpError(400, "expiryDate is required");

  const stock = toInt(data.stock, "stock");
  const threshold = toInt(data.threshold, "threshold");
  const expiryDate = toDate(data.expiryDate, "expiryDate");

  return prisma.inventory.create({
    data: {
      name: String(data.name).trim(),
      stock,
      threshold,
      expiryDate,
      createdAt: data.createdAt ? toDate(data.createdAt, "createdAt") : undefined,
    },
  });
};

export const update = async (id, data) => {
  const inventoryId = toInt(id, "id");

  const existing = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!existing) throw httpError(404, "Inventory item not found");

  const patch = {};

  if (data.name !== undefined) patch.name = String(data.name).trim();
  if (data.stock !== undefined) patch.stock = toInt(data.stock, "stock");
  if (data.threshold !== undefined) patch.threshold = toInt(data.threshold, "threshold");
  if (data.expiryDate !== undefined) patch.expiryDate = toDate(data.expiryDate, "expiryDate");
  if (data.updatedAt !== undefined) patch.updatedAt = toDate(data.updatedAt, "updatedAt");

  return prisma.inventory.update({
    where: { id: inventoryId },
    data: patch,
  });
};

export const remove = async (id) => {
  const inventoryId = toInt(id, "id");

  const existing = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!existing) throw httpError(404, "Inventory item not found");

  return prisma.inventory.delete({ where: { id: inventoryId } });
};