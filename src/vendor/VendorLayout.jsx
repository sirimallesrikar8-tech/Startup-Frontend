import React from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import "./VendorLayout.css";

const VendorLayout = () => {
  return (
    <div className="vendor-layout">
      <VendorSidebar />
      <div className="vendor-main">
        <VendorTopbar />
        <div className="vendor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
