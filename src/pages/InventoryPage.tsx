import { useEffect, useState } from "react";
import axios from "@/api/axios";

interface InventoryItem {
  id: string;
  name: string;
  category: "MEDICINE" | "SUPPLY";
  unitCost: number;
  quantity: number;
  threshold?: number | null;
}

const HOSPITAL_ID = "HOSP_TEST_001";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"MEDICINE" | "SUPPLY">("MEDICINE");
  const [unitCost, setUnitCost] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [threshold, setThreshold] = useState<number | undefined>();

  const fetchInventory = async () => {
    const res = await axios.get(`/inventory/${HOSPITAL_ID}`);
    setItems(res.data);
  };

  const handleCreate = async () => {
    if (!name || unitCost <= 0 || quantity < 0) return;

    await axios.post("/inventory", {
      hospitalId: HOSPITAL_ID,
      name,
      category,
      unitCost,
      quantity,
      threshold,
    });

    setName("");
    setUnitCost(0);
    setQuantity(0);
    setThreshold(undefined);

    fetchInventory();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/inventory/${id}`);
    fetchInventory();
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Inventory Management</h1>

      {/* CREATE INVENTORY */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold">Add Inventory Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium block mb-2">
              Item Name
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paracetamol, O2 Cylinder"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Category
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "MEDICINE" | "SUPPLY")
              }
            >
              <option value="MEDICINE">Medicine</option>
              <option value="SUPPLY">Supply</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Unit Cost (₹)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Quantity
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={threshold ?? ""}
              onChange={(e) =>
                setThreshold(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Add Item
        </button>
      </div>

      {/* INVENTORY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const isLow =
            item.threshold !== null &&
            item.threshold !== undefined &&
            item.quantity <= item.threshold;

          return (
            <div
              key={item.id}
              className="bg-card border rounded-2xl p-6 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {item.name}
                </h3>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>

              <p>
                Category:{" "}
                <span className="font-medium">
                  {item.category}
                </span>
              </p>

              <p>Unit Cost: ₹ {item.unitCost}</p>

              <p>
                Stock:{" "}
                <span
                  className={
                    isLow ? "text-red-500 font-semibold" : ""
                  }
                >
                  {item.quantity}
                </span>
              </p>

              {isLow && (
                <p className="text-red-500 text-sm">
                  ⚠ Low Stock Alert
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}