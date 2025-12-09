import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BoothTrendChart = ({ trend }) => {
  const data = trend || [];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Example assuming BJP/INC fields exist */}
          <Line type="monotone" dataKey="BJP" />
          <Line type="monotone" dataKey="INC" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BoothTrendChart;
