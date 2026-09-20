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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetStaffApprovalsQuery,
  useUpdateApprovalStatusMutation,
} from "@/redux/features/auth/userApi";
import { IUser } from "@/redux/features/auth/userType";

export const getStaffApprovalStatus = (
  req: IUser
): "PENDING" | "APPROVED" | "BLOCKED" => {
  if (!req) return "PENDING";
  const statusUpper = (req.status || req.approvalStatus || "").toUpperCase();

  // 1. Explicit Blocked / Rejected
  if (
    statusUpper === "BLOCKED" ||
    statusUpper === "REJECTED" ||
    statusUpper === "SUSPENDED" ||
    (req.isActive === false && req.isApproved !== false && statusUpper !== "PENDING")
  ) {
    return "BLOCKED";
  }

  // 2. Pending Approval
  if (
    statusUpper === "PENDING" ||
    statusUpper.includes("PENDING") ||
    req.isApproved === false ||
    (!req.isApproved && statusUpper !== "APPROVED")
  ) {
    return "PENDING";
  }

  // 3. Approved
  if (
    req.isApproved === true ||
    statusUpper === "APPROVED" ||
    req.isActive === true
  ) {
    return "APPROVED";
  }

  return "PENDING";
};

const ApprovalsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "BLOCKED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const {
    data: approvalsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetStaffApprovalsQuery({
    search: searchQuery.trim() || undefined,
    status: activeFilter === "ALL" ? undefined : activeFilter,
  });

  const [updateApproval, { isLoading: isUpdatingApproval }] =
    useUpdateApprovalStatusMutation();

  // Purely dynamic data from API (no static mock data)
  const requests: IUser[] = useMemo(() => {
    if (approvalsData?.requests && Array.isArray(approvalsData.requests)) {
      return approvalsData.requests;
    }
    if (approvalsData?.employees && Array.isArray(approvalsData.employees)) {
      return approvalsData.employees;
    }
    return [];
  }, [approvalsData]);

  // Derived filtered requests for tabs with safe-guards against null/undefined
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (!req) return false;

      const currentStatus = getStaffApprovalStatus(req);

      if (activeFilter === "PENDING" && currentStatus !== "PENDING") {
        return false;
      }
      if (activeFilter === "APPROVED" && currentStatus !== "APPROVED") {
        return false;
      }
      if (activeFilter === "BLOCKED" && currentStatus !== "BLOCKED") {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const nameMatch = Boolean(req.name?.toLowerCase().includes(q));
      const emailMatch = Boolean(req.email?.toLowerCase().includes(q));
      const roleMatch = Boolean(req.role?.toLowerCase().includes(q));
      const deptMatch = Boolean(req.department?.toLowerCase().includes(q));

      return nameMatch || emailMatch || roleMatch || deptMatch;
    });
  }, [requests, activeFilter, searchQuery]);

  // Dynamic metrics from API with calculated fallback
  const pendingCount =
    approvalsData?.metrics?.pendingCount ??
    requests.filter((r) => getStaffApprovalStatus(r) === "PENDING").length;

  const approvedCount =
    approvalsData?.metrics?.approvedCount ??
    requests.filter((r) => getStaffApprovalStatus(r) === "APPROVED").length;

  const blockedCount =
    approvalsData?.metrics?.blockedCount ??
    requests.filter((r) => getStaffApprovalStatus(r) === "BLOCKED").length;

  // Dynamic pagination
  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRequests = useMemo(() => {
    return filteredRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequests, startIndex, rowsPerPage]);

  const handleApprove = async (id: string, name?: string) => {
    try {
      await updateApproval({
        id,
        payload: {
          status: "APPROVED",
          isActive: true,
          isApproved: true,
        },
      }).unwrap();
      toast.success(`${name || "Staff member"} has been APPROVED and can now log in!`);
      refetch();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to approve staff member";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const handleBlock = async (id: string, name?: string) => {
    try {
      await updateApproval({
        id,
        payload: {
          status: "BLOCKED",
          isActive: false,
          isApproved: false,
        },
      }).unwrap();
      toast.error(`${name || "Staff member"}'s login access has been BLOCKED.`);
      refetch();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to block staff access";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Supervisor Security & Access Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Manager & Staff Login Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            As Restaurant Supervisor / Owner, you control system login
            permissions. Managers and staff require your active approval to
            access their dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#131b2e] hover:bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Approvals */}
        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm hover:border-amber-500/40 transition-colors">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Pending Approvals
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {pendingCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Awaiting your permission to login
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Approved Accounts */}
        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition-colors">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Approved Accounts
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {approvedCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Active with login rights
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Blocked / Suspended */}
        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm hover:border-red-500/40 transition-colors">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
              Blocked / Suspended
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {blockedCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Restricted from accessing system
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131b2e] border border-[#1F2E4D] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveFilter("ALL");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeFilter === "ALL"
                ? "bg-[#052350] text-blue-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Requests
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("PENDING");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === "PENDING"
                ? "bg-[#052350] text-amber-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("APPROVED");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeFilter === "APPROVED"
                ? "bg-[#052350] text-emerald-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("BLOCKED");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeFilter === "BLOCKED"
                ? "bg-[#052350] text-rose-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Blocked
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or role..."
            className="w-full bg-[#131b2e] border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl pl-9.5 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1F2E4D] bg-[#0f172a]/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="px-6 py-3.5">Employee / Manager</th>
              <th className="px-6 py-3.5">Role & Department</th>
              <th className="px-6 py-3.5 text-center">Access PIN</th>
              <th className="px-6 py-3.5 text-center">Approval Status</th>
              <th className="px-6 py-3.5 text-right">Supervisor Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2E4D]/40">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    <span>Loading approval requests...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500 text-xs sm:text-sm"
                >
                  No staff requests found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req) => {
                const currentStatus = getStaffApprovalStatus(req);
                const isApproved = currentStatus === "APPROVED";
                const isPending = currentStatus === "PENDING";
                const isBlocked = currentStatus === "BLOCKED";

                // Safe non-null avatar url with Dicebear fallback
                const avatarUrl =
                  req.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    req.name || req.id || "user"
                  )}`;

                const pinDisplay = req.pin || req.accessPin || "1234";

                return (
                  <tr
                    key={req.id}
                    className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition-colors"
                  >
                    {/* Name & Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt={req.name || "Employee"}
                          className="w-10 h-10 rounded-full object-cover border border-[#1F2E4D] shrink-0 shadow-sm bg-[#0b101d]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              req.name || "user"
                            )}`;
                          }}
                        />
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {req.name || "Unnamed"}
                          </span>
                          <span className="text-slate-400 text-xs block">
                            {req.email || "No email assigned"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                            (req.role || "").toLowerCase() === "supervisor"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : (req.role || "").toLowerCase() === "manager"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : (req.role || "").toLowerCase() === "cashier"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : (req.role || "").toLowerCase() === "kitchen"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {req.role || "Staff"}
                        </span>
                        {req.department && (
                          <span className="text-xs text-slate-400 block">
                            {req.department}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Access PIN */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0b101d] border border-[#1F2E4D] text-slate-300">
                        {pinDisplay.startsWith("PIN:") ? pinDisplay : `PIN: ${pinDisplay}`}
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
                      {isBlocked && (
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
                            onClick={() => handleApprove(req.id, req.name)}
                            disabled={isUpdatingApproval}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{isBlocked ? "Unblock & Approve" : "Accept & Approve"}</span>
                          </button>
                        )}

                        {!isBlocked && (
                          <button
                            type="button"
                            onClick={() => handleBlock(req.id, req.name)}
                            disabled={isUpdatingApproval}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-50"
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
            Showing{" "}
            <span className="text-white font-semibold">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="text-white font-semibold">
              {Math.min(startIndex + rowsPerPage, totalResults)}
            </span>{" "}
            of <span className="text-white font-semibold">{totalResults}</span>{" "}
            staff requests
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
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  currentPage === page
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
