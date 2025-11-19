import express from "express";
import Doctor from "../models/doctor.model.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Configure multer storage for doctor images
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

const router = express.Router();

// CREATE Doctor
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const created = await Doctor.create(data);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Error creating doctor", error });
  }
});

// LIST Doctors
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").toLowerCase();
    const docs = await Doctor.find();
    const filtered = search
      ? docs.filter(
          (d) =>
            (d.name || "").toLowerCase().includes(search) ||
            (d.specialization || "").toLowerCase().includes(search)
        )
      : docs;
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
});

// UPDATE Doctor
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const updated = await Doctor.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error });
  }
});

// DELETE Doctor
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Doctor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error });
  }
});

export default router;
