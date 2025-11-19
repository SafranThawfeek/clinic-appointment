import Patient from '../models/Patient.js';

export const getAll = async (req, res) => {
  const list = await Patient.find().sort({ createdAt: -1 });
  res.json(list);
};

// Optional create/update/delete if admin will manage patients:
export const create = async (req, res) => {
  const { name, email, phone } = req.body;
  const p = await Patient.create({ name, email, phone });
  res.status(201).json(p);
};
