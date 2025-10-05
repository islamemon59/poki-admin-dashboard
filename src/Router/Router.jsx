import { createBrowserRouter } from "react-router";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Dashboard/DashboardHome";
import AdminProfile from "../Components/AdminProfile/AdminProfile";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: DashboardLayout,
        children: [
            {
                index: true,
                Component: DashboardHome,
            },
            {
                path: "/profile",
                Component: AdminProfile,
            },
        ]
    }
])