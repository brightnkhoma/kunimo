"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { LocationMarker } from "../components/marker";
import { useMarkers } from "../lib/hooks/useMarkers";
import { Fly } from "../fly/fly";
import { Center } from "../fly/center";

interface BaseMapProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
  className?: string;
  tileLayers?: Array<{
    url: string;
    attribution?: string;
    name: string;
    checked?: boolean;
  }>;
  customControls?: ReactNode;
  onMapReady?: (map: LeafletMap) => void;
}

export const BaseMap = ({ 
  children,
  center = [0, 0],
  zoom = 2,
  className = "",
  tileLayers = [
    {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: "OpenStreetMap",
      checked: true,
    }
  ],
  customControls,
  onMapReady,
}: BaseMapProps) => {
  const {} = useApp();
  const [map, setMap] = useState<LeafletMap | null>(null);
  const markers = useMarkers();

  const handleMapReady = () => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  };

  return (
    <div className={`relative w-full h-full z-10 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={setMap}
        whenReady={handleMapReady}
      >
        {markers}
        <Fly/>
        <Center/>
        <LayersControl position="topright">
          {tileLayers.map((layer, index) => (
            <LayersControl.BaseLayer 
              key={index} 
              name={layer.name} 
              checked={layer.checked}
            >
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
        
        {children}
        {customControls}
      </MapContainer>
    </div>
  );
};

export default BaseMap;