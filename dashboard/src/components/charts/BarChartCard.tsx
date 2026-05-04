import { Bar } from "react-chartjs-2";
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

export function BarChartCard({
    title,
    subtitle,
    labels,
    data,
    color = "var(--info)",
}: Props) {
    const fill = resolveChartColor(color);
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
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: title,
                                data,
                                backgroundColor: fill,
                                borderRadius: 10,
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
                        interaction: { mode: "nearest", intersect: true },
                        scales: {
                            x: {
                                grid: { display: false },
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
