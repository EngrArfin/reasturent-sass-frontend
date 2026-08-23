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
    <div className="w-full text-white">
      {/* Top Header Section with Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Kitchen Production
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            Live Ticket Stream
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs font-medium bg-[#131b2e] border border-[#1F2E4D] rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-36 sm:w-48 text-white placeholder-slate-500 shadow-sm"
            />
          </div>

          {/* Quick Demo Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddDemoTicket}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-sm cursor-pointer active:scale-95"
              title="Simulate incoming order"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>

            <button
              type="button"
              onClick={handleResetTickets}
              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white bg-[#131b2e] hover:bg-[#1a243d] rounded-full border border-[#1F2E4D] transition-all shadow-sm cursor-pointer active:scale-95"
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
              className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all shadow-sm cursor-pointer active:scale-95 ${
                soundEnabled
                  ? "bg-[#131b2e] text-slate-300 hover:text-white border-[#1F2E4D] hover:bg-[#1a243d]"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
              title={soundEnabled ? "Mute chimes" : "Unmute chimes"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-slate-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-red-400" />
              )}
            </button>
          </div>

          {/* Active / Completed Tab Pills */}
          <div className="bg-[#131b2e] p-1 rounded-full flex items-center gap-1 border border-[#1F2E4D] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white font-medium"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white font-medium"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Cards Stream Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-[#131b2e] rounded-3xl p-12 text-center border border-[#1F2E4D] shadow-sm max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-[#1a243d] border border-[#1F2E4D] rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white">No {activeTab} tickets right now</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
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
                className="bg-[#131b2e] rounded-2xl p-5 shadow-sm border border-[#1F2E4D] hover:border-slate-600/60 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Card Top Section */}
                <div>
                  {/* Table Number Circle & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a243d] border border-[#1F2E4D] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                      {ticket.tableNumber}
                    </div>

                    {/* Status Badge */}
                    {isPreparing && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Preparing
                      </span>
                    )}

                    {isReady && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Ready
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Time & Ticket ID */}
                  <div className="text-xs text-slate-400 font-medium space-y-1">
                    <div>
                      IN: <span className="text-slate-200 font-semibold">{ticket.inTime}</span>
                    </div>
                    <div>
                      Ticket ID: <span className="text-slate-300 font-mono">#{ticket.ticketId}</span>
                    </div>
                    {ticket.station && (
                      <div className="text-[11px] text-orange-400 font-semibold">
                        Station: {ticket.station}
                      </div>
                    )}
                  </div>

                  {/* Dotted separator line */}
                  <div className="border-b border-[#1F2E4D] my-3.5" />

                  {/* Order Items List */}
                  <div className="space-y-3">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-bold text-slate-100 uppercase tracking-tight flex items-start gap-2">
                          <span className="w-5 h-5 rounded bg-[#1a243d] border border-[#1F2E4D] text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <span className="mt-0.5 leading-snug">{item.name}</span>
                        </div>

                        {/* Modifiers / Notes */}
                        {item.notes && item.notes.length > 0 && (
                          <div className="pl-7 space-y-1">
                            {item.notes.map((note, noteIdx) => (
                              <div
                                key={noteIdx}
                                className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                              >
                                <span>•</span>
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
                    <div className="text-center font-bold text-emerald-400 text-xs tracking-wider mb-2.5 animate-pulse">
                      WAITING FOR SERVER...
                    </div>
                  )}

                  {/* Dotted separator line */}
                  <div className="border-b border-[#1F2E4D] mb-3.5" />

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2.5">
                    {/* Print Button */}
                    <button
                      type="button"
                      onClick={() => handlePrint(ticket)}
                      className="w-10 h-10 rounded-full border border-[#1F2E4D] bg-[#1a243d] text-slate-300 hover:text-white hover:bg-[#232f4c] flex items-center justify-center transition-colors cursor-pointer shadow-sm shrink-0"
                      title="Print KOT Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Primary Button depending on status */}
                    {isPreparing && (
                      <button
                        type="button"
                        onClick={() => handleBumpToReady(ticket.id)}
                        className="bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-md shadow-orange-600/20"
                      >
                        <span>Bump To Ready</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isReady && (
                      <button
                        type="button"
                        onClick={() => handleCompleteOrder(ticket.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Complete</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="flex-1 flex items-center justify-center py-2 text-xs font-bold text-slate-400 bg-[#1a243d]/60 rounded-full border border-[#1F2E4D]">
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
        <DialogContent className="max-w-sm bg-[#131b2e] text-white border border-[#1F2E4D] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-base text-white border-b border-[#1F2E4D] pb-3">
              KITCHEN ORDER TICKET (KOT)
            </DialogTitle>
          </DialogHeader>

          {printingTicket && (
            <div className="space-y-4 py-2">
              <div className="bg-[#1a243d] border border-[#1F2E4D] rounded-xl p-4 text-xs font-mono space-y-2.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Table: <strong className="text-white">#{printingTicket.tableNumber}</strong></span>
                  <span>Time: <span className="text-white">{printingTicket.inTime}</span></span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket: <span className="text-white">#{printingTicket.ticketId}</span></span>
                  <span>Station: <span className="text-orange-400 font-semibold">{printingTicket.station || "Main Line"}</span></span>
                </div>

                <div className="border-b border-dashed border-[#1F2E4D] my-2" />

                <div className="space-y-2">
                  {printingTicket.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.quantity}x {item.name}</span>
                      </div>
                      {item.notes?.map((n, ni) => (
                        <div key={ni} className="text-[11px] text-amber-400 pl-4">
                          * {n}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-[#1F2E4D] my-2" />

                <div className="text-[10px] text-center text-slate-400">
                  Printed: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPrintingTicket(null)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-[#1a243d] hover:bg-[#232f4c] border border-[#1F2E4D] rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executePrint}
                  className="flex-1 py-2.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20"
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
