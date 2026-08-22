import React, { useState } from "react";
import {
  Printer,
  ArrowRight,
  Check,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string[];
}

export interface KitchenTicket {
  id: string;
  tableNumber: number | string;
  inTime: string;
  ticketId: string;
  status: "preparing" | "ready" | "completed";
  items: OrderItem[];
  station?: string;
}

const initialTickets: KitchenTicket[] = [
  {
    id: "ticket-1",
    tableNumber: 3,
    inTime: "13:41",
    ticketId: "941862f1",
    status: "preparing",
    station: "Grill",
    items: [
      {
        name: "PANEER TIKKA",
        quantity: 1,
        notes: ["Extra Spicy"],
      },
      {
        name: "GARLIC NAAN",
        quantity: 2,
        notes: ["Less Salt", "No Onion"],
      },
      {
        name: "MANGO LASSI",
        quantity: 3,
      },
    ],
  },
  {
    id: "ticket-2",
    tableNumber: 4,
    inTime: "13:41",
    ticketId: "941862f1",
    status: "preparing",
    station: "Tandoor",
    items: [
      {
        name: "PANEER TIKKA",
        quantity: 1,
      },
      {
        name: "GARLIC NAAN",
        quantity: 2,
      },
      {
        name: "MANGO LASSI",
        quantity: 3,
      },
    ],
  },
  {
    id: "ticket-3",
    tableNumber: 1,
    inTime: "13:41",
    ticketId: "941862f1",
    status: "ready",
    station: "Beverage",
    items: [
      {
        name: "PANEER TIKKA",
        quantity: 1,
      },
      {
        name: "MANGO LASSI",
        quantity: 2,
      },
    ],
  },
  {
    id: "ticket-4",
    tableNumber: 5,
    inTime: "13:41",
    ticketId: "941862f1",
    status: "ready",
    station: "Grill",
    items: [
      {
        name: "PANEER TIKKA",
        quantity: 1,
        notes: ["Extra Spicy"],
      },
      {
        name: "MANGO LASSI",
        quantity: 2,
      },
    ],
  },
  {
    id: "ticket-5",
    tableNumber: 5,
    inTime: "13:41",
    ticketId: "941862f1",
    status: "completed",
    station: "Grill",
    items: [
      {
        name: "PANEER TIKKA",
        quantity: 1,
        notes: ["Extra Spicy"],
      },
      {
        name: "GARLIC NAAN",
        quantity: 2,
        notes: ["Less Salt", "No Onion"],
      },
      {
        name: "MANGO LASSI",
        quantity: 3,
      },
    ],
  },
];

