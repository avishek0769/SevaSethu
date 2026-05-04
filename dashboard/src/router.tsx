import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { UsersPage } from "./pages/UsersPage.tsx";
import { DonorActivityPage } from "./pages/DonorActivityPage.tsx";
import { RequestsPage } from "./pages/RequestsPage.tsx";
import { DonationsPage } from "./pages/DonationsPage.tsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.tsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.tsx";
import { AlertsPage } from "./pages/AlertsPage.tsx";
import { BloodBanksPage } from "./pages/BloodBanksPage.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            {
                path: "dashboard",
                element: <DashboardPage />,
                handle: { title: "Dashboard" },
            },
            {
                path: "users",
                element: <UsersPage />,
                handle: { title: "Users" },
            },
            {
                path: "donor-activity",
                element: <DonorActivityPage />,
                handle: { title: "Donor Activity" },
            },
            {
                path: "requests",
                element: <RequestsPage />,
                handle: { title: "Requests" },
            },
            {
                path: "donations",
                element: <DonationsPage />,
                handle: { title: "Donations" },
            },
            {
                path: "leaderboard",
                element: <LeaderboardPage />,
                handle: { title: "Leaderboard" },
            },
            {
                path: "analytics",
                element: <AnalyticsPage />,
                handle: { title: "Analytics" },
            },
            {
                path: "alerts",
                element: <AlertsPage />,
                handle: { title: "Alerts" },
            },
            {
                path: "blood-banks",
                element: <BloodBanksPage />,
                handle: { title: "Blood Banks" },
            },
            {
                path: "reports",
                element: <ReportsPage />,
                handle: { title: "Reports" },
            },
        ],
    },
]);
