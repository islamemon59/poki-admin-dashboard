import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Dashboard from "../Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
        ]
    }
])