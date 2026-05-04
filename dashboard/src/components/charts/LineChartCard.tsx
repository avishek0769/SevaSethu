import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardMeta, CardTitle } from "../ui/Card";
import "./chartjs";

type Props = {
  title: string;
  subtitle: string;
  labels: string[];
  data: number[];
  color?: string;
};

export function LineChartCard({ title, subtitle, labels, data, color = "var(--primary)" }: Props) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardMeta>{subtitle}</CardMeta>
        </div>
      </CardHeader>

      <div className="h-[260px]">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                borderColor: color,
                backgroundColor: color,
                tension: 0.35,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                grid: { color: "rgba(148,163,184,0.15)" },
                ticks: { color: "var(--fg-3)" },
              },
              y: {
                grid: { color: "rgba(148,163,184,0.15)" },
                ticks: { color: "var(--fg-3)" },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
