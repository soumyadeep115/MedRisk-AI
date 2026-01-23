import { useEffect, useState } from "react";

export function PreparationAlerts() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8080/api/agents/event-replay?hospital_id=HOSP_TEST_001"
    )
      .then(res => res.json())
      .then(setEvents);
  }, []);

  const latestByType = new Map<string, any>();

events.forEach(e => {
  const key = e.payload.event_type;
  if (!latestByType.has(key)) {
    latestByType.set(key, e);
  }
});

const critical = Array.from(latestByType.values()).filter(
  e => e.payload.event_type === "CAPACITY"
);


  if (!critical.length) return null;

  return (
    <div className="border border-red-500 rounded-lg p-4 bg-red-50">
      <h3 className="font-semibold text-red-700 mb-2">
        ⚠️ Active Preparation Alerts
      </h3>

      {critical.map((e, i) => (
        <div key={i} className="text-sm text-red-800">
          • {e.payload.summary}
        </div>
      ))}
    </div>
  );
}
