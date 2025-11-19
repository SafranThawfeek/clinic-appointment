import express from 'express';
const router = express.Router();
import Patient from '../models/Patient.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Configure multer storage for patient images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

// GET all patients
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search || "").toLowerCase();
    const patients = await Patient.find();
    const filtered = search
      ? patients.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(search) ||
            (p.email || "").toLowerCase().includes(search) ||
            (p.phone || "").toLowerCase().includes(search)
        )
      : patients;
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

// CREATE patient
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const data = req.body;
    
    console.log('Patient creation - req.body:', data);
    console.log('Patient creation - req.file:', req.file);
    
    // Validate required fields
    if (!data.name || !data.email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    
    // Add image path if file was uploaded
    if (req.file) {
      console.log('Image uploaded:', req.file.filename);
      data.profileImage = `/uploads/${req.file.filename}`;
    }
    
    const created = await Patient.create(data);
    console.log('Patient created:', created);
    res.status(201).json(created);
  } catch (error) {
    console.error('Patient creation error:', error);
    res.status(400).json({ 
      message: "Error creating patient", 
      error: error.message || error 
    });
  }
});

// UPDATE patient
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    console.log('Patient update - ID:', id);
    console.log('Patient update - req.body:', data);
    console.log('Patient update - req.file:', req.file);
    
    // Add image path if file was uploaded
    if (req.file) {
      console.log('Image uploaded:', req.file.filename);
      data.profileImage = `/uploads/${req.file.filename}`;
    } else {
      // If no new file is uploaded, but profileImage is an empty object, remove it.
      if (data.profileImage && typeof data.profileImage === 'object' && Object.keys(data.profileImage).length === 0) delete data.profileImage;
    }
    
    const updated = await Patient.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    
    console.log('Patient updated:', updated);
    res.json(updated);
  } catch (error) {
    console.error('Patient update error:', error);
    res.status(400).json({ 
      message: "Error updating patient", 
      error: error.message || error 
    });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error });
  }
});

export default router;
