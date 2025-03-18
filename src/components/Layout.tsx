
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 transition-all duration-300 page-transition">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
