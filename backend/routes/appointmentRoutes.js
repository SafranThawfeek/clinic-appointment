import express from "express";
import {
  getAll,
  create,
  update,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// CREATE appointment
router.post("/", create);

// GET all appointments
router.get("/", getAll);

// UPDATE appointment
router.put("/:id", update);

// DELETE appointment
router.delete("/:id", deleteAppointment);

export default router;
