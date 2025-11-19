const Doctor = require("../models/doctor.model.js");
const path = require("path");

const addDoctor = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const doctor = new Doctor(data);
    await doctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Doctor updated", doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addDoctor, getDoctors, updateDoctor, deleteDoctor };
