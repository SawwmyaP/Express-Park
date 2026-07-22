"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { srmCampusGeoJSON } from "@/data/srm-campus";

// Custom icon for the map marker to look premium
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png", // Will use a default or custom later
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface CampusMapProps {
  route?: [number, number][];
}

export function CampusMap({ route }: CampusMapProps) {
  const [mounted, setMounted] = useState(false);
  // SRM KTR Coordinates roughly: 12.8236° N, 80.0435° E
  const srmCoords: [number, number] = [12.8236, 80.0435];

  useEffect(() => {
    setMounted(true);
    // Fix leaflet marker issues in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center">
        <div className="animate-pulse w-32 h-32 rounded-full bg-surface/50" />
      </div>
    );
  }

  // Custom styling for GeoJSON features
  const geoJSONStyle = (feature: any) => {
    if (feature.properties.type === "parking") {
      return {
        color: "#34d399", // Emerald 400
        weight: 1,
        fillColor: "#059669", // Emerald 600
        fillOpacity: 0.2,
        dashArray: "4 4"
      };
    }
    return {
      color: "#9ca3af",
      weight: 1,
      fillOpacity: 0.1
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 z-0"
    >
      <MapContainer 
        center={srmCoords} 
        zoom={16} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        {/* We use a minimal/dark carto tile layer for the charcoal aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        
        {/* Render SRM Campus Data */}
        <GeoJSON 
          data={srmCampusGeoJSON} 
          style={geoJSONStyle}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`<span class="font-medium">${feature.properties.name}</span>`);
            }
          }}
        />

        {/* Dynamic Route Line if provided */}
        {route && route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#34d399" 
            weight={4} 
            dashArray="10, 10" 
            className="animate-pulse"
          />
        )}

      </MapContainer>
      
      {/* Soft gradient overlay so map edges blend into UI */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/50 z-10" />
    </motion.div>
  );
}
