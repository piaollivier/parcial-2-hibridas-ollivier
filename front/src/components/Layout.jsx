import React from "react";
import { Outlet } from "react-router";
import Nav from "./Nav.jsx";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="layout-container">
      <Nav />

      <div className="main-content">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;