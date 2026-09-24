import React, { useState } from "react";
import { ChevronDown, Send, Filter, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import {
  useGetServeOrdersQuery,
  useUpdateServeOrderStatusMutation,
} from "@/redux/features/server/serverTableAndStatusApi";
import {
  IServeOrderTicket,
  TicketStatus,
} from "@/redux/features/server/serverTableAndStatusType";

const fallbackOrders: IServeOrderTicket[] = [
  {
    id: "ord-1",
    ticketId: "13691b6b",
    tableNumber: "2",
    time: "06:21",
    status: "Confirmed",
    rawStatus: "PENDING",
    totalBill: 19.98,
    items: [
      {
        quantity: 2,
        name: "Paneer Tikka",
        unitPrice: 9.99,
        tags: ["Extra Spicy", "No Onion"],
      },
      {
        quantity: 2,
        name: "Garlic Naan",
        unitPrice: 3.5,
        tags: ["Less Salt"],
      },
    ],
  },
  {
    id: "ord-2",
    ticketId: "ORD-4321",
    tableNumber: "Table #Table-23",
    time: "06:14",
    status: "In Kitchen",
    rawStatus: "PREPARING",
    totalBill: 42.0,
    items: [
      {
        quantity: 1,
        name: "Grilled Salmon Steak",
        unitPrice: 24.5,
        tags: ["Extra Lemon"],
      },
      {
        quantity: 2,
        name: "Mango Lassi",
        unitPrice: 4.5,
      },
    ],
  },
  {
    id: "ord-3",
    ticketId: "ORD-1213",
    tableNumber: "Table #1",
    time: "05:47",
    status: "Ready to Serve",
    rawStatus: "READY",
    readyNotice: true,
    totalBill: 49.0,
    items: [
      {
        quantity: 2,
        name: "Grilled Salmon Steak",
        unitPrice: 24.5,
        tags: ["No onions"],
      },
    ],
  },
  {
    id: "ord-4",
    ticketId: "ORD-9025",
    tableNumber: "Table #4",
    time: "05:30",
    status: "Served",
    rawStatus: "SERVED",
    totalBill: 35.0,
    items: [
      {
        quantity: 1,
        name: "Margherita Pizza",
        unitPrice: 19.0,
      },
      {
        quantity: 2,
        name: "Craft Soda",
        unitPrice: 8.0,
      },
    ],
  },
];

const TableOrderList: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");

  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = useGetServeOrdersQuery(
    filter !== "ALL" ? { status: filter } : undefined,
    {
      pollingInterval: 3000,
    }
  );

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateServeOrderStatusMutation();

  const apiOrders = ordersData?.data;
  const orders: IServeOrderTicket[] =
    apiOrders && apiOrders.length > 0 ? apiOrders : fallbackOrders;

  const handleStatusChange = async (orderId: string, newStatus: TicketStatus | string) => {
    try {
      const res = await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(res.message || `Order ticket status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order status");
    }
  };

  const handleSendToKitchen = async (order: IServeOrderTicket) => {
    try {
      const res = await updateOrderStatus({ id: order.id, status: "In Kitchen" }).unwrap();
      toast.success(
        res.message || `Ticket #${order.ticketId} for ${order.tableNumber} sent to Kitchen`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update ticket status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    const filterUpper = filter.toUpperCase();
    const statusUpper = order.status.toUpperCase();
    const rawStatusUpper = order.rawStatus?.toUpperCase() || "";
    return statusUpper.includes(filterUpper) || rawStatusUpper === filterUpper;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Table Order Status
            </h1>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            Live waiter & kitchen service tickets
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex items-center bg-[#131b2e] hover:bg-[#18233c] border border-[#1F2E4D] hover:border-orange-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group self-start md:self-auto">
          <div className="flex items-center gap-2 pointer-events-none">
            <Filter className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            <span className="text-xs font-bold text-white capitalize">
              {filter === "ALL"
                ? `All Orders (${orders.length})`
                : `${filter} (${filteredOrders.length})`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-[#131b2e] text-white">
              All Orders ({orders.length})
            </option>
            <option value="PENDING" className="bg-[#131b2e] text-white">
              Pending / Confirmed
            </option>
            <option value="PREPARING" className="bg-[#131b2e] text-white">
              In Kitchen / Preparing
            </option>
            <option value="READY" className="bg-[#131b2e] text-white">
              Ready to Serve
            </option>
            <option value="SERVED" className="bg-[#131b2e] text-white">
              Served
            </option>
            <option value="CANCELLED" className="bg-[#131b2e] text-white">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading && !ordersData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-[#131b2e] rounded-[28px] p-6 border border-[#1F2E4D] min-h-[460px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-9 h-9 rounded-full bg-slate-800" />
                  <div className="w-20 h-5 rounded-full bg-slate-800" />
                </div>
                <div className="h-4 w-28 bg-slate-800 rounded" />
                <div className="h-5 w-20 bg-slate-800 rounded" />
                <div className="h-9 w-full bg-slate-800 rounded-xl" />
                <div className="border-b border-[#1F2E4D] my-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-800 rounded" />
                  <div className="h-4 w-3/4 bg-slate-800 rounded" />
                </div>
              </div>
              <div className="h-10 w-full bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredOrders.map((order) => {
            const isCancelled =
              order.status === "Cancelled" || order.rawStatus === "CANCELLED";
            const isReady =
              order.status === "Ready to Serve" ||
              order.rawStatus === "READY" ||
              order.readyNotice;
            const isServed =
              order.status === "Served" || order.rawStatus === "SERVED";
            const isKitchen =
              order.status === "In Kitchen" || order.rawStatus === "PREPARING";

            const displayTime =
              order.time ||
              (order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "Just now");

            return (
              <div
                key={order.id}
                className="bg-[#131b2e] hover:bg-[#18233c] rounded-[28px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-[#1F2E4D] min-h-[460px]"
              >
                {/* Top Section */}
                <div>
                  {/* Table circle & In Time & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#1b253d] text-slate-200 font-bold text-xs flex items-center justify-center shadow-xs border border-[#26375c]">
                      {order.tableNumber.replace("Table #", "")}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        IN: {displayTime}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider capitalize border ${isCancelled
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : isReady
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : isServed
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : isKitchen
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Ticket ID & Table Header */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-400">
                      Ticket ID:{" "}
                      <span className="font-mono text-slate-200 font-bold">
                        {order.ticketId || order.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {order.tableNumber.startsWith("Table")
                        ? order.tableNumber
                        : `Table #${order.tableNumber}`}
                    </p>
                  </div>

                  {/* Change Status Dropdown */}
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Update Ticket Status
                    </label>
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isUpdatingStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="w-full appearance-none bg-[#101827] border border-[#1F2E4D] hover:border-slate-600 rounded-2xl py-2 px-3.5 pr-8 text-xs font-bold text-slate-200 tracking-wide shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer disabled:opacity-50"
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
                    {order.items?.map((item, idx) => {
                      const notesList = item.tags || (item.notes ? [item.notes] : []);
                      return (
                        <div key={idx} className="text-left">
                          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            {item.unitPrice && (
                              <span className="font-mono text-slate-400 text-xs">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {notesList && notesList.length > 0 && (
                            <div className="mt-1 space-y-0.5 pl-2">
                              {notesList.map((note, nIdx) => (
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
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action / Status Section */}
                <div className="mt-6">
                  {/* Total Bill Info */}
                  <div className="flex items-center justify-between text-xs pb-3">
                    <span className="text-slate-400 font-medium">Ticket Total:</span>
                    <span className="text-sm font-bold text-orange-400 font-mono">
                      ${Number(order.totalBill || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Dotted Separator */}
                  <div className="border-b border-dashed border-[#1F2E4D] mb-4" />

                  {isCancelled ? (
                    <div className="text-center py-2">
                      <span className="text-xs font-semibold text-slate-400">
                        Order Cancelled
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {isReady && (
                        <div className="text-center">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
                            READY FOR PICKUP IN KITCHEN...
                          </span>
                        </div>
                      )}

                      {!isKitchen && !isServed && (
                        <button
                          type="button"
                          onClick={() => handleSendToKitchen(order)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 transition-all active:scale-[0.99] cursor-pointer tracking-wide capitalize"
                        >
                          <span>Send to kitchen</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isKitchen && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "Ready to Serve")}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-all active:scale-[0.99] cursor-pointer tracking-wide capitalize"
                        >
                          <span>Mark Ready</span>
                        </button>
                      )}

                      {isReady && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "Served")}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all active:scale-[0.99] cursor-pointer tracking-wide capitalize"
                        >
                          <span>Mark Served</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center text-slate-400 bg-[#131b2e] rounded-3xl border border-[#1F2E4D]">
          <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-semibold text-slate-300">No active order tickets</p>
          <p className="text-xs text-slate-500 mt-1">
            Orders placed from the Floor Table Map will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default TableOrderList;
