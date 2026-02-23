import * as patientsService from "./patients.service.js";

export const getAllPatients = async (req, res) => {
  try {
    const patients = await patientsService.getAll(req.user.id);
    return res.json(patients);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const createPatient = async (req, res) => {
  try {
    const created = await patientsService.create(req.body, req.user.id);
    return res.status(201).json(created);
  } catch (err) {
    const code = err.statusCode || 400;
    return res.status(code).json({ message: err.message || "Bad request" });
  }
};

export const sendHighRiskAlerts = async (req, res) => {
  try {
    const result = await patientsService.sendHighRiskAlerts(req.user.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};