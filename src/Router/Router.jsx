import { createBrowserRouter } from "react-router";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Dashboard/DashboardHome";
import AdminProfile from "../Components/AdminProfile/AdminProfile";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ForbiddenPage from "../Components/Forbidden/Forbidden";
import AdminRoute from "../Private/AdminRoute";
import UpdateProfile from "../Components/UpdateProfile/UpdateProfile";
import Games from "../Pages/Games/Games";
import UpdateForm from "../Pages/Games/UpdateForm/UpdateForm";
import AddGames from "../Pages/AddGames/AddGames";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <AdminRoute>
            <DashboardHome></DashboardHome>
          </AdminRoute>
        ),
      },
      {
        path: "/games",
        element: (
          <AdminRoute>
            <Games />
          </AdminRoute>
        ),
      },
      {
        path: "/update/:id",
        element: (
          <AdminRoute>
            <UpdateForm />
          </AdminRoute>
        ),
      },
      {
        path: "/addGames",
        element: (
          <AdminRoute>
            <AddGames/>
          </AdminRoute>
        ),
      },
      {
        path: "/updateProfile",
        Component: UpdateProfile,
      },
      {
        path: "/profile",
        Component: AdminProfile,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/forbidden",
    Component: ForbiddenPage,
  },
]);
