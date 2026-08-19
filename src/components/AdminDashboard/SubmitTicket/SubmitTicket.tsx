import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  RotateCcw,
  Search,
  Building2,
  Inbox,
} from "lucide-react";

interface TicketMessage {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  time: string;
}

interface TicketItem {
  id: string;
  title: string;
  description: string;
  businessName: string;
  status: "OPEN" | "CLOSED";
  messagesCount: number;
  time: string;
  messages: TicketMessage[];
}

const initialTickets: TicketItem[] = [
  {
    id: "ticket-1",
    title: "Inventory/Barcode Error",
    description: "2423423",
    businessName: "RGERGERG",
    status: "OPEN",
    messagesCount: 2,
    time: "11:15 AM",
    messages: [
      {
        id: "m-101",
        sender: "user",
        senderName: "RGERGERG Staff",
        text: "Inventory scanner is throwing barcode error code 2423423 when checking out items.",
        time: "11:14 AM",
      },
      {
        id: "m-102",
        sender: "user",
        senderName: "RGERGERG Staff",
        text: "2423423",
        time: "11:15 AM",
      },
    ],
  },
  {
    id: "ticket-2",
    title: "Sync Issue",
    description: "your problem solve",
    businessName: "LABIB BIRIYANI HOUSE",
    status: "OPEN",
    messagesCount: 4,
    time: "12:16 PM",
    messages: [
      {
        id: "m-201",
        sender: "user",
        senderName: "Labib UR Rahman",
        text: "Test",
        time: "12:16 PM",
      },
      {
        id: "m-202",
        sender: "user",
        senderName: "Labib UR Rahman",
        text: "Hi",
        time: "12:16 PM",
      },
      {
        id: "m-203",
        sender: "admin",
        senderName: "Admin",
        text: "hi",
        time: "02:18 PM",
      },
      {
        id: "m-204",
        sender: "admin",
        senderName: "Admin",
        text: "your problem solve",
        time: "02:24 PM",
      },
    ],
  },
  {
    id: "ticket-3",
    title: "Payment Gateway Connection",
    description: "Stripe webhook reconnected and verified",
    businessName: "THE BURGER LAB",
    status: "CLOSED",
    messagesCount: 3,
    time: "Yesterday",
    messages: [
      {
        id: "m-301",
        sender: "user",
        senderName: "Tanvir Hossain",
        text: "Orders not auto-marking as paid after checkout.",
        time: "04:40 PM",
      },
      {
        id: "m-302",
        sender: "admin",
        senderName: "Admin",
        text: "Resolved webhook endpoint queue and re-synced all orders.",
        time: "05:12 PM",
      },
    ],
  },
];

