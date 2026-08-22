import KitchenCard from "./KitchenCard";
import KitchenProduction from "./KitchenProduction";

const KitchenDashboard = () => {
  return (
    <div>
      <div>
        <KitchenCard />
      </div>
      <div><KitchenProduction /></div>
    </div>
  );
};

export default KitchenDashboard;
