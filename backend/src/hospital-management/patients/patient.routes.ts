import { Router } from "express";
import {
  createPatient,
  admitPatient,
  dischargePatient,
  getAllPatients,
  scheduleAdmission, 
  cancelAdmission,
} from "./patient.service";

const router = Router();

/* ================= GET ALL PATIENTS ================= */

router.get("/", async (_req, res) => {
  try {
    const patients = await getAllPatients();
    res.json(patients);
  } catch (err: any) {
    console.error("GET PATIENTS ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to fetch patients",
    });
  }
});

/* ================= CREATE PATIENT ================= */

router.post("/", async (req, res) => {
  try {
    const { hospitalId, name, age, gender } = req.body;

    if (!hospitalId || !name || !age || !gender) {
      return res.status(400).json({
        error: "hospitalId, name, age, gender are required",
      });
    }

    const patient = await createPatient(
      hospitalId,
      name,
      Number(age),
      gender
    );

    res.status(201).json(patient);
  } catch (err: any) {
    console.error("CREATE PATIENT ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to create patient",
    });
  }
});

/* ================= ADMIT PATIENT ================= */

router.post("/admit", async (req, res) => {
  try {
    const { patientId, roomTypeId } = req.body;

    if (!patientId || !roomTypeId) {
      return res.status(400).json({
        error: "patientId and roomTypeId are required",
      });
    }

    const result = await admitPatient(patientId, roomTypeId);

    res.json(result);
  } catch (err: any) {
    console.error("ADMIT PATIENT ERROR:", err);

    // 🔥 Preserve specific bed error
    if (err?.message === "No beds available") {
      return res.status(400).json({
        error: "No beds available",
      });
    }

    res.status(400).json({
      error: err?.message || "Failed to admit patient",
    });
  }
});

/* ================= DISCHARGE PATIENT ================= */

router.post("/discharge", async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: "patientId is required",
      });
    }

    const bill = await dischargePatient(patientId);

    res.json(bill);
  } catch (err: any) {
    console.error("DISCHARGE PATIENT ERROR:", err);
    res.status(400).json({
      error: err?.message || "Failed to discharge patient",
    });
  }
});

/* ================= CANCEL ADMISSION ================= */

router.post("/cancel-admission", async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: "patientId is required",
      });
    }

    const result = await cancelAdmission(patientId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err?.message || "Failed to cancel admission",
    });
  }
});

/* ================= SCHEDULE ADMISSION ================= */

router.post("/schedule-admission", async (req, res) => {
  try {
    const { patientId, roomTypeId, hospitalId } = req.body;

    if (!patientId || !roomTypeId || !hospitalId) {
      return res.status(400).json({
        error: "patientId, roomTypeId and hospitalId are required",
      });
    }

    const result = await scheduleAdmission(
      patientId,
      roomTypeId,
      hospitalId
    );

    res.json(result);
  } catch (err: any) {
    console.error("SCHEDULE ADMISSION ERROR:", err);
    res.status(400).json({
      error: err?.message || "Failed to schedule admission",
    });
  }
});

export default router;