import { useEffect, useState } from "react";
import axios from "@/api/axios";

interface RoomType {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  pricePerNight: number;
  capacityThreshold: number; // ✅ NEW
}

const HOSPITAL_ID = "HOSP_TEST_001";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [name, setName] = useState("");
  const [totalBeds, setTotalBeds] = useState<number>(0);
  const [pricePerNight, setPricePerNight] = useState<number>(0);
  const [capacityThreshold, setCapacityThreshold] = useState<number>(0); // ✅ NEW

  const fetchRooms = async () => {
    const res = await axios.get(`/rooms/${HOSPITAL_ID}`);
    setRooms(res.data);
  };

  const handleCreate = async () => {
    if (!name || totalBeds <= 0 || pricePerNight <= 0) return;

    await axios.post("/rooms", {
      hospitalId: HOSPITAL_ID,
      name,
      totalBeds,
      pricePerNight,
      capacityThreshold, // ✅ SEND IT
    });

    setName("");
    setTotalBeds(0);
    setPricePerNight(0);
    setCapacityThreshold(0); // ✅ RESET
    fetchRooms();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/rooms/${id}`);
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Room Management</h1>

      {/* CREATE ROOM CARD */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold">Create Room Type</h2>

        {/* 4 columns now instead of 3 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div>
            <label className="text-sm font-medium block mb-2">
              Room Name
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. ICU, Deluxe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Total Beds
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={totalBeds}
              onChange={(e) => setTotalBeds(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Price Per Night (₹)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
            />
          </div>

          {/* ✅ NEW THRESHOLD FIELD */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Capacity Risk Threshold
            </label>
            <input
              type="number"
              min={0}
              className="w-full border rounded-lg px-3 py-2"
              value={capacityThreshold}
              onChange={(e) =>
                setCapacityThreshold(Number(e.target.value))
              }
              placeholder="e.g. 2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If available beds ≤ this value, capacity risk becomes CRITICAL.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Create Room
        </button>
      </div>

      {/* ROOM LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-card border rounded-2xl p-6 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{room.name}</h3>

              <button
                onClick={() => handleDelete(room.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>

            <p>
              Beds: {room.occupiedBeds} / {room.totalBeds}
            </p>

            <p>
              Available:{" "}
              <span className="font-medium">
                {room.totalBeds - room.occupiedBeds}
              </span>
            </p>

            <p className="font-medium">
              ₹ {room.pricePerNight} / night
            </p>

            {/* ✅ Show threshold */}
            <p className="text-sm text-muted-foreground">
              Risk Threshold: {room.capacityThreshold}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}