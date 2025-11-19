import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({ //
  name: String,
  username: String,
  email: String,
  phone: String,
  dob: String,
  experience: String,
  department: String,
  designation: String,
  license: String,
  language: String,
  bloodGroup: String,
  gender: String,
  bio: String,
  address1: String,
  address2: String,
  country: String,
  city: String,
  state: String,
  pincode: String,
  image: String, // file path
});

export default mongoose.model("Doctor", doctorSchema);
