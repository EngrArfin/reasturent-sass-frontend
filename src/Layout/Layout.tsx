import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">

      <Navbar />
      </div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
