import Appointment from '../models/appointment.model.js';

// Get all appointments (flat schema)
export const getAll = async (req, res) => {
  try {
    const list = await Appointment.find().sort({ date: -1, time: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Create appointment (accepts flat fields from frontend)
export const create = async (req, res) => {
  try {
    console.log('Create appointment payload:', req.body);
    const payload = {
      patientName: req.body.patientName,
      patientPhone: req.body.patientPhone,
      patientImage: req.body.patientImage,
      doctorName: req.body.doctorName,
      doctorImage: req.body.doctorImage,
      specialization: req.body.doctorSpeciality || req.body.specialization || req.body.doctorSpecialty,
      date: req.body.date,
      time: req.body.time,
      mode: req.body.mode,
      status: req.body.status,
    };

    const appt = await Appointment.create(payload);
    res.status(201).json(appt);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
};

export const update = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};
