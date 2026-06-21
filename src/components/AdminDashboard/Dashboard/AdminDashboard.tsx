import BusinessManagement from "../Business/BusinessManagement";
import AdminCard from "./AdminCard";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminCard/>
      <BusinessManagement/>
    </div>
  );
};

export default AdminDashboard;
