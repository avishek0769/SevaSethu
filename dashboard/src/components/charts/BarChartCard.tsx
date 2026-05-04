import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardMeta, CardTitle } from "../ui/Card";
import "./chartjs";

type Props = {
    title: string;
    subtitle: string;
    labels: string[];
    data: number[];
    color?: string;
};

export function BarChartCard({
    title,
    subtitle,
    labels,
    data,
    color = "var(--info)",
}: Props) {
    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardMeta>{subtitle}</CardMeta>
                </div>
            </CardHeader>

            <div className="h-[260px]">
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: title,
                                data,
                                backgroundColor: color,
                                borderRadius: 10,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: {
                                grid: { display: false },
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
