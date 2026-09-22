import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BotAction {
  label: string;
  url?: string;
  onClickPrompt?: string;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  action?: BotAction;
}

interface BotResponseItem {
  reply: string;
  action?: BotAction;
}

const QUICK_PROMPTS = [
  { label: "💳 Pricing & Plans", prompt: "Tell me about your pricing plans and features" },
  { label: "🚀 Free 14-Day Trial", prompt: "How do I start a free 14-day trial?" },
  { label: "🖥️ POS & KDS Integration", prompt: "What POS and kitchen display hardware do you support?" },
  { label: "👥 Multi-branch & Roles", prompt: "Can I manage multiple restaurant branches and staff roles?" },
  { label: "📞 Live Demo Request", prompt: "I would like to book a personalized live demo" },
];

const BOT_RESPONSES: Record<string, BotResponseItem> = {
  pricing: {
    reply:
      "We offer flexible tiers to power restaurants of all sizes:\n\n• **Starter ($29/mo)**: 1 branch, POS integration & basic reports.\n• **Professional ($79/mo)**: Multi-branch, AI analytics & inventory management (Most Popular).\n• **Enterprise (Custom)**: Unlimited branches, white-label & 24/7 dedicated account manager.",
    action: { label: "View Pricing Details", url: "#pricing" },
  },
  trial: {
    reply:
      "You can start a **14-day unlimited free trial** with zero credit card required! Get instant access to table ordering, POS syncing, and real-time kitchen tracking.",
    action: { label: "Claim Free Trial", url: "/register" },
  },
  pos: {
    reply:
      "RestoFlow seamlessly syncs with leading POS systems including **Square, Clover, Toast, and Lightspeed**, alongside wireless thermal printers and Kitchen Display Systems (KDS).",
    action: { label: "Explore Integrations", onClickPrompt: "Can I use my existing tablet hardware?" },
  },
  roles: {
    reply:
      "Yes! RestoFlow provides multi-tenant role management for **Admins, Kitchen Staff, Waiters, and Cashiers** with granular access control and branch-level analytics.",
  },
  demo: {
    reply:
      "We'd love to show you a live walkthrough of RestoFlow's 3D floor map, inventory automation, and AI analytics. Our solution architects are ready to assist you!",
    action: { label: "Schedule Live Demo", url: "/contact" },
  },
};

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: "welcome-1",
    sender: "bot",
    text: "👋 Welcome to **RestoFlow OS**!\n\nI'm your AI Restaurant Consultant. How can I assist in streamlining your dining operations today?",
    time: "Just now",
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowTooltip(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setIsTyping(true);

    const query = text.toLowerCase();
    let responseData: BotResponseItem = {
      reply:
        "Thank you for asking! RestoFlow is designed to optimize restaurant operations, accelerate table turnover, and minimize waste. Would you like to check out our pricing or request a 1-on-1 walkthrough?",
      action: { label: "Contact Sales Team", url: "/contact" },
    };

    if (query.includes("price") || query.includes("pricing") || query.includes("cost") || query.includes("plan")) {
      responseData = BOT_RESPONSES.pricing;
    } else if (query.includes("trial") || query.includes("free") || query.includes("start")) {
      responseData = BOT_RESPONSES.trial;
    } else if (query.includes("pos") || query.includes("hardware") || query.includes("kitchen") || query.includes("kds") || query.includes("tablet")) {
      responseData = BOT_RESPONSES.pos;
    } else if (query.includes("branch") || query.includes("role") || query.includes("staff") || query.includes("multi")) {
      responseData = BOT_RESPONSES.roles;
    } else if (query.includes("demo") || query.includes("walkthrough") || query.includes("talk") || query.includes("call")) {
      responseData = BOT_RESPONSES.demo;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: responseData.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: responseData.action,
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Conversation refreshed! How else can I assist your restaurant today?",
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {/* 🚀 Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-4 w-[340px] sm:w-[400px] h-[550px] max-h-[85vh] rounded-3xl bg-[#0B132B]/95 text-slate-100 shadow-2xl shadow-black/60 border border-orange-500/25 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* 🌟 Header Section */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-[#020617] via-[#0B132B] to-[#124E66] border-b border-orange-500/20 flex items-center justify-between">
              {/* Subtle top ambient glow */}
              <div className="absolute -top-10 left-1/4 w-36 h-20 bg-orange-500/20 blur-2xl rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-bold">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0B132B] rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide text-white">RestoFlow AI</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      v2.4
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Always active & ready
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize chat"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 💬 Messages Scrollable Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#0B132B]/60 to-[#020617]/80 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[82%]`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed backdrop-blur-md transition-all ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-none shadow-md shadow-orange-500/20"
                          : "bg-slate-900/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md shadow-black/30"
                      }`}
                    >
                      <div className="whitespace-pre-line space-y-1.5">
                        {msg.text}
                      </div>

                      {/* Optional Rich Action Button inside Bot Message */}
                      {msg.action && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                          {msg.action.url ? (
                            <a
                              href={msg.action.url}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors shadow-sm"
                            >
                              <span>{msg.action.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              onClick={() => msg.action?.onClickPrompt && handleSend(msg.action.onClickPrompt)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-xs font-medium transition-colors"
                            >
                              <span>{msg.action.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 px-1 mt-1 font-medium tracking-tight">
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mb-1 shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Loader */}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl rounded-bl-none px-3.5 py-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestion Pills */}
              {messages.length <= 2 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[11px] text-slate-400 font-medium px-1 flex items-center gap-1">
                    <Headphones className="w-3 h-3 text-orange-400" />
                    Frequently asked questions:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="text-left text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/70 hover:border-orange-500/50 px-3 py-2 rounded-xl transition-all duration-150 flex items-center justify-between group"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 📝 Input Form Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#020617]/90 border-t border-slate-800/90 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask RestoFlow AI anything..."
                  className="w-full text-xs sm:text-sm bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-2xl pl-3.5 pr-8 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md shadow-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Footer Meta */}
            <div className="px-4 py-1.5 bg-[#020617] border-t border-slate-800/40 text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Protected by RestoFlow Enterprise Security
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛎️ Floating Trigger Badge & Tooltip */}
      <div className="relative flex items-center justify-end">
        {/* Helper Tooltip preview before opening */}
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-16 bg-[#0B132B]/95 text-slate-200 border border-orange-500/40 shadow-xl shadow-black/50 px-3.5 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap backdrop-blur-md hidden sm:flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>Need assistance? Chat with AI</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-200 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {/* Floating Action Button (FAB) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 focus:outline-none ${
            isOpen
              ? "bg-slate-900 border border-slate-700 text-slate-300"
              : "bg-gradient-to-tr from-[#ef6820] to-[#f59e0b] shadow-orange-500/40 border border-orange-400/40"
          }`}
          aria-label="Toggle RestoFlow Support Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-slate-200" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B132B]" />
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Chat;
