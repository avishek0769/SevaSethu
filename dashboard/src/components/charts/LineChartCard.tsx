import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardMeta, CardTitle } from "../ui/Card";
import "./chartjs";
import { resolveChartColor, withAlpha } from "./chartTheme";

type Props = {
    title: string;
    subtitle: string;
    labels: string[];
    data: number[];
    color?: string;
};

export function LineChartCard({
    title,
    subtitle,
    labels,
    data,
    color = "var(--primary)",
}: Props) {
    const stroke = resolveChartColor(color);
    const fg2 = resolveChartColor("var(--fg-2)");
    const fg3 = resolveChartColor("var(--fg-3)");
    const border = resolveChartColor("var(--border)");
    const surface = resolveChartColor("var(--surface)");
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
                                borderColor: stroke,
                                backgroundColor: stroke,
                                tension: 0.35,
                                pointRadius: 0,
                                pointHitRadius: 14,
                                borderWidth: 2,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: true,
                                backgroundColor: withAlpha(surface, 0.96),
                                titleColor: fg2,
                                bodyColor: fg2,
                                borderColor: withAlpha(border, 0.9),
                                borderWidth: 1,
                                displayColors: false,
                            },
                        },
                        interaction: { mode: "nearest", intersect: false },
                        scales: {
                            x: {
                                grid: { color: withAlpha(border, 0.35) },
                                ticks: { color: fg3 },
                            },
                            y: {
                                grid: { color: withAlpha(border, 0.35) },
                                ticks: { color: fg3 },
                            },
                        },
                    }}
                />
            </div>
        </Card>
    );
}
