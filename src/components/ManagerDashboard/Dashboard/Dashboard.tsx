import InventoryTable from "../Inventory/InventoryTable";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <DashboardCard />
      </div>
      <div>
        <InventoryTable />
      </div>
    </div>
  );
};

export default Dashboard;
