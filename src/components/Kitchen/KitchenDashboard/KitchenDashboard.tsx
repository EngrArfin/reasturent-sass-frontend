import React from "react";
import KitchenCard from "./KitchenCard";
import KitchenProduction from "./KitchenProduction";

const KitchenDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 md:p-8 space-y-8">
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
