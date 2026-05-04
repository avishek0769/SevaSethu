import { useMemo } from "react";
import { Card, CardHeader, CardMeta, CardTitle } from "../components/ui/Card";
import { BarChartCard } from "../components/charts/BarChartCard";
import { LineChartCard } from "../components/charts/LineChartCard";

export function AnalyticsPage() {
    const demandVsSupply = useMemo(() => {
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const demand = [120, 140, 155, 160, 170, 180];
        const supply = [95, 112, 126, 130, 145, 158];
        return { labels, demand, supply };
    }, []);

    const trends = useMemo(() => {
        const labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
        const data = [10, 12, 11, 15, 13, 16, 14, 17];
        return { labels, data };
    }, []);

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Analytics</CardTitle>
                        <CardMeta>
                            Demand vs supply + trends (simple charts)
                        </CardMeta>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <BarChartCard
                    title="Demand (6m)"
                    subtitle="Requests raised"
                    labels={demandVsSupply.labels}
                    data={demandVsSupply.demand}
                    color="var(--danger)"
                />
                <BarChartCard
                    title="Supply (6m)"
                    subtitle="Verified donations"
                    labels={demandVsSupply.labels}
                    data={demandVsSupply.supply}
                    color="var(--success)"
                />
            </div>

            <LineChartCard
                title="Weekly Trend"
                subtitle="Overall activity"
                labels={trends.labels}
                data={trends.data}
            />
        </div>
    );
}
