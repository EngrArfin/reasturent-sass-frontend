import React, { useState, useMemo } from "react";
import {
  UserX,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export interface ApprovalRequest {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Cashier" | "Kitchen" | "Server";
  status: "APPROVED" | "PENDING" | "REJECTED";
  requestedAt: string;
  pin: string;
  avatar: string;
  department: string;
}

const initialApprovalRequests: ApprovalRequest[] = [
  {
    id: "req-1",
    name: "Alex Rahman",
    email: "manager@restaurant.com",
    role: "Manager",
    status: "APPROVED",
    requestedAt: "Today, 09:30 AM",
    pin: "1234",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    department: "Floor Operations & Staffing",
  },
  {
    id: "req-2",
    name: "Tariqul Islam",
    email: "manager2@restaurant.com",
    role: "Manager",
    status: "PENDING",
    requestedAt: "Today, 11:15 AM",
    pin: "2345",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    department: "Inventory & Purchasing",
  },
  {
    id: "req-3",
    name: "Sumon Paul",
    email: "cashier1@restaurant.com",
    role: "Cashier",
    status: "APPROVED",
    requestedAt: "Yesterday, 04:00 PM",
    pin: "3456",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    department: "Main POS Counter",
  },
  {
    id: "req-4",
    name: "Chef Mick",
    email: "kitchen1@restaurant.com",
    role: "Kitchen",
    status: "APPROVED",
    requestedAt: "Yesterday, 02:20 PM",
    pin: "9012",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    department: "KDS Hot Kitchen",
  },
  {
    id: "req-5",
    name: "Karim Uddin",
    email: "server1@restaurant.com",
    role: "Server",
    status: "PENDING",
    requestedAt: "Today, 01:45 PM",
    pin: "5678",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    department: "Dine-in Floor A",
  },
  {
    id: "req-6",
    name: "Sophia Lee",
    email: "cashier2@restaurant.com",
    role: "Cashier",
    status: "APPROVED",
    requestedAt: "Aug 28, 10:00 AM",
    pin: "0123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    department: "Drive-Thru POS",
  },
  {
    id: "req-7",
    name: "Daniel Roy",
    email: "kitchen2@restaurant.com",
    role: "Kitchen",
    status: "REJECTED",
    requestedAt: "Aug 27, 03:30 PM",
    pin: "2345",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    department: "Bakery & Desserts",
  },
];

const ApprovalsPage: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialApprovalRequests);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleApprove = (id: string, name: string, role: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    toast.success(`Access Approved! ${role} "${name}" can now login to the system.`);
  };

  const handleReject = (id: string, name: string, role: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
    toast.error(`Login Access Denied for ${role} "${name}". Login is now blocked.`);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesTab = activeTab === "ALL" || item.status === activeTab;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.role.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term);
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchTerm]);

  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPending = requests.filter((r) => r.status === "PENDING").length;
  const totalApproved = requests.filter((r) => r.status === "APPROVED").length;
  const totalRejected = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="w-full space-y-6 text-white pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supervisor Security & Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Manager & Staff Login Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            As Restaurant Supervisor / Owner, you control system login permissions. Managers and staff require your active approval to access their dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setRequests(initialApprovalRequests);
              setSearchTerm("");
              setCurrentPage(1);
              toast.info("Refreshed access requests list");
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#131b2e] hover:bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition cursor-pointer shadow-sm shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-[#131b2e] border border-amber-500/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Pending Approvals
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalPending}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Awaiting your permission to login
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#131b2e] border border-emerald-500/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Approved Accounts
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalApproved}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Active with login rights
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#131b2e] border border-red-500/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Blocked / Suspended
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalRejected}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Restricted from accessing system
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0b101d] rounded-xl border border-[#1F2E4D] w-full sm:w-auto overflow-x-auto">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab
                ? "bg-[#052350] text-blue-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              {tab === "ALL" && "All Requests"}
              {tab === "PENDING" && `Pending (${totalPending})`}
              {tab === "APPROVED" && "Approved"}
              {tab === "REJECTED" && "Blocked"}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0b101d] border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-sm [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#101726] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#1F2E4D] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#2b416e]">
        <table className="min-w-[950px] w-full text-sm text-slate-300">
          <thead className="border-b border-[#1F2E4D] bg-[#1a243d]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Employee / Manager
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Role & Department
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Access PIN
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Approval Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Supervisor Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1F2E4D]/60 text-sm">
            {paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500 whitespace-nowrap"
                >
                  No approval requests found matching your filter.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req) => {
                const isPending = req.status === "PENDING";
                const isApproved = req.status === "APPROVED";
                const isRejected = req.status === "REJECTED";

                return (
                  <tr
                    key={req.id}
                    className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition-colors"
                  >
                    {/* Name & Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.avatar}
                          alt={req.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#1F2E4D] shrink-0 shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {req.name}
                          </span>
                          <span className="text-slate-400 text-xs block">
                            {req.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${req.role === "Manager"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : req.role === "Cashier"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : req.role === "Kitchen"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}
                        >
                          {req.role}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          {req.department}
                        </span>
                      </div>
                    </td>

                    {/* Access PIN */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0b101d] border border-[#1F2E4D] text-slate-300">
                        PIN: {req.pin}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved (Can Login)</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Acceptance</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Blocked (Denied)</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id, req.name, req.role)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Accept & Approve</span>
                          </button>
                        )}

                        {!isRejected && (
                          <button
                            type="button"
                            onClick={() => handleReject(req.id, req.name, req.role)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Block Access</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400">
          <div>
            Showing <span className="text-white font-semibold">{startIndex + 1}</span> to{" "}
            <span className="text-white font-semibold">
              {Math.min(startIndex + rowsPerPage, totalResults)}
            </span>{" "}
            of <span className="text-white font-semibold">{totalResults}</span> staff
            requests
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition cursor-pointer ${currentPage === page
                  ? "bg-[#052350] text-blue-400 border border-blue-500/40 shadow-sm"
                  : "bg-[#131b2e] border border-[#1F2E4D] text-slate-400 hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;
