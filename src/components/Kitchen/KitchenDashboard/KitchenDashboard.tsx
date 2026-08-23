import React from "react";
import KitchenCard from "./KitchenCard";
import KitchenProduction from "./KitchenProduction";

const KitchenDashboard: React.FC = () => {
  return (
    <div className="w-full text-white space-y-8 max-w-[1600px] mx-auto">
      {/* Top Metric Cards & Station Alert Banner */}
      <section>
        <KitchenCard />
      </section>

      {/* Main Kitchen Production Ticket Stream */}
      <section className="pt-2">
        <KitchenProduction />
      </section>
    </div>
  );
};

export default KitchenDashboard;
