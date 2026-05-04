import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardMeta, CardTitle } from "../ui/Card";
import "./chartjs";
import {
    resolveChartColor,
    resolveChartColors,
    withAlpha,
} from "./chartTheme";

type Props = {
    title: string;
    subtitle: string;
    labels: string[];
    data: number[];
};

export function DoughnutChartCard({ title, subtitle, labels, data }: Props) {
    const surface = resolveChartColor("var(--surface)");
    const fg2 = resolveChartColor("var(--fg-2)");
    const border = resolveChartColor("var(--border)");

    const palette = resolveChartColors([
        "var(--primary)",
        "var(--info)",
        "var(--success)",
        "var(--warning)",
        "var(--primary-light)",
    ]);
    const segmentColors = labels.map((_, i) => palette[i % palette.length]);

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
                                backgroundColor: segmentColors,
                                borderColor: labels.map(() => surface),
                                borderWidth: 3,
                                hoverOffset: 6,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom",
                                labels: { color: fg2 },
                            },
                            tooltip: {
                                enabled: true,
                                backgroundColor: withAlpha(surface, 0.96),
                                titleColor: fg2,
                                bodyColor: fg2,
                                borderColor: withAlpha(border, 0.9),
                                borderWidth: 1,
                            },
                        },
                    }}
                />
            </div>
        </Card>
    );
}
