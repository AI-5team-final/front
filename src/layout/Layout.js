import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "../styles/Layout.scss";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
