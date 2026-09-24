// src/components/Kitchen/KitchenDashboard/KitchenProduction.tsx
import React, { useState, useEffect, useRef } from "react";
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
  Filter,
  Utensils,
  Clock,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useGetKitchenTicketsQuery,
  useBumpKitchenTicketMutation,
  useCreateKitchenTicketMutation,
} from "@/redux/features/kitchen/kitchenProductionApi";
import {
  IKitchenTicket,
  ICreateKitchenTicketPayload,
} from "@/redux/features/kitchen/kitchenProductionType";

// Sound synthesizer using Web Audio API (cross-platform, zero asset dependency)
const playKitchenChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.5);
  } catch {
    // ignore audio block if user hasn't interacted
  }
};

const STATIONS = ["ALL", "Grill", "Tandoor", "Beverage", "Fryer", "Bakery", "Salad"];

const PRESET_DISHES = [
  { name: "PANEER TIKKA", defaultStation: "Grill", defaultModifiers: ["Extra Spicy"] },
  { name: "GRILLED SALMON STEAK", defaultStation: "Grill", defaultModifiers: ["No onions"] },
  { name: "GARLIC NAAN", defaultStation: "Tandoor", defaultModifiers: ["Butter Glazed"] },
  { name: "MANGO LASSI", defaultStation: "Beverage", defaultModifiers: ["Chilled"] },
  { name: "BUTTER CHICKEN", defaultStation: "Grill", defaultModifiers: ["Mild Spicy"] },
  { name: "CRISPY FRENCH FRIES", defaultStation: "Fryer", defaultModifiers: ["Extra Crispy"] },
];

