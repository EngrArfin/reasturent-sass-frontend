import { useState } from "react";
import { PlusCircle, RefreshCw, Printer, Trash2 } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { toast } from "sonner";
import NewInventory, { InventoryItem } from "./NewInventory";

const initialInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Water Bottle",
    barcode: "RENE-1001",
    stock: 50,
    price: 1.5,
  },
  {
    id: "2",
    name: "Farm Chicken",
    barcode: "RENE-1002",
    stock: 5,
    price: 12.5,
  },
  {
    id: "3",
    name: "Whole Milk",
    barcode: "RENE-1003",
    stock: 5,
    price: 3.5,
  },
  {
    id: "4",
    name: "Fresh Eggs",
    barcode: "RENE-1004",
    stock: 15,
    price: 4.5,
  },
  {
    id: "5",
    name: "Bread Loaf",
    barcode: "RENE-1005",
    stock: 30,
    price: 2.5,
  },
  {
    id: "6",
    name: "Folder 6",
    barcode: "RENE-1006",
    stock: 2,
    price: 2.2,
  },
];

const InventoryTable = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddProduct = (newProduct: Omit<InventoryItem, "id">) => {
    const item: InventoryItem = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setInventory([item, ...inventory]);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    toast.success(`Removed product "${name}" from inventory`);
  };

  const handlePrintBarcode = (item: InventoryItem) => {
    toast.info(`Printing label for ${item.name} (${item.barcode})`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Inventory refreshed");
    }, 500);
  };

  // Filter and paginate
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const limit = 10;
  const total = filteredInventory.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedInventory = filteredInventory.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="w-full space-y-6">
      {/* Top Header / Add Product Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Inventory Management
        </h1>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? "Hide Form" : "Add Product"}</span>
        </button>
      </div>

      {/* New Product Details Form */}
      {showAddForm && (
        <NewInventory
          onAddProduct={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Inventory Table Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300">
        {/* Search Row & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by product or barcode..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-3 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#052350] bg-[#1a243d] border border-[#1F2E4D] text-white placeholder-slate-400 text-sm"
              />
              <CiSearch
                onClick={handleSearch}
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Inventory"
              className="w-11 h-11 rounded-full bg-[#1a243d] hover:bg-[#232f4c] border border-[#1F2E4D] text-white flex items-center justify-center cursor-pointer shadow-sm flex-shrink-0 transition-all active:scale-95"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-300 ${
                  isRefreshing ? "animate-spin text-white" : ""
                }`}
              />
            </button>
          </div>

          <div className="text-sm text-slate-400">
            Total Products:{" "}
            <span className="font-semibold text-white">{total}</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="grid grid-cols-1 gap-5">
          <div className="w-full">
            <div className="w-full overflow-x-auto bg-[#131b2e] rounded-xl border border-[#1F2E4D]">
              <table className="min-w-[800px] w-full text-sm text-slate-300">
                <thead className="border-b border-[#1F2E4D] bg-[#1a243d]">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Barcode / SKU
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap text-slate-300 text-base font-semibold">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap text-slate-300 text-base font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedInventory.map((item) => {
                    const isLowStock = item.stock <= 5;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="whitespace-nowrap font-semibold text-white">
                            {item.name}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="whitespace-nowrap capitalize px-2.5 py-1 bg-[#1a243d] rounded-full text-xs font-mono text-slate-300 border border-[#1F2E4D]">
                            {item.barcode}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                              isLowStock
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {item.stock} In stock
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="whitespace-nowrap font-semibold text-white">
                            ${item.price.toFixed(2)}
                          </span>
                        </td>

                        <td
                          className="px-6 py-5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePrintBarcode(item)}
                              title="Print Label"
                              className="p-2 text-sm font-medium text-slate-300 bg-[#1a243d] hover:bg-[#232f4c] hover:text-white rounded-lg cursor-pointer transition duration-200 border border-[#1F2E4D]"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteProduct(item.id, item.name)
                              }
                              title="Delete Product"
                              className="p-2 text-sm font-medium text-rose-400 bg-[#1a243d] hover:bg-rose-500/20 rounded-lg cursor-pointer transition duration-200 border border-[#1F2E4D]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedInventory.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <p>No products found</p>
                          {searchTerm && (
                            <button
                              onClick={() => {
                                setSearchInput("");
                                setSearchTerm("");
                              }}
                              className="text-[#10B981] underline cursor-pointer"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="mt-6 flex items-center justify-between px-2 sm:px-4 py-3 flex-wrap gap-3">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-medium text-white">
                {paginatedInventory.length}
              </span>{" "}
              of <span className="font-medium text-white">{total}</span> products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="min-w-[50px] rounded-md border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-center text-sm font-medium text-white shadow-sm">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
