import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CCTVTrendChartProps {
  data: {
    timestamp_ms: number;
    crowd_density_score: number;
  }[];
}

export const CCTVTrendChart = ({ data }: CCTVTrendChartProps) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="timestamp_ms"
            tickFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          />
          <YAxis domain={[0, 100]} />
          <Tooltip
            labelFormatter={(ts) =>
              new Date(Number(ts)).toLocaleString()
            }
          />
          <Line
            type="monotone"
            dataKey="crowd_density_score"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
