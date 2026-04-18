import SideMenu from "@/components/side-menu";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <main className="flex-1 min-w-0 overflow-hidden bg-primary/15 p-4">
        <div className="custom-scrollbar h-full min-w-0 overflow-x-hidden rounded-2xl bg-gray-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
