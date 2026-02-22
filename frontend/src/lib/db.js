import Dexie from "dexie";

const db = new Dexie("codeyatra");

db.version(1).stores({
  inventory: "++id, name, stock, threshold, expiryDate, createdAt, updatedAt",
  patients: "++id, name, type, createdAt",
  syncQueue: "++id, operation, table, recordId, payload, createdAt",
});

export default db;
