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
  // Patients are per-user in your schema (Patient.userId)
  return prisma.patient.findMany({
    where: { userId: Number(userId) },
    include: { medicine: true },
    orderBy: { createdAt: "desc" },
  });
};

export const create = async (data, userId) => {
  if (!data?.name) throw httpError(400, "name is required");
  if (!data?.type) throw httpError(400, "type is required (maternal|child)");

  const type = String(data.type);
  if (!["maternal", "child"].includes(type)) {
    throw httpError(400, "type must be maternal or child");
  }

  const quantity = data.quantity !== undefined ? toInt(data.quantity, "quantity") : 1;
  if (quantity <= 0) throw httpError(400, "quantity must be > 0");

  const medicineId =
    data.medicineId !== undefined && data.medicineId !== null
      ? toInt(data.medicineId, "medicineId")
      : null;

  // Maternal fields
  const maternalFields = type === "maternal" ? {
    age: data.age !== undefined ? toInt(data.age, "age") : null,
    contactNumber: data.contactNumber ? String(data.contactNumber) : null,
    wardToleNo: data.wardToleNo ? String(data.wardToleNo) : null,
    husbandName: data.husbandName ? String(data.husbandName) : null,
    lastMenstrualPeriod: data.lastMenstrualPeriod ? String(data.lastMenstrualPeriod) : null,
    parity: data.parity ? String(data.parity) : null,
    pregnancyMonth: data.pregnancyMonth ? String(data.pregnancyMonth) : null,
    weight: data.weight ? String(data.weight) : null,
    bloodPressure: data.bloodPressure ? String(data.bloodPressure) : null,
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
  } : {};

  // Child fields
  const childFields = type === "child" ? {
    dob: data.dob ? String(data.dob) : null,
    gender: data.gender ? String(data.gender) : null,
    birthWeight: data.birthWeight ? String(data.birthWeight) : null,
    muac: data.muac ? String(data.muac) : null,
    breastfeedingStatus: data.breastfeedingStatus ? String(data.breastfeedingStatus) : null,
    vaccines: Array.isArray(data.vaccines) ? data.vaccines : [],
  } : {};

  return prisma.$transaction(async (tx) => {
    if (medicineId) {
      const med = await tx.inventory.findUnique({ where: { id: medicineId } });
      if (!med) throw httpError(404, "medicineId not found");

      if (med.stock < quantity) {
        throw httpError(409, `Insufficient stock for ${med.name}. Available: ${med.stock}`);
      }

      await tx.inventory.update({
        where: { id: medicineId },
        data: { stock: { decrement: quantity } },
      });
    }

    const created = await tx.patient.create({
      data: {
        name: String(data.name).trim(),
        type,
        quantity,
        medicineId: medicineId || null,
        userId: Number(userId),
        createdAt: data.createdAt ? toDate(data.createdAt, "createdAt") : undefined,
        ...maternalFields,
        ...childFields,
      },
      include: { medicine: true },
    });

    return created;
  });
};