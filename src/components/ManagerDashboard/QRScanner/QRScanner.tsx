import React, { useState, useRef } from "react";
import {
  Package,
  AlertTriangle,
  RotateCw,
  Camera,
  Upload,
  CheckCircle2,
  Barcode,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface ScannedProduct {
  name: string;
  barcode: string;
  stock: number;
  price: number;
  status: "In Stock" | "Low Stock";
}

const mockInventory: ScannedProduct[] = [
  {
    name: "Water Bottle",
    barcode: "RENE-1001",
    stock: 50,
    price: 1.5,
    status: "In Stock",
  },
  {
    name: "Farm Chicken",
    barcode: "RENE-1002",
    stock: 5,
    price: 12.5,
    status: "Low Stock",
  },
  {
    name: "Whole Milk",
    barcode: "RENE-1003",
    stock: 5,
    price: 3.5,
    status: "Low Stock",
  },
  {
    name: "Fresh Eggs",
    barcode: "RENE-1004",
    stock: 15,
    price: 4.5,
    status: "In Stock",
  },
  {
    name: "Bread Loaf",
    barcode: "RENE-1005",
    stock: 30,
    price: 2.5,
    status: "In Stock",
  },
];

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(
    null
  );
  const [manualCode, setManualCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateScan = (product?: ScannedProduct) => {
    const target =
      product ||
      mockInventory[Math.floor(Math.random() * mockInventory.length)];
    setScannedProduct(target);
    toast.success(`Scanned: ${target.name} (${target.barcode})`);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const found = mockInventory.find(
      (item) =>
        item.barcode.toLowerCase() === manualCode.trim().toLowerCase() ||
        item.name.toLowerCase().includes(manualCode.trim().toLowerCase())
    );

    if (found) {
      setScannedProduct(found);
      toast.success(`Found product: ${found.name}`);
    } else {
      toast.error("No product found with this barcode / name");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`Processing image: ${file.name}...`);
      setTimeout(() => {
        handleSimulateScan();
      }, 700);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Barcode & QR Scanner
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Scanner Viewport Card */}
        <div className="lg:col-span-7 bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[480px]">
          {/* Top Options Bar */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-400 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveTab("camera");
                setIsScanning(true);
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "camera"
                  ? "text-emerald-400 font-semibold"
                  : "hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Request Camera Permissions</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "text-emerald-400 font-semibold"
                  : "hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Scan an Image File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Scanner Visual Frame Box */}
          <div
            onClick={() => handleSimulateScan()}
            title="Click to simulate scan"
            className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center rounded-3xl bg-[#0b1220] border border-[#1F2E4D] cursor-pointer group shadow-inner"
          >
            {/* 4 Corner Framing Brackets */}
            {/* Top-Left */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-slate-400 rounded-tl-xl transition-all group-hover:border-emerald-400" />
            {/* Top-Right */}
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-slate-400 rounded-tr-xl transition-all group-hover:border-emerald-400" />
            {/* Bottom-Left */}
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-slate-400 rounded-bl-xl transition-all group-hover:border-emerald-400" />
            {/* Bottom-Right */}
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-slate-400 rounded-br-xl transition-all group-hover:border-emerald-400" />

            {/* Inner Mint Box Target Area */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:bg-emerald-500/15">
              <Barcode className="w-16 h-16 text-emerald-400/50" />

              {/* Animated Laser Scanning Line */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce duration-1000" />
              )}
            </div>

            {/* Simulated click badge */}
            <div className="absolute bottom-2 text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">
              Click frame to test scan
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-2 mb-4">
            <button
              type="button"
              onClick={() => setIsScanning(!isScanning)}
              className="px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all shadow-xs"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`}
              />
              <span>{isScanning ? "Camera Active" : "Camera Paused"}</span>
            </button>
          </div>

          {/* Description Instructions */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Position any product barcode within the frame to automatically search
            your inventory.
          </p>
        </div>

        {/* Right Side: Information & Lookup Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Inventory Lookup */}
          <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-[#1F2E4D] shadow-sm flex items-start gap-4 hover:border-blue-500/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-blue-400">
                Inventory Lookup
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instantly find stock levels and pricing by scaning.
              </p>
            </div>
          </div>

          {/* Card 2: Troubleshooting */}
          <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-[#1F2E4D] shadow-sm flex items-start gap-4 hover:border-amber-500/30 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-amber-400">
                Troubleshooting
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ensure good lighting and hold the device steady.
              </p>
            </div>
          </div>

          {/* Card 3: Manual Search Form */}
          <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-[#1F2E4D] shadow-sm space-y-3">
            <h4 className="text-sm font-semibold text-white">Manual Lookup</h4>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter barcode e.g. RENE-1001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full pl-4 pr-3 py-2.5 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Scanned Result Details (When available) */}
          {scannedProduct && (
            <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-md animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Item Verified</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    scannedProduct.stock <= 5
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {scannedProduct.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-b border-[#1F2E4D]/60 py-3">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {scannedProduct.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {scannedProduct.barcode}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${scannedProduct.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Stock: {scannedProduct.stock} units
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScannedProduct(null)}
                className="w-full py-2 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Clear Result
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
