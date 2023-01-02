import { Fragment } from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";
import Nav from "./Nav";

const Layout = () => {
  return (
    <Fragment>
      <Nav />
      <main role="main">
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
