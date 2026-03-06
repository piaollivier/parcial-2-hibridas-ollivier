import React from "react";
import { Outlet } from "react-router";
import Nav from "./Nav.jsx";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="layout-container">
      <Nav />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;