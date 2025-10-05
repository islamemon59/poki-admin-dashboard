import { createBrowserRouter } from "react-router";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Dashboard/DashboardHome";
import AdminProfile from "../Components/AdminProfile/AdminProfile";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

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
    },
                {
                path: "/login",
                Component: Login,
            },
                {
                path: "/register",
                Component: Register,
            },
])