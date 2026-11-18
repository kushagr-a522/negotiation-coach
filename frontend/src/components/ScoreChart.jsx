import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ScoreChart({ scoreHistory }) {
  const data = (scoreHistory || []).map((s, i) => ({
    n: i + 1,
    score: Math.round(((s.total_score || 0) / 8) * 100),
  }));

  return (
    <section className="ch-card ch-trend">
      <div className="ch-card-head">
        <h2>Score Trend</h2>
      </div>

      {data.length === 0 ? (
        <p className="ch-trend-empty">Your trend shows up after your first message.</p>
      ) : (
        <div className="ch-trend-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="chFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f7780f" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#f7780f" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(247,120,15,0.16)" />
              <XAxis dataKey="n" stroke="#2b2420" fontSize={12} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                stroke="#2b2420"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Score"]}
                labelFormatter={(n) => `Message ${n}`}
                contentStyle={{ borderRadius: 12, border: "1px solid #fbd6ba", fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#f7780f"
                strokeWidth={3}
                fill="url(#chFill)"
                dot={{ r: 4, fill: "#f7780f", stroke: "#f7780f" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}