const KitchenProduction: React.FC = () => {
  const [tickets, setTickets] = useState<KitchenTicket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [printingTicket, setPrintingTicket] = useState<KitchenTicket | null>(null);

  // Bump status from preparing -> ready
  const handleBumpToReady = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "ready" } : t))
    );
    toast.success("Order bumped to Ready for Server Pickup!");
  };

  // Complete order
  const handleCompleteOrder = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
    toast.success("Ticket marked as Complete!");
  };

  // Print ticket modal handler
  const handlePrint = (ticket: KitchenTicket) => {
    setPrintingTicket(ticket);
  };

  // Confirm Print Action
  const executePrint = () => {
    toast.success(`Kitchen Ticket #${printingTicket?.ticketId} sent to KOT printer!`);
    setPrintingTicket(null);
  };

  // Add demo ticket
  const handleAddDemoTicket = () => {
    const newTableNum = Math.floor(Math.random() * 12) + 1;
    const randomHex = Math.random().toString(16).substring(2, 10);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newTicket: KitchenTicket = {
      id: `ticket-${Date.now()}`,
      tableNumber: newTableNum,
      inTime: timeStr,
      ticketId: randomHex,
      status: "preparing",
      station: "Grill",
      items: [
        {
          name: "BUTTER CHICKEN",
          quantity: 1,
          notes: ["Mild Spicy", "Extra Cream"],
        },
        {
          name: "TANDOORI ROTI",
          quantity: 3,
          notes: ["Butter Glazed"],
        },
        {
          name: "SWEET LASSI",
          quantity: 2,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    toast.success(`New Ticket for Table #${newTableNum} received!`);
  };

  // Reset to initial
  const handleResetTickets = () => {
    setTickets(initialTickets);
    toast.info("Tickets reset to default demo state");
  };

  // Filtered tickets based on active tab and search
  const filteredTickets = tickets.filter((ticket) => {
    const matchesTab =
      activeTab === "active"
        ? ticket.status === "preparing" || ticket.status === "ready"
        : ticket.status === "completed";

    const matchesSearch =
      searchQuery.trim() === "" ||
      ticket.tableNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Top Header Section with Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
            Kitchen Production
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Live Ticket Stream
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300 w-36 sm:w-44 text-slate-800 shadow-xs"
            />
          </div>

          {/* Quick Demo Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddDemoTicket}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition shadow-xs cursor-pointer"
              title="Simulate incoming order"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>

            <button
              type="button"
              onClick={handleResetTickets}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition shadow-xs cursor-pointer"
              title="Reset orders"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast(soundEnabled ? "Audio chimes muted" : "Audio chimes enabled");
              }}
              className={`p-1.5 rounded-full border transition shadow-xs cursor-pointer ${
                soundEnabled
                  ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
              title={soundEnabled ? "Mute chimes" : "Unmute chimes"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Active / Completed Tab Pills (Exact Match to Screenshot) */}
          <div className="bg-[#E5E9EE] p-1 rounded-full flex items-center gap-1 shadow-inner border border-slate-300/60">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#B9C5D1] text-[#1E293B] shadow-xs border border-[#94A3B8]"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "completed"
                  ? "bg-[#B9C5D1] text-[#1E293B] shadow-xs border border-[#94A3B8]"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Cards Stream Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No {activeTab} tickets right now</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {activeTab === "active"
              ? "All kitchen orders are prepared and cleared! Click 'New Ticket' to simulate fresh orders."
              : "No tickets have been completed yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {filteredTickets.map((ticket) => {
            const isPreparing = ticket.status === "preparing";
            const isReady = ticket.status === "ready";
            const isCompleted = ticket.status === "completed";

            return (
              <div
                key={ticket.id}
                className="bg-[#E9ECEF] rounded-[24px] p-5 shadow-xs border border-[#DCE1E7] flex flex-col justify-between min-h-[420px] transition-all duration-200 hover:shadow-md"
              >
                {/* Card Top Section */}
                <div>
                  {/* Table Number Circle & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs border border-slate-200">
                      {ticket.tableNumber}
                    </div>

                    {/* Status Badge */}
                    {isPreparing && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDF0E6] text-[#D97706] border border-[#FDE3C7]">
                        Preparing
                      </span>
                    )}

                    {isReady && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8F0] text-[#10B981] border border-[#D1F2DF]">
                        Ready
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8F0] text-[#10B981] border border-[#D1F2DF]">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Time & Ticket ID */}
                  <div className="text-xs text-slate-600 font-medium space-y-0.5">
                    <div>IN: {ticket.inTime}</div>
                    <div className="text-slate-500">Ticket ID: {ticket.ticketId}</div>
                  </div>

                  {/* Dotted separator line */}
                  <div className="border-b border-dashed border-slate-300 my-3.5" />

                  {/* Order Items List */}
                  <div className="space-y-3">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-tight flex items-start gap-1.5">
                          <span className="font-extrabold text-slate-900">{item.quantity}</span>
                          <span>{item.name}</span>
                        </div>

                        {/* Modifiers / Notes */}
                        {item.notes && item.notes.length > 0 && (
                          <div className="pl-4 space-y-0.5">
                            {item.notes.map((note, noteIdx) => (
                              <div
                                key={noteIdx}
                                className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5"
                              >
                                <span className="text-slate-400">•</span>
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="mt-4">
                  {/* Server Waiting Banner (for Ready state) */}
                  {isReady && (
                    <div className="text-center font-bold text-[#10B981] text-xs tracking-wider mb-2.5">
                      WAITING FOR SERVER...
                    </div>
                  )}

                  {/* Dotted separator line */}
                  <div className="border-b border-dashed border-slate-300 mb-3.5" />

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2.5">
                    {/* Print Button (Round tan bordered icon) */}
                    <button
                      type="button"
                      onClick={() => handlePrint(ticket)}
                      className="w-10 h-10 rounded-full border border-[#D4C3AB] bg-[#FDFBF7] text-[#8C6D42] flex items-center justify-center hover:bg-[#F5EEDB] transition-colors cursor-pointer shadow-xs shrink-0"
                      title="Print KOT Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Primary Button depending on status */}
                    {isPreparing && (
                      <button
                        type="button"
                        onClick={() => handleBumpToReady(ticket.id)}
                        className="bg-[#0B1E38] hover:bg-[#162E52] active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Bump To Ready</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isReady && (
                      <button
                        type="button"
                        onClick={() => handleCompleteOrder(ticket.id)}
                        className="bg-[#0B1E38] hover:bg-[#162E52] active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Complete</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="flex-1 flex items-center justify-center py-2 text-xs font-bold text-[#0B1E38]">
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Print Dialog / Modal */}
      <Dialog open={!!printingTicket} onOpenChange={(open) => !open && setPrintingTicket(null)}>
        <DialogContent className="max-w-sm bg-white text-slate-900 border border-slate-200 p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-base text-slate-800 border-b border-dashed pb-3">
              KITCHEN ORDER TICKET (KOT)
            </DialogTitle>
          </DialogHeader>

          {printingTicket && (
            <div className="text-xs font-mono space-y-3 py-2">
              <div className="flex justify-between text-slate-600">
                <span>Table: <strong>#{printingTicket.tableNumber}</strong></span>
                <span>Time: {printingTicket.inTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ticket: #{printingTicket.ticketId}</span>
                <span>Station: {printingTicket.station || "Main Line"}</span>
              </div>

              <div className="border-b border-dashed border-slate-300 my-2" />

              <div className="space-y-2">
                {printingTicket.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                    {item.notes?.map((n, ni) => (
                      <div key={ni} className="text-[11px] text-slate-500 pl-4">
                        * {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-slate-300 my-2" />

              <div className="text-[10px] text-center text-slate-400">
                Printed: {new Date().toLocaleTimeString()}
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setPrintingTicket(null)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executePrint}
                  className="flex-1 py-2 text-xs font-semibold bg-[#0B1E38] hover:bg-[#162E52] text-white rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitchenProduction;
