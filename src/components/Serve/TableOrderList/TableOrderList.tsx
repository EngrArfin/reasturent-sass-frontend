import React, { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { toast } from "sonner";

export type OrderStatus =
  | "Confirmed"
  | "Cancelled"
  | "In Kitchen"
  | "Ready to Serve"
  | "Served";

export interface OrderItemDetail {
  quantity: number;
  name: string;
  notes?: string[];
}

export interface TableOrderTicket {
  id: string;
  ticketId: string;
  tableNumber: number;
  orderTime: string;
  status: OrderStatus;
  items: OrderItemDetail[];
  readyNotice?: boolean;
}

const initialOrders: TableOrderTicket[] = [
  {
    id: "ord-1",
    ticketId: "941862f1",
    tableNumber: 3,
    orderTime: "13:41",
    status: "Cancelled",
    readyNotice: false,
    items: [
      {
        quantity: 1,
        name: "PANEER TIKKA",
        notes: ["Extra Spicy"],
      },
      {
        quantity: 2,
        name: "GARLIC NAAN",
        notes: ["Less Salt", "No Onion"],
      },
      {
        quantity: 3,
        name: "MANGO LASSI",
      },
    ],
  },
  {
    id: "ord-2",
    ticketId: "941862f1",
    tableNumber: 4,
    orderTime: "13:41",
    status: "Confirmed",
    readyNotice: false,
    items: [
      {
        quantity: 1,
        name: "PANEER TIKKA",
      },
      {
        quantity: 2,
        name: "GARLIC NAAN",
      },
      {
        quantity: 3,
        name: "MANGO LASSI",
      },
    ],
  },
  {
    id: "ord-3",
    ticketId: "941862f1",
    tableNumber: 1,
    orderTime: "13:41",
    status: "Confirmed",
    readyNotice: true,
    items: [
      {
        quantity: 1,
        name: "PANEER TIKKA",
      },
      {
        quantity: 2,
        name: "MANGO LASSI",
      },
    ],
  },
  {
    id: "ord-4",
    ticketId: "941862f1",
    tableNumber: 5,
    orderTime: "13:41",
    status: "Confirmed",
    readyNotice: true,
    items: [
      {
        quantity: 1,
        name: "PANEER TIKKA",
        notes: ["Extra Spicy"],
      },
      {
        quantity: 2,
        name: "MANGO LASSI",
      },
    ],
  },
];

const TableOrderList: React.FC = () => {
  const [orders, setOrders] = useState<TableOrderTicket[]>(initialOrders);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "CANCELLED">("ALL");

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              readyNotice:
                newStatus === "Ready to Serve" ? true : ord.readyNotice,
            }
          : ord
      )
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleSendToKitchen = (order: TableOrderTicket) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === order.id
          ? { ...ord, status: "In Kitchen", readyNotice: false }
          : ord
      )
    );
    toast.success(`Ticket #${order.ticketId} for Table ${order.tableNumber} sent to Kitchen`);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "CONFIRMED") return order.status === "Confirmed";
    if (filter === "CANCELLED") return order.status === "Cancelled";
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Table Order Status
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            Order Status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex bg-[#131b2e] p-1 rounded-full text-xs font-semibold border border-[#1F2E4D] shadow-xs self-start md:self-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter("CONFIRMED")}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              filter === "CONFIRMED"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Confirmed ({orders.filter((o) => o.status === "Confirmed").length})
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              filter === "CANCELLED"
                ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cancelled ({orders.filter((o) => o.status === "Cancelled").length})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {filteredOrders.map((order) => {
          const isCancelled = order.status === "Cancelled";

          return (
            <div
              key={order.id}
              className="bg-[#131b2e] hover:bg-[#18233c] rounded-[28px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-[#1F2E4D] min-h-[460px]"
            >
              {/* Top Section */}
              <div>
                {/* Table circle & In Time & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1b253d] text-slate-200 font-bold text-xs flex items-center justify-center shadow-xs border border-[#26375c]">
                    {order.tableNumber}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      IN: {order.orderTime}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider capitalize border ${
                        isCancelled
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Ticket ID */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-400">
                    Ticket ID: <span className="font-mono text-slate-200">{order.ticketId}</span>
                  </p>
                </div>

                {/* Change Status Dropdown */}
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Change Status
                  </label>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="w-full appearance-none bg-[#101827] border border-[#1F2E4D] hover:border-slate-600 rounded-2xl py-2 px-3.5 pr-8 text-xs font-bold text-slate-200 tracking-wide shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Kitchen">In Kitchen</option>
                      <option value="Ready to Serve">Ready to Serve</option>
                      <option value="Served">Served</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Dotted Separator */}
                <div className="border-b border-dashed border-[#1F2E4D] my-4" />

                {/* Order Items List */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                        {item.quantity} {item.name}
                      </p>
                      {item.notes && item.notes.length > 0 && (
                        <div className="mt-1 space-y-0.5 pl-2">
                          {item.notes.map((note, nIdx) => (
                            <p
                              key={nIdx}
                              className="text-[11px] font-medium text-slate-400 flex items-center gap-1"
                            >
                              <span className="text-orange-400 font-bold">•</span>
                              <span>{note}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action / Status Section */}
              <div className="mt-6">
                {/* Dotted Separator */}
                <div className="border-b border-dashed border-[#1F2E4D] mb-4" />

                {isCancelled ? (
                  <div className="text-center py-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Cancelled
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {order.readyNotice && (
                      <div className="text-center">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
                          TAKE IT FROM KITCHEN...
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendToKitchen(order)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 transition-all active:scale-[0.99] cursor-pointer tracking-wide capitalize"
                    >
                      <span>Send to kitchen</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableOrderList;
