import React, { ReactNode } from "react";
import { TrendingUp, UserCheck, Eye, AlertTriangle } from "lucide-react";

export type CardColor = "green" | "blue" | "purple" | "red";

interface CardData {
  title: string;
  value: string | number;
  subtext: string;
  icon: ReactNode;
  color: CardColor;
}

const colorStyles: Record<CardColor, { wrapper: string; icon: string; subtext: string }> = {
  green: {
    wrapper: "bg-[#E6F8EA] border-[#C3E8D1] border-l-[#10B981]",
    icon: "text-[#10B981]",
    subtext: "text-[#10B981]",
  },
  blue: {
    wrapper: "bg-[#EBF4FE] border-[#BFDBFE] border-l-[#3B82F6]",
    icon: "text-[#3B82F6]",
    subtext: "text-[#3B82F6]",
  },
  purple: {
    wrapper: "bg-[#F3E8FF] border-[#E9D5FF] border-l-[#A855F7]",
    icon: "text-[#A855F7]",
    subtext: "text-[#A855F7]",
  },
  red: {
    wrapper: "bg-[#FEE2E2] border-[#FECACA] border-l-[#EF4444]",
    icon: "text-[#EF4444]",
    subtext: "text-[#EF4444]",
  },
};

const cardData: CardData[] = [
  {
    title: "Total Tenants",
    value: "3",
    subtext: "100%",
    icon: <TrendingUp />,
    color: "green",
  },
  {
    title: "Active Tickets",
    value: "1",
    subtext: "0 closed",
    icon: <UserCheck />,
    color: "blue",
  },
  {
    title: "Monthly Revenue",
    value: "$199.98",
    subtext: "100%",
    icon: <Eye />,
    color: "purple",
  },
  {
    title: "System Insight",
    value: "0",
    subtext: "0 prev",
    icon: <AlertTriangle />,
    color: "red",
  },
];

const AdminCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {cardData.map((card, index) => {
        const styles = colorStyles[card.color];

        return (
          <div
            key={index}
            className={`rounded-xl border border-l-4 p-5 flex flex-col justify-between shadow-sm min-h-[140px] ${styles.wrapper}`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-xl ${styles.icon}`}>{card.icon}</div>
              <span className="text-sm font-semibold text-gray-800">
                {card.title}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-black">{card.value}</h3>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-semibold ${styles.subtext}`}>
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminCard;
