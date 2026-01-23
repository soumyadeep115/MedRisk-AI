import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function WeatherTrigger() {
  const weatherMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:8080/api/agents/weather",
        {
          hospital_id: "HOSP_TEST_001",
          city: "Mumbai",
        }
      );
      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <button
        onClick={() => weatherMutation.mutate()}
        disabled={weatherMutation.isPending}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {weatherMutation.isPending
          ? "Running Weather Agent..."
          : "Run Weather Intelligence"}
      </button>

      {weatherMutation.data && (
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(weatherMutation.data, null, 2)}
        </pre>
      )}

      {weatherMutation.isError && (
        <div className="text-red-600 text-sm">
          Weather agent failed. Check backend logs.
        </div>
      )}
    </div>
  );
}
