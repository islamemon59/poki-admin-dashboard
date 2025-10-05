import React from "react";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
