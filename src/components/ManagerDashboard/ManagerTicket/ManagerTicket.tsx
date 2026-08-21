import React, { useState } from "react";
import { Send, SendHorizontal, Server, Cpu, HardDrive } from "lucide-react";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  sender: "admin" | "user";
  text: string;
  time: string;
}

interface SupportTicket {
  id: string;
  category: string;
  status: "OPEN" | "RESOLVED";
  messages: TicketMessage[];
}

const issueCategories = [
  "Sync Issue",
  "Hardware/Printer Error",
  "Inventory/Barcode Error",
  "Payment Failure",
];

const initialTickets: SupportTicket[] = [
  {
    id: "t-1",
    category: "Hardware/Printer Error",
    status: "OPEN",
    messages: [
      {
        id: "m-1",
        sender: "admin",
        text: "Hi Rene, we are seeing some delays in syncing the latest inventory.",
        time: "11:10:46",
      },
      {
        id: "m-2",
        sender: "user",
        text: "Checking the logs now. I see a database mismatch error.",
        time: "11:10:45",
      },
    ],
  },
  {
    id: "t-2",
    category: "Hardware/Printer Error",
    status: "OPEN",
    messages: [
      {
        id: "m-3",
        sender: "admin",
        text: "Receipt printer connection timed out on terminal 2.",
        time: "10:30:12",
      },
    ],
  },
  {
    id: "t-3",
    category: "Inventory/Barcode Error",
    status: "OPEN",
    messages: [
      {
        id: "m-4",
        sender: "user",
        text: "Barcode RENE-1002 is not registering on checkout.",
        time: "09:15:00",
      },
    ],
  },
  {
    id: "t-4",
    category: "Payment Failure",
    status: "RESOLVED",
    messages: [
      {
        id: "m-5",
        sender: "admin",
        text: "Card processor webhook successfully re-authenticated.",
        time: "Yesterday",
      },
    ],
  },
];

const ManagerTicket: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Sync Issue");
  const [description, setDescription] = useState<string>("");
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("t-1");
  const [chatMessage, setChatMessage] = useState<string>("");

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please explain what happened before submitting.");
      return;
    }

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      category: selectedCategory,
      status: "OPEN",
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "user",
          text: description.trim(),
          time: currentTime,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setDescription("");
    toast.success("Ticket submitted to Global Admin Dashboard!");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTicket) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: chatMessage.trim(),
      time: currentTime,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      )
    );

    setChatMessage("");
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
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mb-4">
                Issue Category
              </h2>
              <div className="w-full h-px bg-[#1F2E4D] mb-5" />

              {/* 4 Category Pill Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {issueCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center border ${
                        isSelected
                          ? "bg-[#052350] text-white border-blue-500/60 shadow-md ring-1 ring-blue-500/30"
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
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please explain what happened..."
                className="w-full bg-[#0b1220] border border-[#1F2E4D] rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Ticket to Global Dashboard</span>
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Auto-Captured Diagnostics Data */}
        <div className="lg:col-span-4 bg-[#0b1220] rounded-3xl p-6 sm:p-7 border border-[#1F2E4D] shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                AUTO-CAPTURED DATA
              </h3>
              <div className="w-full h-px bg-[#1F2E4D] mt-3" />
            </div>

            {/* Device ID */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                DEVICE ID
              </span>
              <p className="text-sm font-bold text-white tracking-wide">
                RENE-POS-8821
              </p>
            </div>

            {/* Software Version */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                SOFTWARE VERSION
              </span>
              <p className="text-sm font-bold text-white tracking-wide font-mono">
                v2.4.1-stable
              </p>
            </div>

            {/* Last Sync */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                LAST SYNC
              </span>
              <p className="text-sm font-bold text-white tracking-wide">
                07/03/2026, 15:22:04
              </p>
            </div>
          </div>

          {/* Diagnostic Note Box */}
          <div className="mt-6 bg-[#131b2e] rounded-2xl p-4 border border-[#1F2E4D]/80">
            <p className="text-xs text-slate-400 leading-relaxed">
              This diagnostic data is automatically attached to your ticket to
              help our engineers resolve your issue faster.
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION: SUPPORT HISTORY & COMMUNICATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support History List */}
        <div className="lg:col-span-4 bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Support History
            </h3>
            <div className="w-full h-px bg-[#1F2E4D] mt-3" />
          </div>

          {/* Pill List */}
          <div className="space-y-3">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full py-3 px-5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer text-left border flex items-center justify-between ${
                    isSelected
                      ? "bg-[#052350] text-white border-blue-500/60 shadow-md ring-1 ring-blue-500/30"
                      : "bg-[#0b1220] hover:bg-[#0e172a] text-slate-300 border-[#1F2E4D]"
                  }`}
                >
                  <span className="truncate">{t.category}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      t.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {t.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Communication Chat Area */}
        <div className="lg:col-span-8 bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-[#1F2E4D] shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
              COMMUNICATION
            </h3>
            <div className="w-full h-px bg-[#1F2E4D] mb-5" />

            {/* Chat Bubble List */}
            <div className="space-y-5 overflow-y-auto max-h-[320px] pr-1">
              {selectedTicket?.messages.map((msg) => {
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
                      className={`p-4 rounded-2xl max-w-[85%] sm:max-w-lg text-sm leading-relaxed ${
                        isAdmin
                          ? "bg-[#1a243d] text-slate-100 border border-[#1F2E4D] rounded-tl-xs"
                          : "bg-[#052350] text-white border border-blue-500/40 rounded-tr-xs shadow-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="text-[10px] text-slate-400 mt-1.5 text-right font-mono">
                        {msg.time}
                      </div>
                    </div>

                    {/* Sender Label */}
                    <span className="text-[11px] font-semibold text-slate-500 px-1">
                      {isAdmin ? "Admin" : "You"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="mt-6 flex items-center gap-2 bg-[#0b1220] rounded-full p-1.5 pl-5 border border-[#1F2E4D] focus-within:border-[#052350] focus-within:ring-1 focus-within:ring-[#052350] transition-all shadow-inner"
          >
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Describe what you want to see..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim()}
              className="w-10 h-10 rounded-full bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerTicket;
