import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({ //
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dob: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  address1: { type: String },
  address2: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  primaryDoctor: { type: String },
  status: { type: String },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
