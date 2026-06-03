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

const colorStyles: Record<
  CardColor,
  { iconBg: string; icon: string; badgeBg: string; badgeText: string; borderLeft: string }
> = {
  green: {
    borderLeft: "border-l-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    icon: "text-emerald-600 w-5 h-5",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
  },
  blue: {
    borderLeft: "border-l-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
    icon: "text-blue-600 w-5 h-5",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
  },
  purple: {
    borderLeft: "border-l-purple-500",
    iconBg: "bg-purple-50 text-purple-600",
    icon: "text-purple-600 w-5 h-5",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
  },
  red: {
    borderLeft: "border-l-red-500",
    iconBg: "bg-red-50 text-red-600",
    icon: "text-red-600 w-5 h-5",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
  },
};

const cardData: CardData[] = [
  {
    title: "Total Tenants",
    value: "3",
    subtext: "100%",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "green",
  },
  {
    title: "Active Tickets",
    value: "1",
    subtext: "0 closed",
    icon: <UserCheck className="w-5 h-5" />,
    color: "blue",
  },
  {
    title: "Monthly Revenue",
    value: "$199.98",
    subtext: "100%",
    icon: <Eye className="w-5 h-5" />,
    color: "purple",
  },
  {
    title: "System Insight",
    value: "0",
    subtext: "0 prev",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "red",
  },
];

const AdminCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cardData.map((card, index) => {
        const styles = colorStyles[card.color];

        return (
          <div
            key={index}
            className={`group bg-white rounded-2xl border border-gray-200 border-l-4 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[145px] ${styles.borderLeft}`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-gray-600 tracking-wider uppercase">
                  {card.title}
                </span>
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight mt-3">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${styles.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-center mt-4 pt-3 border-t border-gray-50">
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

export default AdminCard;
