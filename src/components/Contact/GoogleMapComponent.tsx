// components/SimpleMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix default marker icon issue in some setups:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function GoogleMapComponent() {
  const position: [number, number] = [23.8071, 90.3686]; // Mirpur-10, Dhaka

  return (
    <div className="w-full bg-[#07090D] py-12 px-4 md:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Find Us on the Map</h3>
              <p className="text-xs text-slate-400">Mirpur-10, Dhaka-1260, Bangladesh</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 w-fit">
            Open Monday – Friday: 9:00 AM – 8:00 PM
          </span>
        </div>

        <div className="w-full h-[400px] md:h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="p-1 text-slate-800 text-xs">
                  <strong className="text-sm font-bold text-orange-600 block mb-1">RestoSync HQ</strong>
                  Mirpur-10, Dhaka-1260, Bangladesh
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

