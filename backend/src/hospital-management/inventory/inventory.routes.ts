import { Router } from "express";
import {
  createInventoryItem,
  assignInventoryToPatient,
  getInventoryByHospital,
  updateInventoryQuantity,
  deleteInventoryItem,
} from "./inventory.service";

const router = Router();

/* ================= CREATE ================= */

router.post("/", async (req, res) => {
  try {
    const {
      hospitalId,
      name,
      category,
      unitCost,
      quantity,
      threshold,
    } = req.body;

    const item = await createInventoryItem(
      hospitalId,
      name,
      category,
      unitCost,
      quantity,
      threshold
    );

    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= GET ================= */

router.get("/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const items = await getInventoryByHospital(hospitalId);
    res.json(items);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= UPDATE ================= */

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updated = await updateInventoryQuantity(id, quantity);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= DELETE ================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteInventoryItem(id);
    res.json({ message: "Inventory item deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= ASSIGN TO PATIENT ================= */

router.post("/assign", async (req, res) => {
  try {
    const { patientId, inventoryId, quantityUsed } = req.body;

    const result = await assignInventoryToPatient(
      patientId,
      inventoryId,
      quantityUsed
    );

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;