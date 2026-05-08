import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Navbar";

const Layout: React.FC = () => {
  const location = useLocation();

  const hidePage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {!hidePage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavBar />
        </div>
      )}
      <main>
        <Outlet />
      </main>
      {!hidePage && <Footer />}
    </div>
  );
};

export default Layout;
