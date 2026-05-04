import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardMeta, CardTitle } from "../ui/Card";
import "./chartjs";

type Props = {
  title: string;
  subtitle: string;
  labels: string[];
  data: number[];
};

export function DoughnutChartCard({ title, subtitle, labels, data }: Props) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardMeta>{subtitle}</CardMeta>
        </div>
      </CardHeader>

      <div className="h-[260px]">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: ["var(--primary)", "var(--primary-light)"],
                borderColor: ["var(--surface)", "var(--surface)"],
                borderWidth: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "var(--fg-2)" },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
