import { useState, useMemo } from "react";
import { Search, RotateCw } from "lucide-react";

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
  {
    id: "9",
    subscriptionCode: "TENANT-OFFER-199",
    business: "657657567",
    amountOff: 25,
    status: "Active",
    expiryDate: "Dec 31, 2026, 11:59 PM",
    usage: "Unused",
  },
  {
    id: "10",
    subscriptionCode: "TENANT-OFFER-100",
    business: "Bbb",
    amountOff: 27,
    status: "Active",
    expiryDate: "Dec 31, 2026, 11:59 PM",
    usage: "Unused",
  },
  {
    id: "11",
    subscriptionCode: "WELCOME-50",
    business: "Grand Feast Cafe",
    amountOff: 50,
    status: "Active",
    expiryDate: "Jan 1, 2028, 12:00 AM",
    usage: "Used",
  },
  {
    id: "12",
    subscriptionCode: "SPECIAL-OFFER",
    business: "Bistro Deluxe",
    amountOff: 15,
    status: "Expired",
    expiryDate: "Mar 10, 2024, 05:45 PM",
    usage: "Used",
  },
  {
    id: "13",
    subscriptionCode: "PROMO-PLUS",
    business: "Sushi World",
    amountOff: 35,
    status: "Active",
    expiryDate: "Aug 19, 2029, 09:15 PM",
    usage: "Unused",
  },
];

const SubscriptionTable = () => {
  const [vouchers] = useState<SubscriptionVoucher[]>(INITIAL_VOUCHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filter vouchers based on search term
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(
      (v) =>
        v.subscriptionCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        v.business.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [vouchers, searchTerm]);

  // Pagination calculation
  const totalResults = filteredVouchers.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedVouchers = filteredVouchers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="w-full mt-8 sm:mt-10 space-y-4 sm:space-y-5">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          All Subscription Vouchers
        </h2>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or business"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-60 md:w-72 pl-10 pr-4 py-2 bg-[#131b2e] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition"
            />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#131b2e] hover:bg-[#1a243d] text-slate-300 hover:text-white border border-[#1F2E4D] rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer shadow-sm shrink-0"
          >
            <RotateCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin text-white" : "text-slate-400"}`}
            />
            <span className="hidden xs:inline sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full overflow-x-auto bg-[#131b2e] rounded-xl border border-[#1F2E4D] shadow-sm [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#101726] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#1F2E4D] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#2b416e]">
            <table className="min-w-[800px] w-full text-sm text-slate-300">
              <thead className="border-b border-[#1F2E4D] bg-[#1a243d]">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold whitespace-nowrap">
                    Subscription Code
                  </th>
                  <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold whitespace-nowrap">
                    Business
                  </th>
                  <th className="px-6 py-4 text-center text-slate-300 text-base font-semibold whitespace-nowrap">
                    Amount Off
                  </th>
                  <th className="px-6 py-4 text-center text-slate-300 text-base font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold whitespace-nowrap">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-center text-slate-300 text-base font-semibold whitespace-nowrap">
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
                      {/* Subscription Code */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white whitespace-nowrap">
                          {voucher.subscriptionCode}
                        </div>
                      </td>

                      {/* Business */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-slate-300 font-medium">
                          {voucher.business}
                        </span>
                      </td>

                      {/* Amount Off */}
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-[#051329] border border-[#1F2E4D] text-xs font-bold text-white tracking-wider shadow-inner">
                          {voucher.amountOff}% OFF
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${voucher.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700/60"
                            }`}
                        >
                          {voucher.status}
                        </span>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-6 py-5 text-slate-400 whitespace-nowrap">
                        {voucher.expiryDate}
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${voucher.usage === "Used"
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
            {/* Rows Per Page */}
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
                  <option value={5} className="bg-[#131b2e] text-white">
                    5
                  </option>
                  <option value={10} className="bg-[#131b2e] text-white">
                    10
                  </option>
                  <option value={20} className="bg-[#131b2e] text-white">
                    20
                  </option>
                  <option value={50} className="bg-[#131b2e] text-white">
                    50
                  </option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {totalResults === 0 ? (
                "Showing 0 results"
              ) : (
                <>
                  Showing{" "}
                  <span className="text-white font-semibold">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-white font-semibold">
                    {Math.min(startIndex + rowsPerPage, totalResults)}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-semibold">{totalResults}</span>{" "}
                  results
                </>
              )}
            </div>

            {/* Previous & Next Buttons */}
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
    </div>
  );
};

export default SubscriptionTable;
