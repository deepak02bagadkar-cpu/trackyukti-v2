"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useApp } from "../../context/AppContext";
import { GISHotspot } from "../../types";
import { getMineCoordinates } from "../../data/coalCompanies";
import {
  MapPin,
  Filter,
  Layers,
  Info,
  ExternalLink,
  ShieldAlert,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Compass,
  Maximize2,
  Activity,
  Truck,
  Wind,
  CloudSun,
} from "lucide-react";

// Dynamically import Leaflet with SSR disabled to prevent window/document prerender crashes
const LeafletMineMap = dynamic(
  () => import("../gis/LeafletMineMap").then((mod) => mod.LeafletMineMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-slate-900 rounded-2xl min-h-[560px] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-300">Loading Mapbox / OSM Satellite GIS Engine...</span>
        </div>
      </div>
    ),
  }
);

export const MineMapView: React.FC = () => {
  const { hotspots, setActiveTab, hierarchy, getSelectedCompany, getSelectedMine } = useApp();
  const selectedCompany = getSelectedCompany();
  const selectedMine = getSelectedMine();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [activeHotspot, setActiveHotspot] = useState<GISHotspot | null>(hotspots[0] || null);
  const [mapMode, setMapMode] = useState<"leaflet" | "cad">("leaflet");
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const coords = getMineCoordinates(hierarchy.mineId === "ALL_MINES" ? "ALL_MINES" : selectedMine?.id);
    const lat = coords.lat;
    const lon = coords.lng;
    const mineName = hierarchy.mineId === "ALL_MINES" ? "Pan-India Cluster" : (selectedMine?.name ?? "Gevra Mega Opencast");

    fetch(`http://127.0.0.1:8000/api/weather/telemetry?lat=${lat}&lon=${lon}&mine_name=${encodeURIComponent(mineName)}`)
      .then((res) => res.json())
      .then((data) => setWeatherData(data))
      .catch(() => {});
  }, [selectedMine?.id, hierarchy.mineId]);

  const filteredHotspots = hotspots.filter((h) => {
    const matchesRisk = selectedRiskFilter === "All" || h.risk === selectedRiskFilter;
    const matchesCategory = selectedCategoryFilter === "All" || h.category === selectedCategoryFilter;
    return matchesRisk && matchesCategory;
  });

  const getMarkerColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red text-white border-white shadow-red-500/50";
      case "HIGH":
        return "bg-orange text-white border-white shadow-orange-500/50";
      case "MODERATE":
        return "bg-amber-400 text-navy border-white shadow-amber-500/50";
      default:
        return "bg-green text-white border-white shadow-green-500/50";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange" />
            <span>Interactive Mine GIS & Spatial Risk Map</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Real-time geospatial visualization of pit benches, haul ramp slope sensors, environmental stations, and contractor zones.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-mineBorder shadow-soft text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Hotspot Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red"></span> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange"></span> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green"></span> Compliant
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-3 border border-mineBorder shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">FILTER BY RISK:</span>
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="border border-mineBorder rounded-md px-2 py-1 bg-slate-50 text-mineText"
          >
            <option value="All">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="COMPLIANT">Compliant</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">FILTER BY CATEGORY:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="border border-mineBorder rounded-md px-2 py-1 bg-slate-50 text-mineText"
          >
            <option value="All">All Spatial Categories</option>
            <option value="Safety">Safety & Haulage</option>
            <option value="Geotechnical">Geotechnical & Slope</option>
            <option value="Environment">Environmental & Sump</option>
            <option value="Contractor">Contractor Activity</option>
          </select>

          <span className="text-[11px] font-mono text-slate-400 ml-2">
            Active Pins: {filteredHotspots.length}
          </span>
        </div>

        {/* Map Engine Mode Switcher (Mapbox/OSM Satellite GIS vs Schematic CAD) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setMapMode("leaflet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === "leaflet"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-orange" />
            <span>Mapbox / OSM Satellite GIS</span>
          </button>
          <button
            onClick={() => setMapMode("cad")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === "cad"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue" />
            <span>Opencast Schematic CAD</span>
          </button>
        </div>
      </div>

      {/* Map Canvas & Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Area (8 Cols) */}
        <div className="lg:col-span-8">
          {mapMode === "leaflet" ? (
            <LeafletMineMap
              mine={selectedMine}
              company={selectedCompany}
              isAllMines={hierarchy.mineId === "ALL_MINES"}
              hotspots={filteredHotspots}
              activeHotspot={activeHotspot}
              onSelectHotspot={(h) => setActiveHotspot(h)}
              onNavigateToCapa={() => setActiveTab("capa")}
              weatherData={weatherData}
            />
          ) : (
            <div className="bg-[#182335] rounded-2xl p-4 border border-slate-700 shadow-soft relative overflow-hidden min-h-[520px] flex flex-col justify-between">
          {/* Compass & Mine Title HUD */}
          <div className="flex items-center justify-between z-10">
            <div className="bg-navy-950/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
              <span className="text-orange font-bold">GRID: </span>
              <span>
                {hierarchy.mineId === "ALL_MINES"
                  ? `${selectedCompany.code} ALL MINES CONSOLIDATED GIS`
                  : `${(selectedMine?.name || "Gevra Mega Opencast").toUpperCase()} (${getMineCoordinates(selectedMine?.id).lat.toFixed(4)}° N, ${getMineCoordinates(selectedMine?.id).lng.toFixed(4)}° E)`}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-navy-950/90 text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-mono">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>N 0° ELEV {selectedMine?.mine_type === "Underground" ? "-180m (SEAM XVI)" : "240m"}</span>
            </div>
          </div>

          {/* SVG Mine Topography & Terraced Pit Layout */}
          <div className="absolute inset-0 z-0">
            <svg className="w-full h-full opacity-60" viewBox="0 0 1000 700" preserveAspectRatio="none">
              {/* Outer Lease Boundary */}
              <polygon
                points="80,60 920,80 940,620 60,590"
                fill="#1E2C44"
                stroke="#334B6E"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Haul Roads */}
              <path
                d="M 100,560 Q 320,440 340,300 T 520,450 T 780,500 L 910,200"
                fill="none"
                stroke="#64748B"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M 100,560 Q 320,440 340,300 T 520,450 T 780,500 L 910,200"
                fill="none"
                stroke="#F8FAFC"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity="0.4"
              />

              {/* Pit Excavation Terraces / Benches */}
              <ellipse cx="400" cy="340" rx="300" ry="190" fill="#152236" stroke="#253A5A" strokeWidth="3" />
              <ellipse cx="380" cy="340" rx="240" ry="140" fill="#101B2E" stroke="#1D304D" strokeWidth="3" />
              <ellipse cx="360" cy="340" rx="170" ry="90" fill="#0C1525" stroke="#182A45" strokeWidth="2" />
              <ellipse cx="340" cy="340" rx="90" ry="40" fill="#070D18" stroke="#E83641" strokeWidth="1.5" />

              {/* Dynamic Sector Labels based on Mine Type */}
              {selectedMine?.type === "UNDERGROUND" ? (
                <>
                  <text x="220" y="270" fill="#94A3B8" fontSize="13" fontWeight="bold">LONGWALL FACE #1 (SEAM XVI)</text>
                  <text x="640" y="160" fill="#94A3B8" fontSize="13" fontWeight="bold">METHANE DRAINAGE STATION</text>
                  <text x="500" y="520" fill="#94A3B8" fontSize="13" fontWeight="bold">SURFACE VENTILATION FAN #2</text>
                  <text x="730" y="460" fill="#94A3B8" fontSize="13" fontWeight="bold">WINDER & PITHEAD GEAR</text>
                  <text x="740" y="260" fill="#94A3B8" fontSize="13" fontWeight="bold">SUBSTATION 33KV</text>
                </>
              ) : selectedMine?.code === "JAYANT" ? (
                <>
                  <text x="220" y="270" fill="#94A3B8" fontSize="13" fontWeight="bold">JAYANT EAST PIT – BENCH #6</text>
                  <text x="640" y="160" fill="#94A3B8" fontSize="13" fontWeight="bold">DRAGLINE OVERBURDEN DUMP #2</text>
                  <text x="500" y="520" fill="#94A3B8" fontSize="13" fontWeight="bold">SILO LOADING & RAIL DISPATCH</text>
                  <text x="730" y="460" fill="#94A3B8" fontSize="13" fontWeight="bold">HEMM HEAVY WORKSHOP</text>
                  <text x="740" y="260" fill="#94A3B8" fontSize="13" fontWeight="bold">FOREST BUFFER RECLAMATION</text>
                </>
              ) : selectedMine?.code === "KUSMUNDA" ? (
                <>
                  <text x="220" y="270" fill="#94A3B8" fontSize="13" fontWeight="bold">KUSMUNDA SURFACE MINER CUT #3</text>
                  <text x="640" y="160" fill="#94A3B8" fontSize="13" fontWeight="bold">IN-PIT CRUSHER HOPPER #2</text>
                  <text x="500" y="520" fill="#94A3B8" fontSize="13" fontWeight="bold">RAPID LOADING SYSTEM (RLS)</text>
                  <text x="730" y="460" fill="#94A3B8" fontSize="13" fontWeight="bold">DUMPER MAINTENANCE BAY</text>
                  <text x="740" y="260" fill="#94A3B8" fontSize="13" fontWeight="bold">SETTLING POND & RECLAMATION</text>
                </>
              ) : (
                <>
                  <text x="220" y="270" fill="#94A3B8" fontSize="13" fontWeight="bold">GEVRA MEGA PIT – BENCH #4</text>
                  <text x="640" y="160" fill="#94A3B8" fontSize="13" fontWeight="bold">OVERBURDEN DUMP #4</text>
                  <text x="500" y="520" fill="#94A3B8" fontSize="13" fontWeight="bold">COAL HANDLING PLANT (CHP)</text>
                  <text x="730" y="460" fill="#94A3B8" fontSize="13" fontWeight="bold">WORKSHOP & VEHICLE YARD</text>
                  <text x="740" y="260" fill="#94A3B8" fontSize="13" fontWeight="bold">GREENBELT ZONE</text>
                </>
              )}
            </svg>

            {/* Interactive Pins */}
            {filteredHotspots.map((h) => {
              const isSelected = activeHotspot?.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspot(h)}
                  style={{ left: `${h.x_percent}%`, top: `${h.y_percent}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
                    isSelected ? "scale-125 ring-4 ring-white/60" : "hover:scale-110"
                  }`}
                  title={`${h.name} (${h.risk})`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-[11px] shadow-lg ${getMarkerColor(
                      h.risk
                    )}`}
                  >
                    {h.risk === "CRITICAL" ? "!" : h.id.replace("HOT-", "")}
                  </div>
                  {isSelected && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-navy-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-slate-600">
                      {h.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom GIS Layer Toolbar */}
          <div className="z-10 bg-navy-950/90 text-slate-300 p-2 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Truck className="w-3.5 h-3.5 text-blue-400" /> Active Haul Fleet: 48 Dumpers
              </span>
              <span className="flex items-center gap-1 font-semibold text-white">
                <Wind className="w-3.5 h-3.5 text-green-400" /> Dust Telemetry: PM10 82 ug/m³
              </span>
            </div>
            <span className="text-slate-400 font-mono">Sensors: 28 SSR Radar / 16 Gas Monitors</span>
          </div>
        </div>
          )}
        </div>

        {/* Selected Hotspot Drill-down Card (Section 14) (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between space-y-4">
          {activeHotspot ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-mineBorder pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue">{activeHotspot.id}</span>
                  <h3 className="text-sm font-black text-navy mt-0.5">{activeHotspot.name}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    activeHotspot.risk === "CRITICAL"
                      ? "bg-red text-white"
                      : activeHotspot.risk === "HIGH"
                      ? "bg-orange text-white"
                      : activeHotspot.risk === "MODERATE"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-green text-white"
                  }`}
                >
                  {activeHotspot.risk}
                </span>
              </div>

              {/* Attributes Table */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] font-semibold block">Identified Statutory Issue:</span>
                  <p className="text-navy font-bold leading-snug mt-0.5">{activeHotspot.issue}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block">Category</span>
                    <span className="text-slate-800 font-bold">{activeHotspot.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block">Department</span>
                    <span className="text-slate-800 font-bold">{activeHotspot.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block">Status</span>
                    <span className="text-slate-800 font-bold">{activeHotspot.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold block">Last Inspected</span>
                    <span className="text-slate-800 font-mono font-bold">{activeHotspot.date}</span>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bench Elevation:</span>
                    <span className="font-mono font-bold text-navy">{activeHotspot.elevation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Heavy Fleet:</span>
                    <span className="font-mono font-bold text-navy">{activeHotspot.active_fleet} Units</span>
                  </div>
                  {activeHotspot.capa_id && (
                    <div className="flex justify-between pt-1 border-t border-blue-200">
                      <span className="text-purple font-bold">Associated CAPA:</span>
                      <span className="font-mono font-bold text-purple">{activeHotspot.capa_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-mineBorder">
                {activeHotspot.capa_id && (
                  <button
                    onClick={() => setActiveTab("capa")}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Inspect CAPA ({activeHotspot.capa_id})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("inspections")}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5 border border-slate-300"
                >
                  <span>View All Sector Inspections</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Click on any hotspot pin on the map to review spatial telemetry and non-conformance records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
