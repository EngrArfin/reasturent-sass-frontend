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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Completed Today */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-700">Completed Today</span>
            <div className="p-1 rounded-md text-emerald-600 bg-emerald-50">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {completedCount}
            </div>
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              +12% from avg
            </p>
          </div>
        </div>

        {/* Card 2: Avg. Prep Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-900 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-700">Avg. Prep Time</span>
            <div className="p-1 rounded-md text-slate-900">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {avgPrepTime}
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              Target: 15m
            </p>
          </div>
        </div>

        {/* Card 3: Station Alert Banner */}
        <div className="bg-gradient-to-br from-[#0F1E36] via-[#0D182B] to-[#080E1A] rounded-2xl p-6 text-white shadow-md border border-[#1E2E4A] flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                STATION ALERT
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-2 leading-snug">
              {stationAlert.description}
            </h3>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsHeatmapOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 bg-[#243348] hover:bg-[#324560] hover:text-white rounded-lg border border-slate-600/40 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>View Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Station Capacity Heatmap Dialog */}
      <Dialog open={isHeatmapOpen} onOpenChange={setIsHeatmapOpen}>
        <DialogContent className="max-w-2xl bg-[#0F172A] border border-slate-700 text-white p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
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
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
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
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
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
                <strong>Action Recommended:</strong> Rebalance cold side or assist Grill Line #1 to avoid ticket bottlenecks exceeding 15m.
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitchenCard;
