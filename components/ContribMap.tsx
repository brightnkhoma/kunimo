'use client';

import { useEffect, useRef } from 'react';

interface ContribMapProps {
  onCoordinates: (lat: number, lng: number) => void;
}

export default function ContribMap({ onCoordinates }: ContribMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const pinRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet only on client
    import('leaflet').then(L => {
      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: [-12.9, 34.3],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;

        // Remove previous pin
        if (pinRef.current) {
          map.removeLayer(pinRef.current);
        }

        const pin = L.circleMarker([lat, lng], {
          radius: 8,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 1,
          weight: 2,
        }).addTo(map);

        pinRef.current = pin;
        onCoordinates(lat, lng);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onCoordinates]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', minHeight: '240px' }}
      />
    </>
  );
}
