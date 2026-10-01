import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ScoreChart({ scoreHistory }) {
  if (!scoreHistory || scoreHistory.length === 0) return null;

  const data = scoreHistory.map((s, i) => ({
    turn: `Turn ${i + 1}`,
    score: Math.round(((s.total_score || 0) / 8) * 100),
  }));

  return (
    <div className="score-chart-box">
      <div className="meter-title">Score Trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262d38" />
          <XAxis dataKey="turn" stroke="#8B93A1" fontSize={11} />
          <YAxis stroke="#8B93A1" fontSize={11} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: "#171224", border: "1px solid #2a2035", fontSize: 12 }}
            labelStyle={{ color: "#ECE9E1" }}
          />
          <Line type="monotone" dataKey="score" stroke="#E8A33D" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}