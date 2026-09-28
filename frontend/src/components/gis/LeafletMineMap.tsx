"use client";

import React, { useEffect, useRef, useState } from "react";
import { GISHotspot } from "../../types";
import { CoalMine, CoalCompany, getMineCoordinates } from "../../data/coalCompanies";
import {
  Layers,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Compass,
  Maximize2,
  Minimize2,
  Key,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Wind,
} from "lucide-react";

interface LeafletMineMapProps {
  mine: CoalMine | undefined | null;
  company: CoalCompany;
  isAllMines: boolean;
  hotspots: GISHotspot[];
  activeHotspot: GISHotspot | null;
  onSelectHotspot: (h: GISHotspot) => void;
  onNavigateToCapa: (capaId: string) => void;
  weatherData?: any;
}

export const LeafletMineMap: React.FC<LeafletMineMapProps> = ({
  mine,
  company,
  isAllMines,
  hotspots,
  activeHotspot,
  onSelectHotspot,
  onNavigateToCapa,
  weatherData,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const vectorLayerRef = useRef<any>(null);

  const [activeTileProvider, setActiveTileProvider] = useState<"osm" | "satellite" | "topo" | "mapbox">("satellite");
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [showBlastingBuffer, setShowBlastingBuffer] = useState<boolean>(true);
  const [showLeaseBoundary, setShowLeaseBoundary] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Target coordinates safely retrieved from master coalfield GPS coordinates dictionary
  const coords = getMineCoordinates(isAllMines ? "ALL_MINES" : mine?.id);
  const targetLat = typeof coords?.lat === "number" ? coords.lat : 22.348;
  const targetLng = typeof coords?.lng === "number" ? coords.lng : 82.592;
  const targetZoom = isAllMines ? 6 : 14;

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to ensure SSR safety
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists to avoid "Map container is already initialized"
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      try {
        // Initialize map instance
        const map = L.map(mapContainerRef.current, {
          center: [targetLat, targetLng],
          zoom: targetZoom,
          zoomControl: false,
          attributionControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
        vectorLayerRef.current = L.layerGroup().addTo(map);

        // Apply initial tile layer
        updateTileLayer(activeTileProvider, map, L);

        // Render vector overlays & markers
        renderVectorOverlays(map, L);
        renderHotspotMarkers(map, L);
      } catch (err) {
        console.warn("Leaflet map initialization notice:", err);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Update map view when active mine changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (!mapInstanceRef.current) return;
      try {
        mapInstanceRef.current.flyTo([targetLat, targetLng], targetZoom, {
          duration: 1.2,
        });

        renderVectorOverlays(mapInstanceRef.current, L);
        renderHotspotMarkers(mapInstanceRef.current, L);
      } catch (err) {
        console.warn("Leaflet flyTo notice:", err);
      }
    });
  }, [mine?.id, isAllMines, targetLat, targetLng, targetZoom]);

  // Update tile layer helper
  const updateTileLayer = (provider: "osm" | "satellite" | "topo" | "mapbox", map: any, L: any) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = "";
    let options: any = { maxZoom: 19 };

    if (provider === "satellite") {
      // Esri World Imagery (High-Res Opencast Satellite)
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      options = { maxZoom: 18, attribution: "Esri Satellite Imagery" };
    } else if (provider === "topo") {
      // OpenTopoMap (Elevation contours & pit topography)
      url = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      options = { maxZoom: 17, attribution: "OpenTopoMap" };
    } else if (provider === "mapbox" && mapboxToken) {
      // Mapbox Satellite-Streets
      url = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
      options = { maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: "© Mapbox" };
    } else {
      // OpenStreetMap Standard
      url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      options = { maxZoom: 19, attribution: "© OpenStreetMap contributors" };
    }

    const tileLayer = L.tileLayer(url, options);
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
  };

  const handleTileProviderChange = (provider: "osm" | "satellite" | "topo" | "mapbox") => {
    setActiveTileProvider(provider);
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      updateTileLayer(provider, mapInstanceRef.current, L);
    });
  };

  // Render Vector Overlays (Lease Boundary & 500m Blasting Safety Zone)
  const renderVectorOverlays = (map: any, L: any) => {
    if (!vectorLayerRef.current) return;
    vectorLayerRef.current.clearLayers();

    if (isAllMines) return;

    // 1. DGMS Statutory Lease Boundary Polygon around pit
    if (showLeaseBoundary) {
      const deltaLat = 0.012;
      const deltaLng = 0.016;
      const leasePolygonCoords = [
        [targetLat + deltaLat * 0.9, targetLng - deltaLng * 0.9],
        [targetLat + deltaLat * 1.1, targetLng + deltaLng * 0.8],
        [targetLat - deltaLat * 0.8, targetLng + deltaLng * 1.2],
        [targetLat - deltaLat * 1.1, targetLng - deltaLng * 0.7],
      ];

      L.polygon(leasePolygonCoords, {
        color: "#F26914",
        weight: 2,
        dashArray: "6, 6",
        fillColor: "#10264C",
        fillOpacity: 0.12,
      })
        .bindTooltip(`DGMS Lease Perimeter: ${mine?.name || "Mining Block"}`, { permanent: false })
        .addTo(vectorLayerRef.current);
    }

    // 2. Statutory Blasting Danger Exclusion Zone (500m Buffer Circle under CMR 2017 Reg 164)
    if (showBlastingBuffer) {
      L.circle([targetLat + 0.002, targetLng - 0.003], {
        radius: 500, // 500 meters
        color: "#E83641",
        weight: 1.5,
        dashArray: "4, 4",
        fillColor: "#E83641",
        fillOpacity: 0.08,
      })
        .bindTooltip("CMR 2017 Reg 164: 500m Blasting Danger Exclusion Zone", { permanent: false })
        .addTo(vectorLayerRef.current);
    }
  };

  // Render Hotspot Pins with Telemetry Popups
  const renderHotspotMarkers = (map: any, L: any) => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    hotspots.forEach((h, index) => {
      // Position offset relative to center coordinates
      const latOffset = (h.y_percent - 50) * 0.00035;
      const lngOffset = (h.x_percent - 50) * 0.00045;
      const spotLat = targetLat + latOffset;
      const spotLng = targetLng + lngOffset;

      const markerColor =
        h.risk === "CRITICAL"
          ? "#E83641"
          : h.risk === "HIGH"
          ? "#F26914"
          : h.risk === "MODERATE"
          ? "#F59E0B"
          : "#10B981";

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${
            h.risk === "CRITICAL"
              ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75" style="background-color: ${markerColor}"></span>`
              : ""
          }
          <div class="relative w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-[11px] shadow-lg border-2 border-white" style="background-color: ${markerColor}">
            ${h.risk === "CRITICAL" ? "!" : index + 1}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([spotLat, spotLng], { icon: customIcon });

      // Click handler
      marker.on("click", () => {
        onSelectHotspot(h);
      });

      // Rich popup content
      const popupHtml = `
        <div style="font-family: inherit; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #10264C; font-size: 13px;">${h.name}</strong>
            <span style="background: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}40; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">
              ${h.risk}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            ${h.details}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; font-family: monospace; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 6px; border: 1px solid #E2E8F0;">
            <div>ELEV: <strong>${h.elevation}</strong></div>
            <div>FLEET: <strong>${h.fleet_count}</strong></div>
            <div>STATUS: <strong>${h.status}</strong></div>
            <div>SENSOR: <strong>${h.sensor_telemetry}</strong></div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; color: #1869BE; font-weight: bold; text-decoration: underline; cursor: pointer;">
              Review Linked ${h.associated_capa}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(markersLayerRef.current);
    });
  };

  return (
    <div className={`relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-card flex flex-col ${isFullscreen ? "fixed inset-4 z-50 min-h-[90vh]" : "min-h-[560px]"}`}>
      {/* Top GIS HUD Control Bar */}
      <div className="z-10 bg-[#09152B]/95 backdrop-blur-md px-4 py-2 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-white text-xs select-none">
        
        {/* Left: Active Mine GPS Grid Readout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-sky-300">
            <MapPin className="w-3.5 h-3.5 text-orange" />
            <span className="font-bold text-white uppercase">{company.code}</span>
            <span className="text-slate-500">/</span>
            <span className="text-amber-400 font-semibold">{isAllMines ? "PAN-INDIA CLUSTER" : mine?.name}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span>LAT: <strong className="text-white">{targetLat.toFixed(4)}°N</strong></span>
            <span>LON: <strong className="text-white">{targetLng.toFixed(4)}°E</strong></span>
          </div>
        </div>

        {/* Center: Tile Provider Switcher */}
        <div className="flex items-center gap-1 bg-[#050D1B] p-1 rounded-lg border border-slate-700 text-[11px]">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>Tile Layer:</span>
          </span>
          <button
            onClick={() => handleTileProviderChange("satellite")}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              activeTileProvider === "satellite"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Satellite (Esri)
          </button>
          <button
            onClick={() => handleTileProviderChange("osm")}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              activeTileProvider === "osm"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => handleTileProviderChange("topo")}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              activeTileProvider === "topo"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Topographical
          </button>
          <button
            onClick={() => {
              if (!mapboxToken) setShowTokenInput(true);
              handleTileProviderChange("mapbox");
            }}
            className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeTileProvider === "mapbox"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-300 hover:text-white"
            }`}
            title="Mapbox Satellite-Streets with Custom Token"
          >
            <span>Mapbox</span>
            {mapboxToken ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Key className="w-2.5 h-2.5 text-purple-300" />}
          </button>
        </div>

        {/* Right: Layer Toggles & Fullscreen */}
        <div className="flex items-center gap-2">
          <label className="hidden md:flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showBlastingBuffer}
              onChange={(e) => {
                setShowBlastingBuffer(e.target.checked);
                if (mapInstanceRef.current) {
                  import("leaflet").then((L) => renderVectorOverlays(mapInstanceRef.current, L));
                }
              }}
              className="rounded text-red-500 focus:ring-0 cursor-pointer"
            />
            <span>500m Blast Buffer</span>
          </label>

          <label className="hidden md:flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showLeaseBoundary}
              onChange={(e) => {
                setShowLeaseBoundary(e.target.checked);
                if (mapInstanceRef.current) {
                  import("leaflet").then((L) => renderVectorOverlays(mapInstanceRef.current, L));
                }
              }}
              className="rounded text-orange-500 focus:ring-0 cursor-pointer"
            />
            <span>DGMS Boundary</span>
          </label>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-[#0F1C36] hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen GIS Map"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mapbox Token Input Drawer (Optional) */}
      {showTokenInput && (
        <div className="z-10 bg-[#0C172C] px-4 py-2 border-b border-slate-700 flex items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2 flex-1">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-300">Mapbox Access Token:</span>
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1IjoieW91ci1hY2NvdW50IiwiYSI6InlvdXItdG9rZW4ifQ..."
              className="flex-1 max-w-md px-3 py-1 bg-[#050D1B] border border-slate-700 rounded text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={() => {
                handleTileProviderChange("mapbox");
                setShowTokenInput(false);
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold transition-colors"
            >
              Apply Mapbox
            </button>
          </div>
          <button
            onClick={() => setShowTokenInput(false)}
            className="text-slate-400 hover:text-white text-xs"
          >
            Close
          </button>
        </div>
      )}

      {/* Real-time OpenWeather Environmental Strip over Map */}
      {weatherData && (
        <div className="absolute top-14 left-4 z-10 bg-[#071124]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-floating text-white text-[11px] font-mono pointer-events-auto max-w-sm">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-700/60">
            <span className="font-bold text-sky-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>LIVE FIELD TELEMETRY</span>
            </span>
            <span className="text-[10px] text-slate-400">{weatherData.timestamp}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center my-1.5">
            <div>
              <div className="text-white font-bold">{weatherData.temp_c}°C</div>
              <div className="text-[9px] text-slate-400">Ambient</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold">{weatherData.wbgt_index_c}°C</div>
              <div className="text-[9px] text-slate-400">DGMS WBGT</div>
            </div>
            <div>
              <div className="text-sky-300 font-bold">{weatherData.wind_speed_kmh} km/h</div>
              <div className="text-[9px] text-slate-400">Wind</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-700/60 leading-tight">
            <strong>Advisory:</strong> {weatherData.heat_stress_advisory.split(":")[0]}
          </div>
        </div>
      )}

      {/* Main Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[500px] z-0" />

      {/* Bottom GIS Legend & Compass */}
      <div className="z-10 bg-[#09152B]/95 backdrop-blur-md px-4 py-2 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">GIS Layer Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span> Critical Observation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span> High Priority
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Compliant
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>Active Sensors: <strong className="text-emerald-400">42 Online</strong></span>
          <span>•</span>
          <span>DGMS Slope Radar: <strong className="text-sky-300">0.8 mm/hr (Stable)</strong></span>
        </div>
      </div>
    </div>
  );
};
