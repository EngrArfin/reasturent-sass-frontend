import { useState, useMemo } from "react";
import { Search, RotateCw } from "lucide-react";
import { useGetAllVouchersQuery, VoucherItem } from "@/redux/features/admin/voucher/voucherApi";

export interface SubscriptionVoucher {
  id: string;
  subscriptionCode: string;
  business: string;
  amountOff: number;
  status: "Active" | "Expired";
  expiryDate: string;
  usage: "Used" | "Unused";
}

const INITIAL_VOUCHERS: SubscriptionVoucher[] = [
  {
    id: "1",
    subscriptionCode: "ERG-DJKKHGHJ",
    business: "hridoy 420",
    amountOff: 81,
    status: "Expired",
    expiryDate: "Aug 7, 1972, 08:06 PM",
    usage: "Unused",
  },
  {
    id: "2",
    subscriptionCode: "FREE",
    business: "Roadhouse~PrimeLifeGroup",
    amountOff: 99,
    status: "Active",
    expiryDate: "Jun 15, 2029, 06:27 AM",
    usage: "Used",
  },
  {
    id: "3",
    subscriptionCode: "S21",
    business: "business1",
    amountOff: 10,
    status: "Expired",
    expiryDate: "Jun 15, 2026, 01:30 PM",
    usage: "Used",
  },
  {
    id: "4",
    subscriptionCode: "SUMMER21",
    business: "hridoy food",
    amountOff: 20,
    status: "Expired",
    expiryDate: "Jun 15, 2026, 01:19 PM",
    usage: "Unused",
  },
  {
    id: "5",
    subscriptionCode: "PGDHJHFJH",
    business: "420 business",
    amountOff: 59,
    status: "Expired",
    expiryDate: "Nov 6, 1978, 12:01 PM",
    usage: "Unused",
  },
  {
    id: "6",
    subscriptionCode: "ADSHD-SEDD",
    business: "420 business",
    amountOff: 99,
    status: "Expired",
    expiryDate: "Jan 5, 1999, 12:08 AM",
    usage: "Unused",
  },
  {
    id: "7",
    subscriptionCode: "SUDKJHJH-86HF",
    business: "657657567",
    amountOff: 30,
    status: "Active",
    expiryDate: "Jun 17, 2027, 08:05 AM",
    usage: "Unused",
  },
  {
    id: "8",
    subscriptionCode: "SUDKJHJH-86H",
    business: "657657567",
    amountOff: 42,
    status: "Expired",
    expiryDate: "Apr 28, 2016, 03:52 PM",
    usage: "Unused",
  },
];

const SubscriptionTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: apiVouchers = [], isLoading, refetch } = useGetAllVouchersQuery({
    search: searchQuery,
  });

  // Map API data or fallback to demo data
  const vouchers: SubscriptionVoucher[] = useMemo(() => {
    if (apiVouchers && apiVouchers.length > 0) {
      return apiVouchers.map((v: VoucherItem) => ({
        id: v.id,
        subscriptionCode: v.code || v.subscriptionCode || "N/A",
        business: v.business?.businessName || v.business?.name || v.businessName || "Restaurant Tenant",
        amountOff: parseFloat(v.offPrice?.replace(/[^0-9.]/g, "") || "0") || (v.amountOff ? Math.round(v.amountOff) : 0),
        status: (v.status as "Active" | "Expired") || (v.expiresAt && new Date(v.expiresAt) < new Date() ? "Expired" : "Active"),
        expiryDate: v.expiryDate || (v.expiresAt ? new Date(v.expiresAt).toLocaleString() : "Never"),
        usage: v.usage as "Used" | "Unused" || (v.isUsed ? "Used" : "Unused"),
      }));
    }
    return INITIAL_VOUCHERS;
  }, [apiVouchers]);

  // Filter based on search
  const filteredVouchers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return vouchers;
    return vouchers.filter(
      (v) =>
        v.subscriptionCode.toLowerCase().includes(query) ||
        v.business.toLowerCase().includes(query)
    );
  }, [vouchers, searchQuery]);

  // Pagination calculation
  const totalResults = filteredVouchers.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedVouchers = useMemo(() => {
    return filteredVouchers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredVouchers, startIndex, rowsPerPage]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="w-full">
      <div className="bg-[#131b2e] rounded-2xl border border-[#1F2E4D] overflow-hidden shadow-xl">
        {/* Table Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 border-b border-[#1F2E4D]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              All Subscription Vouchers
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by code or business"
                className="w-full bg-[#1a243d] border border-[#1F2E4D] text-white text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#052350] transition"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#232f4c] text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#1F2E4D] bg-[#1a243d]">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Subscription Code
                </th>
                <th className="px-6 py-4 text-left text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Business
                </th>
                <th className="px-6 py-4 text-center text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Amount Off
                </th>
                <th className="px-6 py-4 text-center text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-center text-slate-300 text-sm font-semibold whitespace-nowrap">
                  Usage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1F2E4D]/60 text-sm">
              {paginatedVouchers.length > 0 ? (
                paginatedVouchers.map((voucher) => (
                  <tr
                    key={voucher.id}
                    className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-white whitespace-nowrap">
                        {voucher.subscriptionCode}
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-300 font-medium">
                        {voucher.business}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-[#051329] border border-[#1F2E4D] text-xs font-bold text-white tracking-wider shadow-inner">
                        {voucher.amountOff}% OFF
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          voucher.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border border-slate-700/60"
                        }`}
                      >
                        {voucher.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-400 whitespace-nowrap">
                      {voucher.expiryDate}
                    </td>

                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          voucher.usage === "Used"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {voucher.usage}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-sm font-medium"
                  >
                    No vouchers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 px-6 py-4 border-t border-[#1F2E4D] bg-[#131b2e]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <span>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#1a243d] border border-[#1F2E4D] text-white rounded-lg px-2.5 py-1 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#052350] cursor-pointer appearance-none pr-7"
              >
                <option value={5} className="bg-[#131b2e] text-white">5</option>
                <option value={10} className="bg-[#131b2e] text-white">10</option>
                <option value={20} className="bg-[#131b2e] text-white">20</option>
                <option value={50} className="bg-[#131b2e] text-white">50</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            {totalResults === 0 ? (
              "Showing 0 results"
            ) : (
              <>
                Showing{" "}
                <span className="text-white font-semibold">{startIndex + 1}</span> to{" "}
                <span className="text-white font-semibold">
                  {Math.min(startIndex + rowsPerPage, totalResults)}
                </span> of{" "}
                <span className="text-white font-semibold">{totalResults}</span> results
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#232f4c] text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-1.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#232f4c] text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
