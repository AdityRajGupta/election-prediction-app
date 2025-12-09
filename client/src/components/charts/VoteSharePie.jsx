import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const VoteSharePie = ({ voteShare }) => {
  const data = Object.entries(voteShare || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteSharePie;
