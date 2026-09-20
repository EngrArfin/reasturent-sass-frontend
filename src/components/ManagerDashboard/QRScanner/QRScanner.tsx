// src/components/ManagerDashboard/QRScanner/QRScanner.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  Barcode,
  Search,
  Loader2,
  VideoOff,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Boxes,
  CameraOff,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  useLazyScanProductQueryQuery,
  useGetProductsQuery,
  useAdjustProductStockMutation,
} from "@/redux/features/manager/InventoryManagement/InventoryManagementApi";
import { IProduct } from "@/redux/features/manager/InventoryManagement/InventoryManagementType";

const QR_CONTAINER_ID = "qr-reader-box";
const QR_FILE_HELPER_ID = "qr-file-helper-box";

const QRScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [scannedProduct, setScannedProduct] = useState<IProduct | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");

  // Stock adjustment modal state
  const [isAdjustingStockModal, setIsAdjustingStockModal] = useState<boolean>(false);
  const [stockQuantity, setStockQuantity] = useState<number | string>(0);
  const [stockAdjustmentType, setStockAdjustmentType] = useState<"SET" | "ADD" | "SUBTRACT">("SET");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastScanTimestampRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // RTK Query hooks
  const [triggerScan, { isFetching: isScanningApi }] = useLazyScanProductQueryQuery();
  const { data: catalogData } = useGetProductsQuery({ page: 1, limit: 100 });
  const [adjustStock, { isLoading: isAdjustingStock }] = useAdjustProductStockMutation();

  // Play audio beep on successful barcode scan
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio autoplay blocked or not supported
    }
  }, [soundEnabled]);

  // Lookup scanned barcode in backend
  const handleLookupCode = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;

      const now = Date.now();
      // Debounce duplicate scans within 2.5 seconds
      if (trimmed === lastScannedCode && now - lastScanTimestampRef.current < 2500) {
        return;
      }
      lastScanTimestampRef.current = now;
      setLastScannedCode(trimmed);

      playBeep();

      try {
        const res = await triggerScan({ code: trimmed }).unwrap();
        if (res?.product) {
          setScannedProduct(res.product);
          toast.success(`Verified: ${res.product.name}`);
          return;
        }
      } catch {
        // Fallback local lookup in pre-fetched products catalog
        const found = catalogData?.items?.find(
          (p) =>
            p.barcode.toLowerCase() === trimmed.toLowerCase() ||
            p.sku?.toLowerCase() === trimmed.toLowerCase() ||
            p.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (found) {
          setScannedProduct(found);
          toast.success(`Found: ${found.name}`);
        } else {
          toast.error(`No product found for code "${trimmed}"`);
        }
      }
    },
    [lastScannedCode, playBeep, triggerScan, catalogData]
  );

  // Stop camera stream safely
  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Camera stop error:", err);
      }
      scannerRef.current = null;
    }
    if (isMountedRef.current) {
      setIsCameraActive(false);
      setIsStartingCamera(false);
    }
  }, []);

  // Start camera stream safely
  const startCamera = useCallback(
    async (deviceId?: string) => {
      if (isStartingCamera) return;
      setIsStartingCamera(true);
      setCameraError(null);

      // Stop previous instance if any
      await stopCamera();

      try {
        const element = document.getElementById(QR_CONTAINER_ID);
        if (!element) {
          setIsStartingCamera(false);
          return;
        }

        const scanner = new Html5Qrcode(QR_CONTAINER_ID, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.ITF,
          ],
          verbose: false,
        });
        scannerRef.current = scanner;

        // Query available camera devices
        try {
          const availableDevices = await Html5Qrcode.getCameras();
          if (availableDevices && availableDevices.length > 0) {
            setCameras(availableDevices);
            if (!deviceId && !selectedCameraId) {
              const backCam = availableDevices.find((d) =>
                d.label.toLowerCase().includes("back") ||
                d.label.toLowerCase().includes("rear") ||
                d.label.toLowerCase().includes("environment")
              );
              deviceId = backCam ? backCam.id : availableDevices[0].id;
              setSelectedCameraId(deviceId);
            }
          }
        } catch {
          // Device enumeration fallback
        }

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.max(180, Math.floor(minEdge * 0.7));
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0,
        };

        const cameraChoice = deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" };

        await scanner.start(
          cameraChoice,
          config,
          (decodedText) => {
            handleLookupCode(decodedText);
          },
          () => {
            // Frame search failure - normal while scanning
          }
        );

        if (isMountedRef.current) {
          setIsCameraActive(true);
          setIsStartingCamera(false);
        }
      } catch (err: any) {
        console.error("Camera startup error:", err);
        if (isMountedRef.current) {
          setIsCameraActive(false);
          setIsStartingCamera(false);
          setCameraError(
            err?.message ||
            "Camera permission denied or camera not accessible. Please allow camera access in browser settings."
          );
        }
      }
    },
    [handleLookupCode, isStartingCamera, selectedCameraId, stopCamera]
  );

  // Toggle Camera active/paused
  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera(selectedCameraId);
    }
  };

  // Change active camera device
  const handleCameraChange = (newCamId: string) => {
    setSelectedCameraId(newCamId);
    if (isCameraActive) {
      startCamera(newCamId);
    }
  };

  // Upload and scan image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info(`Scanning image "${file.name}"...`);

    try {
      const tempScanner = new Html5Qrcode(QR_FILE_HELPER_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ],
        verbose: false,
      });

      const decodedText = await tempScanner.scanFile(file, true);
      await tempScanner.clear();

      if (decodedText) {
        toast.success(`Barcode detected: ${decodedText}`);
        handleLookupCode(decodedText);
      }
    } catch (err: any) {
      toast.error(
        "Could not detect a clear barcode or QR code in this image. Please ensure the code is clear and sharp."
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Manual code search
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error("Please enter a barcode or SKU");
      return;
    }
    handleLookupCode(manualCode);
  };

  // Quick stock adjustment submit
  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedProduct) return;

    const qty = Number(stockQuantity);
    if (isNaN(qty) || qty < 0) {
      toast.error("Please enter a valid stock number");
      return;
    }

    try {
      const res = await adjustStock({
        id: scannedProduct.id,
        body: {
          quantity: qty,
          type: stockAdjustmentType,
          notes: "Updated from QR Scanner",
        },
      }).unwrap();

      setScannedProduct(res);
      setIsAdjustingStockModal(false);
      toast.success(`Stock updated: ${res.name} (${res.stock} units)`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update stock");
    }
  };

  // Lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    startCamera();
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Hidden container for file scanning helper */}
      <div id={QR_FILE_HELPER_ID} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Barcode className="w-6 h-6 text-orange-500" />
            <span>Barcode & QR Scanner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time physical barcode & QR code camera lookup for instant pricing and inventory verification
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute scan beep" : "Enable scan beep"}
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${soundEnabled
                ? "bg-orange-600/10 border-orange-500/30 text-orange-400 hover:bg-orange-600/20"
                : "bg-[#1a243d] border-[#1F2E4D] text-slate-400 hover:text-white"
              }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {cameras.length > 1 && (
            <select
              value={selectedCameraId}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="bg-[#1a243d] border border-[#1F2E4D] text-xs text-slate-200 rounded-full px-3.5 py-2 outline-none cursor-pointer"
            >
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || `Camera ${cam.id.slice(0, 8)}`}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Camera Scanner Viewport */}
        <div className="lg:col-span-7 bg-[#131b2e] rounded-3xl p-5 sm:p-7 border border-[#1F2E4D] shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[500px]">
          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-2 p-1 bg-[#0b1220] rounded-full border border-[#1F2E4D] text-xs font-semibold text-slate-400 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("camera");
                startCamera(selectedCameraId);
              }}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${activeTab === "camera"
                  ? "bg-orange-600 text-white shadow-md"
                  : "hover:text-white"
                }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                stopCamera();
                fileInputRef.current?.click();
              }}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${activeTab === "upload"
                  ? "bg-orange-600 text-white shadow-md"
                  : "hover:text-white"
                }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Scanner Container Box */}
          <div className="relative w-full max-w-md aspect-square rounded-3xl bg-[#0b1220] border border-[#1F2E4D] overflow-hidden flex flex-col items-center justify-center shadow-inner my-2">
            {/* HTML5 QR Code Mount Element - Must ALWAYS remain in DOM for Html5Qrcode to attach video */}
            <div
              id={QR_CONTAINER_ID}
              className="w-full h-full overflow-hidden [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden"
            />

            {/* Inactive or Error State Overlay */}
            {!isCameraActive && (
              <div className="absolute inset-0 bg-[#0b1220] flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                {isStartingCamera ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                    <h4 className="text-sm font-semibold text-white">Opening Camera...</h4>
                    <p className="text-xs text-slate-400">Please allow camera permissions if prompted by your browser</p>
                  </>
                ) : cameraError ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <CameraOff className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Camera Access Error</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">{cameraError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startCamera(selectedCameraId)}
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-full cursor-pointer transition shadow"
                    >
                      Allow Permissions & Retry
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Camera is Paused</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Click Start Camera to begin scanning barcodes in real-time
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startCamera(selectedCameraId)}
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-full cursor-pointer transition shadow flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Overlay Viewfinder Target Framing when active */}
            {isCameraActive && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
                <div className="w-56 h-44 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />

                  {/* Pulsing Laser Bar */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_#f97316] animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleCamera}
              className={`px-5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm ${isCameraActive
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
            >
              {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              <span>{isCameraActive ? "Pause Camera" : "Resume Camera"}</span>
            </button>

            {isCameraActive && (
              <button
                type="button"
                onClick={() => startCamera(selectedCameraId)}
                title="Restart Camera"
                className="p-2 rounded-full bg-[#1a243d] hover:bg-[#232f4c] border border-[#1F2E4D] text-slate-300 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3 max-w-md">
            Align barcode or QR code inside the box. Supports UPC, EAN-13, Code 128, Code 39, QR Code.
          </p>
        </div>

        {/* Right: Manual Lookup & Result Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Manual Search */}
          <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-[#1F2E4D] shadow-sm space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-400" />
              <span>Manual Code Search</span>
            </h4>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter barcode e.g. RENE-1001"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
              />
              <button
                type="submit"
                disabled={isScanningApi}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isScanningApi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Scanned Result Card */}
          {scannedProduct ? (
            <div className="bg-[#131b2e] rounded-3xl p-5 sm:p-6 border border-emerald-500/40 shadow-lg animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Item Verified</span>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${scannedProduct.stock <= 0
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : scannedProduct.stock <= 5
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                >
                  {scannedProduct.stockStatus ||
                    (scannedProduct.stock <= 0
                      ? "Out of Stock"
                      : scannedProduct.stock <= 5
                        ? "Low Stock"
                        : "In Stock")}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 bg-[#0b1220] rounded-2xl border border-[#1F2E4D] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{scannedProduct.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Barcode: <span className="text-white font-semibold">{scannedProduct.barcode}</span>
                    </p>
                    {scannedProduct.sku && (
                      <p className="text-xs font-mono text-slate-400">
                        SKU: <span className="text-slate-300">{scannedProduct.sku}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-orange-400">
                      {scannedProduct.formattedPrice ||
                        `$${Number(scannedProduct.price || 0).toFixed(2)}`}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 mt-0.5">
                      Stock: <span className="text-white font-bold">{scannedProduct.stock}</span> units
                    </div>
                  </div>
                </div>

                {scannedProduct.business && (
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-[#1F2E4D]/60">
                    Business: {scannedProduct.business.businessName || scannedProduct.business.name}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStockQuantity(scannedProduct.stock);
                    setStockAdjustmentType("SET");
                    setIsAdjustingStockModal(true);
                  }}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Adjust Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScannedProduct(null)}
                  className="px-4 py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-sm flex flex-col items-center justify-center text-center space-y-2 py-10">
              <Boxes className="w-10 h-10 text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-300">No Item Scanned Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Hold a product barcode or QR code in front of the camera or upload an image to view details.
              </p>
            </div>
          )}

          {/* Quick Info Card */}
          <div className="bg-[#131b2e] rounded-3xl p-5 border border-[#1F2E4D] shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Continuous Live Scanning</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Scan multiple items continuously. Audio beep confirms successful detection and fetches live stock from your inventory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stock Adjustment Modal */}
      {isAdjustingStockModal && scannedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2E4D]">
              <div>
                <h3 className="text-base font-bold text-white">Quick Stock Update</h3>
                <p className="text-xs text-slate-400">{scannedProduct.name} ({scannedProduct.barcode})</p>
              </div>
              <button
                onClick={() => setIsAdjustingStockModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#0b1220] rounded-xl border border-[#1F2E4D]">
                {(
                  [
                    { label: "Set Exact", value: "SET" },
                    { label: "+ Restock", value: "ADD" },
                    { label: "- Deduct", value: "SUBTRACT" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setStockAdjustmentType(t.value)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${stockAdjustmentType === t.value
                        ? "bg-orange-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {stockAdjustmentType === "SET"
                    ? "New Total Quantity"
                    : stockAdjustmentType === "ADD"
                      ? "Quantity to Add"
                      : "Quantity to Deduct"}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1220] border border-[#1F2E4D] text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={() => setIsAdjustingStockModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a243d] rounded-xl border border-[#1F2E4D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjustingStock}
                  className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAdjustingStock && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
