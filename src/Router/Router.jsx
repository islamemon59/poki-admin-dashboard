import { createBrowserRouter } from "react-router";
import Dashboard from "../Dashboard/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: DashboardLayout,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
        ]
    }
])