import { WeatherRecommendations } from "@/components/WeatherRecommendations";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WeatherDialog() {
  const [city, setCity] = useState("Mumbai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runWeather = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/agents/weather",
        {
          hospital_id: "HOSP_TEST_001",
          city,
        }
      );
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">
          Run Weather Intelligence
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Weather Intelligence</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Enter city (e.g. Mumbai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Button onClick={runWeather} disabled={loading}>
            {loading ? "Checking..." : "Check Weather"}
          </Button>

          {result && (
            <div className="mt-4 rounded-lg border p-3 text-sm">
              <p><b>City:</b> {city}</p>
              <p><b>Temperature:</b> {result.temp}°C</p>
              <p><b>AQI:</b> {result.aqi}</p>
              <p><b>Severity:</b> {result.severity}</p>

              <WeatherRecommendations
                severity={result.severity}
                aqi={result.aqi}
                temp={result.temp}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}