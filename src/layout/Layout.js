import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "../styles/Layout.css";

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