const KitchenProduction: React.FC = () => {
  // View states
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const [selectedStation, setSelectedStation] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dialog states
  const [printingTicket, setPrintingTicket] = useState<IKitchenTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // New ticket form state
  const [newTableNumber, setNewTableNumber] = useState("3");
  const [newTicketStation, setNewTicketStation] = useState("Grill");
  const [newItems, setNewItems] = useState<
    Array<{ name: string; quantity: number; modifiers: string[]; station: string }>
  >([
    { name: "PANEER TIKKA", quantity: 1, modifiers: ["Extra Spicy"], station: "Grill" },
  ]);
  const [customDishName, setCustomDishName] = useState("");
  const [customModifier, setCustomModifier] = useState("");

  // RTK Query hooks
  const {
    data: ticketsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetKitchenTicketsQuery(
    {
      tab: activeTab,
      search: searchQuery.trim() || undefined,
      station: selectedStation !== "ALL" ? selectedStation : undefined,
    },
    {
      pollingInterval: 3000, // Live auto-sync every 3s
    }
  );

  const [bumpTicket, { isLoading: isBumping }] = useBumpKitchenTicketMutation();
  const [createTicket, { isLoading: isCreating }] = useCreateKitchenTicketMutation();

  const tickets = ticketsResponse?.data || [];
  const previousTicketsCount = useRef<number>(0);

  // Chime when new tickets arrive
  useEffect(() => {
    if (
      tickets.length > previousTicketsCount.current &&
      previousTicketsCount.current > 0 &&
      soundEnabled
    ) {
      playKitchenChime();
    }
    previousTicketsCount.current = tickets.length;
  }, [tickets.length, soundEnabled]);

  // Handle Bump Status
  const handleBumpStatus = async (ticket: IKitchenTicket) => {
    const nextStatus = ticket.nextStatus || (ticket.rawStatus === "PENDING" || ticket.rawStatus === "PREPARING" ? "READY" : "COMPLETED");
    try {
      const res = await bumpTicket({
        id: ticket.id,
        targetStatus: nextStatus,
        station: ticket.station,
      }).unwrap();

      if (soundEnabled) {
        playKitchenChime();
      }

      toast.success(res.message || `Ticket #${ticket.ticketId} updated to ${nextStatus}!`);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to update ticket status");
    }
  };

  // Handle Manual Ticket Creation
  const handleCreateTicketSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newTableNumber.trim()) {
      toast.error("Please enter a table number");
      return;
    }

    if (newItems.length === 0) {
      toast.error("Please add at least one dish item");
      return;
    }

    const payload: ICreateKitchenTicketPayload = {
      tableNumber: newTableNumber.trim(),
      station: newTicketStation,
      items: newItems.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        modifiers: item.modifiers.filter(Boolean),
        station: item.station || newTicketStation,
      })),
    };

    try {
      const res = await createTicket(payload).unwrap();
      if (soundEnabled) {
        playKitchenChime();
      }
      toast.success(res.message || `Kitchen ticket for Table ${newTableNumber} dispatched!`);
      setIsNewTicketOpen(false);
      // Reset form
      setNewTableNumber(String(Math.floor(Math.random() * 12) + 1));
      setNewItems([{ name: "GRILLED SALMON STEAK", quantity: 1, modifiers: ["No onions"], station: "Grill" }]);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to create kitchen ticket");
    }
  };

  // Quick Preset Add
  const handleAddPreset = (preset: typeof PRESET_DISHES[0]) => {
    setNewItems((prev) => [
      ...prev,
      {
        name: preset.name,
        quantity: 1,
        modifiers: [...preset.defaultModifiers],
        station: preset.defaultStation,
      },
    ]);
  };

  // Add Custom Dish Item to Form
  const handleAddCustomDish = () => {
    if (!customDishName.trim()) return;
    setNewItems((prev) => [
      ...prev,
      {
        name: customDishName.trim().toUpperCase(),
        quantity: 1,
        modifiers: customModifier.trim() ? [customModifier.trim()] : [],
        station: newTicketStation,
      },
    ]);
    setCustomDishName("");
    setCustomModifier("");
  };

  // Remove Item from Creation List
  const handleRemoveItem = (index: number) => {
    setNewItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Execute Print Slip
  const executePrint = () => {
    toast.success(`Ticket #${printingTicket?.ticketId} sent to KOT printer!`);
    setPrintingTicket(null);
  };

  return (
    <div className="w-full text-white">
      {/* Top Header Section with Title, Filters & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Kitchen Production
            </h1>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                Live Syncing
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            Kitchen Display System (KDS) & Ticket Stream
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Station Filter Dropdown */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <select
              aria-label="Filter tickets by kitchen prep station"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="pl-8 pr-7 py-2 text-xs font-semibold bg-[#131b2e] border border-[#1F2E4D] rounded-full text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer shadow-sm appearance-none"
            >
              {STATIONS.map((station) => (
                <option key={station} value={station} className="bg-[#131b2e] text-white">
                  {station === "ALL" ? "All Stations" : `${station} Line`}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table, ID, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs font-medium bg-[#131b2e] border border-[#1F2E4D] rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-36 sm:w-48 text-white placeholder-slate-500 shadow-sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewTicketOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-sm cursor-pointer active:scale-95 shadow-emerald-600/20"
              title="Create new kitchen ticket"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ New Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => {
                refetch();
                toast.info("Refreshed kitchen tickets stream");
              }}
              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white bg-[#131b2e] hover:bg-[#1a243d] rounded-full border border-[#1F2E4D] transition-all shadow-sm cursor-pointer active:scale-95"
              title="Refresh tickets"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-orange-400" : ""}`} />
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
              onClick={() => setActiveTab("ACTIVE")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "ACTIVE"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white font-medium"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("COMPLETED")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "COMPLETED"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white font-medium"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-[#131b2e] rounded-2xl p-5 border border-[#1F2E4D] min-h-[400px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800" />
                  <div className="w-20 h-5 rounded-full bg-slate-800" />
                </div>
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="border-b border-[#1F2E4D] my-4" />
                <div className="space-y-2">
                  <div className="h-5 w-full bg-slate-800 rounded" />
                  <div className="h-5 w-3/4 bg-slate-800 rounded" />
                </div>
              </div>
              <div className="h-10 w-full bg-slate-800 rounded-full mt-4" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        /* Empty State */
        <div className="bg-[#131b2e] rounded-3xl p-12 text-center border border-[#1F2E4D] shadow-sm max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-[#1a243d] border border-[#1F2E4D] rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white">No {activeTab.toLowerCase()} tickets</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {activeTab === "ACTIVE"
              ? "All kitchen orders are cleared and ready! Click '+ New Ticket' to dispatch fresh orders."
              : "No completed tickets in this view."}
          </p>
          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-semibold shadow-md shadow-orange-600/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Test Ticket</span>
          </button>
        </div>
      ) : (
        /* Ticket Cards Stream Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {tickets.map((ticket) => {
            const raw = (ticket.rawStatus || "").toUpperCase();
            const isReady = raw === "READY" || ticket.status?.toLowerCase() === "ready";
            const isCompleted = raw === "COMPLETED" || ticket.status?.toLowerCase() === "completed";
            const isPreparing = !isReady && !isCompleted;

            return (
              <div
                key={ticket.id}
                className="bg-[#131b2e] rounded-2xl p-5 shadow-sm border border-[#1F2E4D] hover:border-slate-600/60 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Card Top Section */}
                <div>
                  {/* Table Number Circle & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a243d] border border-[#1F2E4D] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                        {ticket.tableNumber?.toString().replace(/[^0-9]/g, "") || ticket.tableNumber || "1"}
                      </div>
                      <span className="text-xs font-semibold text-slate-300">
                        {ticket.tableNumber?.toString().includes("Table") ? ticket.tableNumber : `Table #${ticket.tableNumber}`}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isPreparing && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Preparing
                      </span>
                    )}

                    {isReady && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                        Ready
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Time & Ticket ID & Station */}
                  <div className="text-xs text-slate-400 font-medium space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>IN: <strong className="text-slate-200">{ticket.inTime}</strong></span>
                      </div>
                      {ticket.orderNumber && (
                        <span className="text-[10px] text-slate-500 uppercase">
                          {ticket.orderNumber}
                        </span>
                      )}
                    </div>
                    <div>
                      Ticket ID: <span className="text-slate-300 font-mono font-semibold">{ticket.ticketId}</span>
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
                    {ticket.items && ticket.items.map((item, idx) => (
                      <div key={item.id || idx} className="space-y-1">
                        <div className="text-xs font-bold text-slate-100 uppercase tracking-tight flex items-start gap-2">
                          <span className="w-5 h-5 rounded bg-[#1a243d] border border-[#1F2E4D] text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <span className="mt-0.5 leading-snug">{item.name}</span>
                        </div>

                        {/* Modifiers / Notes */}
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="pl-7 flex flex-wrap gap-1">
                            {item.modifiers.map((mod, modIdx) => (
                              <span
                                key={modIdx}
                                className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                              >
                                <span>•</span>
                                <span>{mod}</span>
                              </span>
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
                    <div className="text-center font-bold text-emerald-400 text-[11px] tracking-wider mb-2.5 animate-pulse">
                      {ticket.subStatusLabel || "WAITING FOR SERVER PICKUP..."}
                    </div>
                  )}

                  {/* Dotted separator line */}
                  <div className="border-b border-[#1F2E4D] mb-3.5" />

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2.5">
                    {/* Print Button */}
                    <button
                      type="button"
                      onClick={() => setPrintingTicket(ticket)}
                      className="w-10 h-10 rounded-full border border-[#1F2E4D] bg-[#1a243d] text-slate-300 hover:text-white hover:bg-[#232f4c] flex items-center justify-center transition-colors cursor-pointer shadow-sm shrink-0"
                      title="Print KOT Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Primary Button depending on status */}
                    {isPreparing && (
                      <button
                        type="button"
                        disabled={ticket.isActionDisabled || isBumping}
                        onClick={() => handleBumpStatus(ticket)}
                        className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-md shadow-orange-600/20"
                      >
                        {isBumping ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span>{ticket.actionLabel || "Bump To Ready ➔"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}

                    {isReady && (
                      <button
                        type="button"
                        disabled={ticket.isActionDisabled || isBumping}
                        onClick={() => handleBumpStatus(ticket)}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 flex-1 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        {isBumping ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{ticket.actionLabel || "✓ Complete"}</span>
                          </>
                        )}
                      </button>
                    )}

                    {isCompleted && (
                      <div className="flex-1 flex items-center justify-center py-2 text-xs font-bold text-slate-400 bg-[#1a243d]/60 rounded-full border border-[#1F2E4D]">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual New Ticket Modal */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="max-w-xl bg-[#131b2e] text-white border border-[#1F2E4D] p-6 rounded-2xl shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F2E4D]">
              <Utensils className="w-5 h-5 text-orange-400" />
              <DialogTitle className="text-lg font-bold text-white">
                Dispatch New Kitchen Ticket
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 mt-2">
            {/* Table Number and Station */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Table Number / ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3, Table 4, Patio 2"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kitchen Prep Station
                </label>
                <select
                  value={newTicketStation}
                  onChange={(e) => setNewTicketStation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
                >
                  <option value="Grill">Grill Station</option>
                  <option value="Tandoor">Tandoor & Bakery</option>
                  <option value="Beverage">Beverage Bar</option>
                  <option value="Fryer">Fryer Station</option>
                  <option value="Salad">Salad & Cold Bar</option>
                </select>
              </div>
            </div>

            {/* Quick Add Preset Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Quick Add Popular Dishes:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_DISHES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#1a243d] hover:bg-[#232f4c] text-slate-200 hover:text-white rounded-lg border border-[#1F2E4D] transition cursor-pointer"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Item Adder */}
            <div className="p-3 bg-[#1a243d] rounded-xl border border-[#1F2E4D] space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Add Custom Dish / Modifiers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Dish name (e.g. PIZZA)"
                  value={customDishName}
                  onChange={(e) => setCustomDishName(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#131b2e] border border-[#1F2E4D] rounded-lg text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Modifiers (e.g. Extra Cheese)"
                  value={customModifier}
                  onChange={(e) => setCustomModifier(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#131b2e] border border-[#1F2E4D] rounded-lg text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDish}
                  className="px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition cursor-pointer"
                >
                  Add Dish
                </button>
              </div>
            </div>

            {/* Selected Items List */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Ticket Items Queue ({newItems.length})
              </span>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {newItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#1a243d] border border-[#1F2E4D] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          setNewItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, quantity: val } : it))
                          );
                        }}
                        className="w-10 text-center py-1 bg-[#131b2e] border border-[#1F2E4D] rounded font-bold text-emerald-400"
                      />
                      <div>
                        <strong className="text-white">{item.name}</strong>
                        {item.modifiers.length > 0 && (
                          <div className="text-[10px] text-amber-300">
                            {item.modifiers.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#1F2E4D]">
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-[#1a243d] hover:bg-[#232f4c] border border-[#1F2E4D] rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Dispatch Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket Print Dialog / Modal */}
      <Dialog open={!!printingTicket} onOpenChange={(open) => !open && setPrintingTicket(null)}>
        <DialogContent className="max-w-sm bg-[#131b2e] text-white border border-[#1F2E4D] p-6 rounded-2xl shadow-2xl">
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
                  <span>Ticket: <span className="text-white">{printingTicket.ticketId}</span></span>
                  <span>Station: <span className="text-orange-400 font-semibold">{printingTicket.station || "Main Line"}</span></span>
                </div>

                <div className="border-b border-dashed border-[#1F2E4D] my-2" />

                <div className="space-y-2">
                  {printingTicket.items?.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.quantity}x {item.name}</span>
                      </div>
                      {item.modifiers?.map((n, ni) => (
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
