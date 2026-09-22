import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Send,
  SendHorizontal,
  Server,
  Cpu,
  HardDrive,
  MessageSquare,
  RefreshCw,
  Search,
  Clock,
  Loader2,
  Inbox,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useCreateSupportTicketMutation,
  useAddTicketMessageMutation,
} from "@/redux/features/admin/ticket/ticketApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { TicketPriority } from "@/redux/features/admin/ticket/ticketType";

const issueCategories = [
  "Sync Issue",
  "Hardware/Printer Error",
  "Inventory/Barcode Error",
  "Payment Failure",
  "Network/POS Error",
  "Order Processing",
];

const ManagerTicket: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>("Sync Issue");
  const [priority, setPriority] = useState<TicketPriority>("HIGH");
  const [description, setDescription] = useState<string>("");

  // History & Filter State
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Chat Input State
  const [chatMessage, setChatMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-captured Diagnostics data
  const [systemDiagnostics] = useState(() => {
    const businessSuffix = user?.businessId
      ? user.businessId.slice(-4).toUpperCase()
      : "8821";
    return {
      deviceId: `RENE-POS-${businessSuffix}`,
      softwareVersion: "v2.4.1-stable",
      lastSync: new Date().toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  });

  // RTK Query: Tickets List
  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
    refetch,
  } = useGetSupportTicketsQuery(
    {
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: searchQuery.trim() || undefined,
    },
    {
      pollingInterval: 15000,
    }
  );

  // RTK Query: Selected Ticket Details & Messages
  const {
    data: selectedTicket,
    isLoading: isTicketDetailsLoading,
  } = useGetSupportTicketByIdQuery(selectedTicketId || "", {
    skip: !selectedTicketId,
    pollingInterval: selectedTicketId ? 8000 : 0,
  });

  // RTK Query Mutations
  const [createTicket, { isLoading: isCreating }] = useCreateSupportTicketMutation();
  const [addTicketMessage, { isLoading: isSendingMessage }] = useAddTicketMessageMutation();

  // Auto-select first ticket if none selected or if selection no longer exists
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  // Scroll to bottom of chat on new messages or ticket switch
  useEffect(() => {
    if (selectedTicket?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages?.length, selectedTicketId]);

  // Filtered tickets based on search query in client as well
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const query = searchQuery.toLowerCase();
    return tickets.filter(
      (t) =>
        t.category?.toLowerCase().includes(query) ||
        t.title?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.id?.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  // Submit New Support Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please explain what happened before submitting.");
      return;
    }

    try {
      const result = await createTicket({
        category: selectedCategory,
        title: `${selectedCategory} - POS Terminal`,
        description: description.trim(),
        priority: priority,
        deviceId: systemDiagnostics.deviceId,
        softwareVersion: systemDiagnostics.softwareVersion,
        lastSync: systemDiagnostics.lastSync,
        businessId: user?.businessId || undefined,
      }).unwrap();

      toast.success("Support ticket submitted to Global Dashboard!");
      setDescription("");
      if (result?.id) {
        setSelectedTicketId(result.id);
      }
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || "Failed to submit support ticket."
      );
    }
  };

  // Send Message in Ticket Thread
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTicketId) return;

    const messageText = chatMessage.trim();
    setChatMessage("");

    try {
      await addTicketMessage({
        id: selectedTicketId,
        message: messageText,
      }).unwrap();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || "Failed to send message."
      );
      setChatMessage(messageText);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= TOP SECTION: TICKET CREATION & DIAGNOSTICS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Issue Category & Description */}
        <div className="lg:col-span-8 bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm flex flex-col justify-between">
          <form onSubmit={handleCreateTicket} className="space-y-6">
            {/* Category Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Issue Category
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Priority:</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="bg-[#0b1220] border border-[#1F2E4D] text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="w-full h-px bg-[#1F2E4D] mb-5" />

              {/* Category Pill Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {issueCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer text-center border truncate ${
                        isSelected
                          ? "bg-[#052350] text-white border-blue-500/80 shadow-md ring-1 ring-blue-500/30"
                          : "bg-[#0b1220] hover:bg-[#0e172a] text-slate-300 border-[#1F2E4D]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300 flex items-center justify-between">
                <span>Description</span>
                <span className="text-[11px] text-slate-500">
                  Provide detailed info for faster triage
                </span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please explain what happened, terminal behavior, error code..."
                className="w-full bg-[#0b1220] border border-[#1F2E4D] rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Ticket to Global Dashboard</span>
                    <SendHorizontal className="w-4 h-4 text-blue-400" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Auto-Captured Diagnostics Data */}
        <div className="lg:col-span-4 bg-[#0b1220] rounded-3xl p-6 sm:p-7 border border-[#1F2E4D] shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AUTO-CAPTURED DATA
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Attached to ticket automatically
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live POS
              </span>
            </div>

            <div className="w-full h-px bg-[#1F2E4D]" />

            {/* Device ID */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                DEVICE ID
              </span>
              <p className="text-sm font-bold text-white tracking-wide font-mono">
                {systemDiagnostics.deviceId}
              </p>
            </div>

            {/* Software Version */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                SOFTWARE VERSION
              </span>
              <p className="text-sm font-bold text-white tracking-wide font-mono">
                {systemDiagnostics.softwareVersion}
              </p>
            </div>

            {/* Last Sync */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                LAST SYNC
              </span>
              <p className="text-sm font-bold text-white tracking-wide">
                {systemDiagnostics.lastSync}
              </p>
            </div>
          </div>

          {/* Diagnostic Note Box */}
          <div className="mt-6 bg-[#131b2e] rounded-2xl p-4 border border-[#1F2E4D]/80">
            <p className="text-xs text-slate-400 leading-relaxed">
              This diagnostic snapshot helps our central engineers rapidly diagnose
              printer latency, inventory synchronization, and network connectivity.
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION: SUPPORT HISTORY & COMMUNICATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Support History List (Left 4 columns) */}
        <div className="lg:col-span-4 bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-[#1F2E4D] shadow-sm flex flex-col max-h-[640px]">
          {/* Header & Controls */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Support History
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#052350] text-blue-300 border border-blue-500/30">
                  {filteredTickets.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0b1220] transition cursor-pointer"
                title="Refresh Tickets"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isTicketsFetching ? "animate-spin text-blue-400" : ""}`}
                />
              </button>
            </div>

            {/* Filter Tabs: ALL, OPEN, CLOSED */}
            <div className="grid grid-cols-3 p-1 bg-[#0b1220] rounded-xl border border-[#1F2E4D]">
              {(["ALL", "OPEN", "CLOSED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                    statusFilter === tab
                      ? "bg-[#052350] text-white border border-[#1F2E4D]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1220] border border-[#1F2E4D] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="w-full h-px bg-[#1F2E4D]" />
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {isTicketsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-xs">Loading support history...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-center px-4 gap-2">
                <Inbox className="w-8 h-8 stroke-[1.5] text-slate-600" />
                <p className="text-xs font-medium text-slate-400">
                  No tickets found
                </p>
                <p className="text-[11px] text-slate-600">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Submit your first ticket using the form above."}
                </p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicketId === t.id;
                const isOpen = t.status === "OPEN";

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-[#052350] text-white border-blue-500/70 shadow-md ring-1 ring-blue-500/30"
                        : "bg-[#0b1220] hover:bg-[#0e172a] text-slate-300 border-[#1F2E4D]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-xs font-bold truncate text-white">
                        {t.category || t.title}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          isOpen
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#1F2E4D]/40 mt-0.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        <span>{t.messagesCount || (t.messages ? t.messages.length : 1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {t.time ||
                            (t.createdAt
                              ? new Date(t.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Communication Chat Area (Right 8 columns) */}
        <div className="lg:col-span-8 bg-[#131b2e] rounded-3xl p-5 sm:p-7 border border-[#1F2E4D] shadow-sm flex flex-col justify-between min-h-[520px] max-h-[640px]">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
                      COMMUNICATION THREAD
                    </h3>
                    <h4 className="text-base font-bold text-white truncate">
                      {selectedTicket.category || selectedTicket.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                        selectedTicket.status === "OPEN"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-[#1F2E4D] my-4" />
              </div>

              {/* Chat Bubble List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[380px] my-2">
                {isTicketDetailsLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-xs">Loading thread...</span>
                  </div>
                ) : !selectedTicket.messages || selectedTicket.messages.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
                    <MessageSquare className="w-8 h-8 stroke-[1.5] text-slate-600" />
                    <p className="text-xs font-medium text-slate-300">
                      Ticket opened. Initial description recorded:
                    </p>
                    <div className="bg-[#0b1220] p-3 rounded-xl border border-[#1F2E4D] max-w-md text-xs text-slate-300">
                      {selectedTicket.description}
                    </div>
                  </div>
                ) : (
                  selectedTicket.messages.map((msg) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isAdmin ? "items-start" : "items-end"
                        } gap-1`}
                      >
                        {/* Message Bubble */}
                        <div
                          className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-md text-sm leading-relaxed ${
                            isAdmin
                              ? "bg-[#1a243d] text-slate-100 border border-[#1F2E4D] rounded-tl-xs"
                              : "bg-[#052350] text-white border border-blue-500/40 rounded-tr-xs shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {msg.text || msg.message}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-1.5 text-right font-mono">
                            {msg.time}
                          </div>
                        </div>

                        {/* Sender Label */}
                        <span className="text-[11px] font-semibold text-slate-500 px-1">
                          {isAdmin ? (
                            <span className="text-blue-400">
                              {msg.senderName || "Admin Support"}
                            </span>
                          ) : (
                            <span>{msg.senderName || "You"}</span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="mt-4 flex items-center gap-2 bg-[#0b1220] rounded-full p-1.5 pl-5 border border-[#1F2E4D] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all shadow-inner"
              >
                <input
                  type="text"
                  value={chatMessage}
                  disabled={selectedTicket.status === "CLOSED" || isSendingMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={
                    selectedTicket.status === "CLOSED"
                      ? "This ticket is closed."
                      : "Describe what you want to see or reply to admin..."
                  }
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={
                    !chatMessage.trim() ||
                    selectedTicket.status === "CLOSED" ||
                    isSendingMessage
                  }
                  className="w-10 h-10 rounded-full bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0 active:scale-95"
                >
                  {isSendingMessage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  ) : (
                    <Send className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3">
              <Inbox className="w-12 h-12 stroke-[1.5] text-slate-600" />
              <p className="text-base font-semibold text-slate-300">
                Select a ticket from the history or create a new one above
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Real-time communication with global technical support will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerTicket;
