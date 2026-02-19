import { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/* ================= API CONFIG ================= */

const API_BASE = "http://localhost:8080/api";
const HOSPITAL_ID = "HOSP_TEST_001";

/* ================= TYPES ================= */

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    discharged: boolean;
    admittedAt?: string | null;
    roomTypeId?: string | null;
    roomType?: { name: string };
}

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
}

interface RoomType {
    id: string;
    name: string;
    totalBeds: number;
    occupiedBeds: number;
}

/* ================= PAGE ================= */

export function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [openCreate, setOpenCreate] = useState(false);

    // 🔥 NEW STATES (nothing removed)
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [pendingPatientId, setPendingPatientId] = useState<string | null>(null);
    const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);

    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        gender: "",
        roomTypeId: "",
    });

    /* ================= FETCH ================= */

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE}/patients`);
            setPatients(res.data);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await axios.get(
                `${API_BASE}/rooms/${HOSPITAL_ID}`
            );
            setRooms(res.data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    useEffect(() => {
        fetchPatients();
        fetchRooms();
    }, []);

    /* ================= CREATE ================= */

    const handleCreate = async () => {
        try {
            const res = await axios.post(`${API_BASE}/patients`, {
                hospitalId: HOSPITAL_ID,
                name: newPatient.name,
                age: Number(newPatient.age),
                gender: newPatient.gender,
            });

            const createdPatient = res.data;

            if (newPatient.roomTypeId) {
                try {
                    await axios.post(`${API_BASE}/patients/admit`, {
                        patientId: createdPatient.id,
                        roomTypeId: newPatient.roomTypeId,
                    });
                } catch (error: any) {
                    if (error.response?.data?.error === "No beds available") {
                        setPendingPatientId(createdPatient.id);
                        setPendingRoomId(newPatient.roomTypeId);
                        setShowScheduleDialog(true);
                    } else {
                        console.error("Admit failed:", error);
                    }
                }
            }

            setOpenCreate(false);
            setNewPatient({
                name: "",
                age: "",
                gender: "",
                roomTypeId: "",
            });

            fetchPatients();
            fetchRooms();
        } catch (error) {
            console.error("Create failed:", error);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Patients Management</CardTitle>
                    <Button onClick={() => setOpenCreate(true)}>
                        + Create Patient
                    </Button>
                </CardHeader>
            </Card>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="admitted">Admitted</TabsTrigger>
                    <TabsTrigger value="discharged">Discharged</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <PatientTable patients={patients} refresh={fetchPatients} />
                </TabsContent>

                <TabsContent value="admitted">
                    <PatientTable
                        patients={patients.filter((p) => !p.discharged)}
                        refresh={fetchPatients}
                    />
                </TabsContent>

                <TabsContent value="discharged">
                    <PatientTable
                        patients={patients.filter((p) => p.discharged)}
                        refresh={fetchPatients}
                    />
                </TabsContent>
            </Tabs>

            {/* ================= CREATE MODAL ================= */}

            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Patient</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={newPatient.name}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, name: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Age"
                            type="number"
                            value={newPatient.age}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, age: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Gender"
                            value={newPatient.gender}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, gender: e.target.value })
                            }
                        />

                        <select
                            className="w-full border rounded-lg px-3 py-2"
                            value={newPatient.roomTypeId}
                            onChange={(e) =>
                                setNewPatient({
                                    ...newPatient,
                                    roomTypeId: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Room Type</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name} (Available: {room.totalBeds - room.occupiedBeds})
                                </option>
                            ))}
                        </select>

                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 🔥 SCHEDULE ADMISSION DIALOG (INSIDE COMPONENT) */}

            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Beds Not Available</DialogTitle>
                    </DialogHeader>

                    <p>No beds available right now.</p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowScheduleDialog(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={async () => {
                                if (!pendingPatientId || !pendingRoomId) return;

                                await axios.post(
                                    `${API_BASE}/patients/schedule-admission`,
                                    {
                                        patientId: pendingPatientId,
                                        roomTypeId: pendingRoomId,
                                        hospitalId: HOSPITAL_ID,
                                    }
                                );

                                setShowScheduleDialog(false);
                                fetchPatients();
                            }}
                        >
                            Schedule Admission
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* ================= TABLE ================= */

function PatientTable({
    patients,
    refresh,
}: {
    patients: Patient[];
    refresh: () => void;
}) {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState("");
    const [quantityUsed, setQuantityUsed] = useState(1);
    const [openInventory, setOpenInventory] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            const res = await axios.get(
                `${API_BASE}/inventory/${HOSPITAL_ID}`
            );
            setInventory(res.data);
        };

        fetchInventory();
    }, []);

    const discharge = async (id: string) => {
        try {
            await axios.post(`${API_BASE}/patients/discharge`, {
                patientId: id,
            });
            refresh();
        } catch (error) {
            console.error("Discharge failed:", error);
        }
    };

    const assignInventory = async () => {
        if (!selectedPatient || !selectedItem) return;

        await axios.post(`${API_BASE}/inventory/assign`, {
            patientId: selectedPatient,
            inventoryId: selectedItem,
            quantityUsed,
        });

        setOpenInventory(false);
        setSelectedItem("");
        setQuantityUsed(1);
        refresh();
    };

    return (
        <>
            <Card>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Room</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {patients.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="p-2">{p.name}</td>
                                    <td className="text-center">{p.age}</td>
                                    <td className="text-center">{p.gender}</td>
                                    <td className="text-center">
                                        {p.roomType?.name || "—"}
                                    </td>
                                    <td className="text-center">
                                        {p.discharged ? (
                                            <Badge variant="outline">Discharged</Badge>
                                        ) : p.roomTypeId ? (
                                            <Badge>Admitted</Badge>
                                        ) : (
                                            <Badge variant="secondary">Not Assigned</Badge>
                                        )}
                                    </td>

                                    <td className="text-center space-x-2">
                                        {!p.discharged && p.roomTypeId && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedPatient(p.id);
                                                        setOpenInventory(true);
                                                    }}
                                                >
                                                    Use Inventory
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => discharge(p.id)}
                                                >
                                                    Discharge
                                                </Button>
                                            </>
                                        )}

                                        {!p.discharged && !p.roomTypeId && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={async () => {
                                                    await axios.post(`${API_BASE}/patients/cancel-admission`, {
                                                        patientId: p.id,
                                                    });
                                                    refresh();
                                                }}
                                            >
                                                Cancel Admission
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Dialog open={openInventory} onOpenChange={setOpenInventory}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Inventory</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <select
                            className="w-full border rounded-lg px-3 py-2"
                            value={selectedItem}
                            onChange={(e) => setSelectedItem(e.target.value)}
                        >
                            <option value="">Select Item</option>
                            {inventory.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (Stock: {item.quantity})
                                </option>
                            ))}
                        </select>

                        <Input
                            type="number"
                            min="1"
                            value={quantityUsed}
                            onChange={(e) =>
                                setQuantityUsed(Number(e.target.value))
                            }
                            placeholder="Quantity"
                        />

                        <Button onClick={assignInventory}>
                            Assign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}