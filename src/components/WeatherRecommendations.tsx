export function WeatherRecommendations({
  severity,
  aqi,
  temp,
}: {
  severity: string;
  aqi: number;
  temp: number;
}) {
  const recommendations: string[] = [];

  if (aqi > 150) {
    recommendations.push(
      "Limit outdoor patient movement",
      "Ensure N95 masks availability",
      "Activate air purification systems"
    );
  }

  if (temp > 35) {
    recommendations.push(
      "Prepare heat-stress response",
      "Increase hydration support",
      "Check cooling systems"
    );
  }

  if (severity === "CRITICAL") {
    recommendations.push(
      "Alert hospital command center",
      "Prepare surge capacity",
      "Notify emergency staff"
    );
  }

  return (
    <div className="mt-3">
      <h4 className="font-semibold text-red-600">
        Recommended Actions
      </h4>
      <ul className="list-disc ml-5 mt-1">
        {recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}