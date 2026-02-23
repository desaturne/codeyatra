import Dexie from "dexie";

const db = new Dexie("codeyatra");

db.version(1).stores({
  inventory: "++id, name, stock, threshold, expiryDate, createdAt, updatedAt",
  patients: "++id, name, type, createdAt",
  syncQueue: "++id, operation, table, recordId, payload, createdAt",
});

// v2: expanded patient fields for maternal and child
db.version(2).stores({
  inventory: "++id, name, stock, threshold, expiryDate, createdAt, updatedAt",
  patients:
    "++id, name, type, createdAt, age, contactNumber, wardToleNo, husbandName, lastMenstrualPeriod, parity, pregnancyMonth, weight, bloodPressure, *symptoms, dob, gender, birthWeight, muac, breastfeedingStatus, *vaccines",
  syncQueue: "++id, operation, table, recordId, payload, createdAt",
});

export default db;
