import { useState, useRef, useEffect } from "react";
import AdminTitle from "@/common/AdminTitle";
import {
  Search,
  MessageSquare,
  Building2,
  CheckCircle2,
  RotateCcw,
  Send,
  Inbox,
  RefreshCw,
} from "lucide-react";
import {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useAddTicketMessageMutation,
  useUpdateSupportTicketStatusMutation,
} from "@/redux/features/admin/ticket/ticketApi";
import { toast } from "sonner";

const SubmitTicket = () => {
  const [activeTab, setActiveTab] = useState<"OPEN" | "CLOSED">("OPEN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: tickets = [], isLoading, refetch } = useGetSupportTicketsQuery({
    status: activeTab,
    search: searchQuery,
  });

  const { data: selectedTicket } = useGetSupportTicketByIdQuery(selectedTicketId || "", {
    skip: !selectedTicketId,
  });

  const [addMessage] = useAddTicketMessageMutation();
  const [updateStatus] = useUpdateSupportTicketStatusMutation();

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !responseText.trim()) return;

    try {
      await addMessage({
        id: selectedTicketId,
        message: responseText.trim(),
      }).unwrap();
      setResponseText("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedTicket) return;
    const newStatus = selectedTicket.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await updateStatus({ id: selectedTicket.id, status: newStatus }).unwrap();
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="w-full space-y-6">
      <AdminTitle title="Admin Queue" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Tickets List */}
        <div className="lg:col-span-4 bg-[#131b2e] rounded-2xl border border-[#1F2E4D] overflow-hidden flex flex-col max-h-[750px] min-h-[680px]">
          {/* Header & Tabs */}
          <div className="p-4 border-b border-[#1F2E4D] space-y-3.5 bg-[#131b2e]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
                <h2 className="text-base font-bold text-white tracking-wide">Admin Queue</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetch()}
                  className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </button>
                <span className="bg-[#052350] text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  {tickets.length}
                </span>
              </div>
            </div>

            {/* OPEN / CLOSED Tab Selector */}
            <div className="grid grid-cols-2 p-1 bg-[#0b1220] rounded-xl border border-[#1F2E4D]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("OPEN");
                  setSelectedTicketId(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "OPEN"
                  ? "bg-[#052350] text-white border border-[#1F2E4D]"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                OPEN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("CLOSED");
                  setSelectedTicketId(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "CLOSED"
                  ? "bg-[#052350] text-white border border-[#1F2E4D]"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                CLOSED
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1220] border border-[#1F2E4D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {isLoading ? (
              <div className="text-center py-10 text-slate-500 text-xs">Loading queue...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No tickets in this queue.</div>
            ) : (
              tickets.map((ticket) => {
                const isSelected = selectedTicketId === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? "bg-[#052350]/60 border-blue-500/60 shadow-md"
                      : "bg-[#0b1220] border-[#1F2E4D] hover:bg-[#162035]"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-sm text-white truncate">
                        {ticket.category || ticket.title}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${ticket.status === "OPEN"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-slate-600 text-slate-400 bg-slate-800"
                          }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1F2E4D]/40">
                      <div className="flex items-center gap-1.5 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{ticket.messagesCount || ticket.messages?.length || 1}</span>
                        <span className="text-slate-600 font-bold mx-0.5">•</span>
                        <span className="font-bold text-slate-300 uppercase tracking-wider truncate max-w-[130px]">
                          {ticket.businessName || ticket.business?.businessName || "RESTAURANT"}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px]">
                        {ticket.time || (ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Chat Area */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b1220] rounded-2xl border border-[#1F2E4D] overflow-hidden min-h-[680px] max-h-[750px]">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 sm:p-5 bg-[#131b2e] border-b border-[#1F2E4D] flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {selectedTicket.category || selectedTicket.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {selectedTicket.businessName || selectedTicket.business?.businessName || "RESTAURANT TENANT"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleStatus}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition ${selectedTicket.status === "OPEN"
                      ? "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                      : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                      }`}
                  >
                    {selectedTicket.status === "OPEN" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> CLOSE TICKET
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> REOPEN TICKET
                      </>
                    )}
                  </button>

                  <span
                    className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-lg border ${selectedTicket.status === "OPEN"
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : "border-slate-500/40 text-slate-400 bg-slate-500/10"
                      }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col justify-start"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255, 255, 255, 0.05) 1.2px, transparent 1.2px)",
                  backgroundSize: "22px 22px",
                }}
              >
                {selectedTicket.messages?.map((msg) => {
                  const isUser = msg.sender === "user" || msg.senderRole === "manager";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-start" : "items-end"} gap-1`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-sm leading-relaxed ${!isUser
                          ? "bg-[#052350] text-white border border-blue-500/40 rounded-tr-sm shadow-sm"
                          : "bg-[#1a243d] text-slate-100 border border-[#1F2E4D] rounded-tl-sm shadow-sm"
                          }`}
                      >
                        {msg.text || msg.message}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] px-1 text-slate-500">
                        {!isUser ? (
                          <>
                            <span>{msg.time}</span>
                            <span className="font-bold text-blue-400">Admin</span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-slate-300">{msg.senderName}</span>
                            <span>{msg.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-[#131b2e] border-t border-[#1F2E4D]">
                <form onSubmit={handleSendResponse} className="flex items-center gap-3 bg-[#0b1220] border border-[#1F2E4D] rounded-xl p-2 pl-4 focus-within:border-blue-500">
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a response as Super Admin..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!responseText.trim()}
                    className="p-2.5 rounded-lg bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] disabled:opacity-30 text-white transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
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
