import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  patientPhone: String,
  patientImage: String,
  doctorName: String,
  doctorImage: String,
  specialization: String,
  date: String,
  time: String,
  mode: String,
  status: String,
});

export default mongoose.model("Appointment", appointmentSchema);
