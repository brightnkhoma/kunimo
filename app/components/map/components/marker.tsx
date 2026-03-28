"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Report } from "@/app/lib/types/report";
import ReportCard from "./ui/reportMarker";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
);

const getColoredPin = (status: string) => {
  const colors = {
    pending: "#f59e0b",
    approved: "#10b981",
    denied: "#ef4444",
    archived: "#6b7280"
  };

  const color = colors[status as keyof typeof colors] || colors.pending;

  return L.divIcon({
    html: `
      <div style="position: relative;">
        <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png" style="filter: hue-rotate(0deg); opacity: 0.9;" />
        <div style="
          position: absolute;
          bottom: 20px;
          left: 8px;
          width: 10px;
          height: 10px;
          background-color: ${color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 1px ${color};
        "></div>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -34],
    className: `marker-${status}`
  });
};

const getStandardMarker = (status: string) => {
  const colors = {
    pending: "#f59e0b",
    approved: "#10b981",
    denied: "#ef4444",
    archived: "#6b7280"
  };

  const color = colors[status as keyof typeof colors] || colors.pending;

  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          width: 25px;
          height: 41px;
          background: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png') no-repeat;
          background-size: contain;
          position: relative;
        ">
          <div style="
            position: absolute;
            bottom: 4px;
            left: 7px;
            width: 8px;
            height: 8px;
            background-color: ${color};
            border-radius: 50%;
            border: 1px solid white;
          "></div>
        </div>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -34],
    className: `marker-${status}`
  });
};

const getDefaultMarker = () => {
  return L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41]
  });
};

const popupStyles = `
  .custom-popup .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .custom-popup .leaflet-popup-content {
    margin: 0;
  }
  .custom-popup .leaflet-popup-tip {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

export function LocationMarker({ 
  r, 
  variant = "default" 
}: { 
  r: Report; 
  variant?: "default" | "colored" | "standard" 
}) {
  const position: [number, number] = [
    r.coordinates.lat,
    r.coordinates.long
  ];

  const getIcon = () => {
    switch (variant) {
      case "colored":
        return getColoredPin(r.status);
      case "standard":
        return getStandardMarker(r.status);
      default:
        return getDefaultMarker();
    }
  };

  return (
    <Marker position={position} icon={getIcon()}>
      <Popup className="custom-popup">
        <style>{popupStyles}</style>
        <ReportCard {...r} />
      </Popup>
    </Marker>
  );
}

export const ClusterMarker = ({ 
  count, 
  position, 
  onClick 
}: { 
  count: number; 
  position: [number, number];
  onClick?: () => void;
}) => {
  const getClusterSize = () => {
    if (count >= 100) return "w-8 h-8 text-sm";
    if (count >= 50) return "w-7 h-7 text-xs";
    if (count >= 10) return "w-6 h-6 text-xs";
    return "w-5 h-5 text-[10px]";
  };

  const getClusterColor = () => {
    if (count >= 100) return "bg-red-600";
    if (count >= 50) return "bg-orange-500";
    if (count >= 10) return "bg-amber-500";
    return "bg-blue-500";
  };

  const icon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <div class="absolute inset-0 rounded-full bg-white opacity-50 animate-ping"></div>
        <div class="relative ${getClusterSize()} ${getClusterColor()} rounded-full flex items-center justify-center text-white font-medium shadow-lg border-2 border-white">
          ${count}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "cluster-marker"
  });

  return (
    <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup className="custom-popup">
        <style>{popupStyles}</style>
        <div className="p-3 text-center">
          <p className="text-sm font-medium">{count} reports in this area</p>
          <button 
            onClick={onClick}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            View all →
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export const AppPopup = ({
  children,
  position
}: {
  children: ReactNode;
  position: [number, number];
}) => {
  const defaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -34],
    shadowSize: [41, 41]
  });

  return (
    <Marker position={position} icon={defaultIcon}>
      <Popup
      
      className="custom-popup">
        <style>{popupStyles}</style>
        {children}
      </Popup>
    </Marker>
  );
};