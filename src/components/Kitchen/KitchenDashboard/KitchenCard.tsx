import React, { useState } from "react";
import {
  TrendingUp,
  Timer,
  Flame,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface KitchenStatsProps {
  completedCount?: number;
  avgPrepTime?: string;
  stationAlert?: {
    stationName: string;
    capacity: number;
    description: string;
  };
}

const KitchenCard: React.FC<KitchenStatsProps> = ({
  completedCount = 42,
  avgPrepTime = "14m",
  stationAlert = {
    stationName: "Grill station",
    capacity: 92,
    description: "Grill station operating at 92% capacity.",
  },
}) => {
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);

  const stationData = [
    { name: "Grill Station", load: 92, status: "Critical", chef: "Chef Alex", tickets: 8, color: "bg-red-500" },
    { name: "Fryer Station", load: 68, status: "Normal", chef: "Chef Maria", tickets: 5, color: "bg-amber-500" },
    { name: "Bakery / Tandoor", load: 84, status: "High", chef: "Chef Rahul", tickets: 7, color: "bg-orange-500" },
    { name: "Salad & Cold Bar", load: 35, status: "Optimal", chef: "Chef Elena", tickets: 2, color: "bg-emerald-500" },
    { name: "Beverage & Bar", load: 45, status: "Optimal", chef: "Chef Liam", tickets: 4, color: "bg-blue-500" },
    { name: "Plating & Expo", load: 78, status: "Elevated", chef: "Expo Lead", tickets: 6, color: "bg-purple-500" },
  ];

  return (
    <div className="w-full">
      {/* 3 Metric / Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Completed Today */}
        <div className="group bg-[#131b2e] rounded-2xl border border-[#1F2E4D] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[145px]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-400 tracking-wider">
                Completed Today
              </span>
              <h3 className="text-3xl font-bold text-emerald-400 tracking-tight mt-3">
                {completedCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center mt-4 pt-3 border-t border-[#1F2E4D]/50">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
              +12% from avg
            </span>
          </div>
        </div>

        {/* Card 2: Avg. Prep Time */}
        <div className="group bg-[#131b2e] rounded-2xl border border-[#1F2E4D] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[145px]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-400 tracking-wider">
                Avg. Prep Time
              </span>
              <h3 className="text-3xl font-bold text-blue-400 tracking-tight mt-3">
                {avgPrepTime}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center mt-4 pt-3 border-t border-[#1F2E4D]/50">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
              Target: 15m (Optimal)
            </span>
          </div>
        </div>

        {/* Card 3: Station Alert Banner */}
        <div className="group bg-[#131b2e] rounded-2xl border border-[#1F2E4D] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[145px] relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Station Alert
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-2 leading-snug">
                {stationAlert.description}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1F2E4D]/50">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400">
              {stationAlert.capacity}% Capacity
            </span>

            <button
              type="button"
              onClick={() => setIsHeatmapOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-200 bg-[#1a243d] hover:bg-[#232f4c] hover:text-white rounded-lg border border-[#1F2E4D] transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>View Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Station Capacity Heatmap Dialog */}
      <Dialog open={isHeatmapOpen} onOpenChange={setIsHeatmapOpen}>
        <DialogContent className="max-w-2xl bg-[#131b2e] border border-[#1F2E4D] text-white p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2E4D]">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <DialogTitle className="text-lg font-bold text-white">
                  Kitchen Station Load & Heatmap
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-400">
              Real-time thermal load of kitchen line stations based on active tickets and queue volume.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {stationData.map((station) => (
                <div
                  key={station.name}
                  className="p-3.5 rounded-xl bg-[#1a243d] border border-[#1F2E4D] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {station.name}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        station.load >= 90
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : station.load >= 70
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {station.load}% Load
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#131b2e] h-2 rounded-full mt-2.5 overflow-hidden border border-[#1F2E4D]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${station.color}`}
                      style={{ width: `${station.load}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{station.chef}</span>
                    <span>{station.tickets} active items</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-red-200">Action Recommended:</strong> Rebalance cold side or assist Grill Line #1 to avoid ticket bottlenecks exceeding 15m.
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitchenCard;
