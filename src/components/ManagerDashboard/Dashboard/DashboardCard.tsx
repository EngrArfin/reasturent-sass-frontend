import React, { ReactNode } from "react";
import { TrendingUp, UserCheck, DollarSign, AlertTriangle } from "lucide-react";
import { useGetOrdersQuery, useGetTablesQuery } from "@/redux/features/manager/ManageFood/manageFoodApi";

export type CardColor = "green" | "blue" | "purple" | "red";

export interface CardData {
  title: string;
  value: string | number;
  subtext: string;
  icon: ReactNode;
  color: CardColor;
}

const colorStyles: Record<
  CardColor,
  { iconBg: string; icon: string; badgeBg: string; badgeText: string; valueColor: string }
> = {
  green: {
    iconBg: "bg-emerald-500/10 text-emerald-400",
    icon: "text-emerald-400 w-5 h-5",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-[#10B981]",
    valueColor: "text-emerald-400",
  },
  blue: {
    iconBg: "bg-blue-500/10 text-blue-400",
    icon: "text-blue-400 w-5 h-5",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    valueColor: "text-blue-400",
  },
  purple: {
    iconBg: "bg-purple-500/10 text-purple-400",
    icon: "text-purple-400 w-5 h-5",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    valueColor: "text-purple-400",
  },
  red: {
    iconBg: "bg-red-500/10 text-red-400",
    icon: "text-red-400 w-5 h-5",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-400",
    valueColor: "text-red-400",
  },
};

interface DashboardCardProps {
  cards?: CardData[];
}

const DashboardCard: React.FC<DashboardCardProps> = ({ cards }) => {
  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery();
  const { data: tablesData, isLoading: isLoadingTables } = useGetTablesQuery();

  const orders = ordersData?.data || [];
  const tables = tablesData?.data || [];

  // Calculate live dynamic metrics
  const totalSales = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (Number(o.totalBill) || 0), 0);

  const totalTransactions = orders.length;
  const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const dynamicCards: CardData[] = [
    {
      title: "Daily Sales",
      value: isLoadingOrders ? "..." : `$${totalSales.toFixed(2)}`,
      subtext: `${totalTransactions} orders`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "green",
    },
    {
      title: "Total Transactions",
      value: isLoadingOrders ? "..." : totalTransactions.toString(),
      subtext: `${orders.filter((o) => o.status === "COMPLETED").length} completed`,
      icon: <UserCheck className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Active Tables",
      value: isLoadingTables ? "..." : occupiedTables.toString(),
      subtext: `${tables.length} total tables`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "purple",
    },
    {
      title: "Pending Orders",
      value: isLoadingOrders ? "..." : pendingOrders.toString(),
      subtext: pendingOrders > 0 ? "Requires action" : "All caught up",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "red",
    },
  ];

  const displayCards = cards || dynamicCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {displayCards.map((card, index) => {
        const styles = colorStyles[card.color];

        return (
          <div
            key={index}
            className="group bg-[#131b2e] rounded-2xl border border-[#1F2E4D] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[145px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-400 tracking-wider">
                  {card.title}
                </span>
                <h3 className={`text-3xl font-bold ${styles.valueColor} tracking-tight mt-3`}>
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${styles.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-center mt-4 pt-3 border-t border-[#1F2E4D]/50">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${styles.badgeBg} ${styles.badgeText}`}>
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