const SubmitTicket: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"OPEN" | "CLOSED">("OPEN");
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("ticket-2");
  const [responseText, setResponseText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter tickets by active tab (OPEN/CLOSED) and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesTab = ticket.status === activeTab;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Currently selected ticket
  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) ||
    filteredTickets[0] ||
    tickets[0];

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  // Send message
  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || !selectedTicket) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      senderName: "Admin",
      text: responseText.trim(),
      time: currentTime,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicket.id) {
          const updatedMessages = [...t.messages, newMessage];
          return {
            ...t,
            description: responseText.trim(),
            messagesCount: updatedMessages.length,
            time: currentTime,
            messages: updatedMessages,
          };
        }
        return t;
      })
    );

    setResponseText("");
  };

  // Toggle ticket status (Close / Reopen)
  const handleToggleStatus = () => {
    if (!selectedTicket) return;
    const nextStatus = selectedTicket.status === "OPEN" ? "CLOSED" : "OPEN";

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, status: nextStatus } : t
      )
    );
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const closedCount = tickets.filter((t) => t.status === "CLOSED").length;

  return (
    <div className="w-full bg-black min-h-[calc(100vh-100px)] text-white p-3 sm:p-5 md:p-7 rounded-3xl border border-white/10 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[760px]">
        {/* ================= LEFT SIDEBAR: ADMIN QUEUE ================= */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              {/* Vertical Accent Pill */}
              <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Admin Queue
              </h2>
            </div>
            {/* Counter Badge */}
            <div className="w-7 h-7 rounded-full bg-[#0B1528] border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs font-bold shadow-inner">
              {activeTab === "OPEN" ? openCount : closedCount}
            </div>
          </div>

          {/* Segmented Switch: OPEN / CLOSED */}
          <div className="bg-[#111726] p-1.5 rounded-2xl border border-white/10 grid grid-cols-2 gap-1 shadow-md">
            <button
              onClick={() => setActiveTab("OPEN")}
              className={`py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "OPEN"
                  ? "bg-white text-black shadow-lg scale-[1.01]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              OPEN
            </button>
            <button
              onClick={() => setActiveTab("CLOSED")}
              className={`py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "CLOSED"
                  ? "bg-white text-black shadow-lg scale-[1.01]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              CLOSED
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E1524] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Tickets List */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[580px] pr-1">
            {filteredTickets.length === 0 ? (
              <div className="bg-[#0E1524]/60 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                <Inbox className="w-8 h-8 text-slate-600" />
                <p className="text-xs font-medium">No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between min-h-[120px] border ${
                      isSelected
                        ? "bg-[#0B1528] border-blue-500/70 shadow-[0_4px_20px_rgba(30,58,138,0.35)] ring-1 ring-blue-500/30"
                        : "bg-[#0E1524]/80 hover:bg-[#131c30] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Top: Title + Status Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isSelected ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {ticket.title}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wide flex-shrink-0 ${
                          ticket.status === "OPEN"
                            ? "border-emerald-500/80 text-emerald-400 bg-emerald-500/10"
                            : "border-slate-500/80 text-slate-400 bg-slate-500/10"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    {/* Middle: snippet */}
                    <p className="text-xs text-slate-400 line-clamp-1 my-1.5">
                      {ticket.description}
                    </p>

                    {/* Bottom: Meta Row */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                        <span className="font-semibold">{ticket.messagesCount}</span>
                        <span className="text-slate-600 font-bold mx-0.5">•</span>
                        <span className="font-bold text-slate-300 uppercase tracking-wider truncate max-w-[140px]">
                          {ticket.businessName}
                        </span>
                      </div>
                      <span className="text-slate-500 font-medium whitespace-nowrap pl-2">
                        {ticket.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: CHAT AREA ================= */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col bg-[#080D17] rounded-3xl border border-white/10 overflow-hidden shadow-2xl min-h-[680px]">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 bg-[#0B1220]/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {selectedTicket.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {selectedTicket.businessName}
                    </p>
                  </div>
                </div>

                {/* Status & Close Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleStatus}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                      selectedTicket.status === "OPEN"
                        ? "border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400"
                        : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400"
                    }`}
                  >
                    {selectedTicket.status === "OPEN" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CLOSE TICKET
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        REOPEN TICKET
                      </>
                    )}
                  </button>

                  <span
                    className={`text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-xl border tracking-wide ${
                      selectedTicket.status === "OPEN"
                        ? "border-emerald-500/80 text-emerald-400 bg-emerald-500/10"
                        : "border-slate-600 text-slate-400 bg-slate-600/10"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Chat Conversation Body with Dotted Background Pattern */}
              <div
                className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col justify-start"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)",
                  backgroundSize: "22px 22px",
                }}
              >
                {selectedTicket.messages.map((message) => {
                  const isUser = message.sender === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        isUser ? "items-start" : "items-end"
                      } gap-1.5`}
                    >
                      {/* Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-md shadow-md text-sm leading-relaxed transition-all ${
                          isUser
                            ? "bg-[#141E30] text-slate-100 border border-white/10 rounded-tl-sm"
                            : "bg-[#0B1528] text-white border border-blue-500/50 rounded-tr-sm shadow-[0_4px_16px_rgba(15,23,42,0.6)]"
                        }`}
                      >
                        <p className="font-normal">{message.text}</p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[11px] px-1">
                        {isUser ? (
                          <>
                            <span className="font-bold text-slate-200">
                              {message.senderName}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {message.time}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-500 font-medium">
                              {message.time}
                            </span>
                            <span className="font-bold text-blue-400">
                              {message.senderName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 sm:p-6 bg-[#0B1220]/90 backdrop-blur-md border-t border-white/10">
                <form
                  onSubmit={handleSendResponse}
                  className="flex items-center gap-3 bg-[#11192A] border border-white/15 focus-within:border-blue-500/80 rounded-2xl p-2 pl-5 transition-all shadow-inner"
                >
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a response..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!responseText.trim()}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3">
              <Inbox className="w-12 h-12 stroke-[1.5]" />
              <p className="text-base font-semibold text-slate-300">
                Select a ticket from the queue to start responding
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitTicket;
