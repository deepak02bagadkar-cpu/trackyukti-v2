"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Smartphone,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  PlusCircle,
  AlertOctagon,
  Leaf,
  Camera,
  CheckSquare,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Radio,
} from "lucide-react";

export const FieldMobileView: React.FC = () => {
  const { isOffline, toggleOffline, syncOfflineData, addToast, createInspection, user } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [quickObservation, setQuickObservation] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const gpsCoords = "23.3149° N, 75.8577° E";
  const currentTime = "27 Sep 2026, 17:35 IST";

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      syncOfflineData();
    }, 900);
  };

  const handleQuickSafetySubmit = async () => {
    await createInspection({
      area: "North Pit – Sector B",
      type: "Field Safety Observation",
      observations: quickObservation || "Urgent field safety observation recorded via rugged mobile terminal.",
      severity: "Critical",
      location_coords: gpsCoords,
    });
    setQuickObservation("");
    setActiveModal(null);
  };

  const handleQuickEnvSubmit = async () => {
    await createInspection({
      area: "Coal Handling Plant (CHP)",
      type: "Field Environmental Issue",
      observations: quickObservation || "Dust suppression mist nozzle blockage observed at conveyor transfer point.",
      severity: "High",
      location_coords: gpsCoords,
    });
    setQuickObservation("");
    setActiveModal(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5 animate-in fade-in select-none">
      {/* Mobile Device Frame Header */}
      <div className="bg-navy rounded-2xl p-5 text-white shadow-card border border-navy-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center font-bold text-sm">
              FM
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide">FIELD MOBILE MODE</h2>
              <p className="text-[10px] text-slate-300">Rugged DGMS Field Inspector Terminal</p>
            </div>
          </div>

          <button
            onClick={toggleOffline}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isOffline
                ? "bg-red-500/20 text-red-300 border-red-500 animate-pulse"
                : "bg-green-500/20 text-green-300 border-green-500"
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? "OFFLINE MODE" : "ONLINE"}</span>
          </button>
        </div>

        {/* Telemetry Bar (GPS + Timestamp) */}
        <div className="bg-navy-950/80 rounded-xl p-3 border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono">
            <MapPin className="w-3.5 h-3.5 text-orange flex-shrink-0" />
            <span className="font-bold">GPS: {gpsCoords}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Offline Warning Banner */}
        {isOffline ? (
          <div className="bg-red-900/60 border border-red-500/80 rounded-xl p-3 text-center space-y-1">
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2">
              <Radio className="w-4 h-4 text-red-300 animate-ping" />
              <span>OFFLINE — DATA STORED LOCALLY</span>
            </div>
            <p className="text-[10px] text-red-200">
              6 pending records in local SQLite cache. Data will automatically push when network returns.
            </p>
          </div>
        ) : (
          <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-green-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green" /> Central Database Synced
            </span>
            <span className="text-[10px] font-mono text-green-300">Latency: 18ms</span>
          </div>
        )}
      </div>

      {/* Large Touch Action Buttons (Section 11) */}
      <div className="space-y-3">
        {/* NEW INSPECTION */}
        <button
          onClick={() => setActiveModal("NEW_INSPECTION")}
          className="w-full py-4 px-5 rounded-2xl bg-navy hover:bg-navy-800 text-white font-black text-sm flex items-center justify-between shadow-soft border border-navy-700 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue/30 text-blue-200">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold">NEW INSPECTION</div>
              <div className="text-[11px] text-slate-300 font-normal">Initiate formal statutory pit check</div>
            </div>
          </div>
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full font-mono">GO</span>
        </button>

        {/* REPORT SAFETY OBSERVATION */}
        <button
          onClick={() => setActiveModal("SAFETY_OBS")}
          className="w-full py-4 px-5 rounded-2xl bg-red hover:bg-red-600 text-white font-black text-sm flex items-center justify-between shadow-soft border border-red-400 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 text-white">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold">REPORT SAFETY OBSERVATION</div>
              <div className="text-[11px] text-red-100 font-normal">Flag berm defect, loose boulder, or brake fault</div>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">HIGH RISK</span>
        </button>

        {/* REPORT ENVIRONMENT ISSUE */}
        <button
          onClick={() => setActiveModal("ENV_ISSUE")}
          className="w-full py-4 px-5 rounded-2xl bg-green hover:bg-green-600 text-white font-black text-sm flex items-center justify-between shadow-soft border border-green-500 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 text-white">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold">REPORT ENVIRONMENT ISSUE</div>
              <div className="text-[11px] text-green-100 font-normal">Log dust suppression, runoff, or effluent overflow</div>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">CPCB</span>
        </button>

        {/* UPLOAD EVIDENCE */}
        <button
          onClick={() => {
            addToast({
              type: "success",
              title: "Geotagged Camera Launched",
              message: "Field photo 'Photo_Berm_RL240.jpg' geotagged at 23.3149° N, 75.8577° E.",
            });
          }}
          className="w-full py-4 px-5 rounded-2xl bg-purple hover:bg-purple-600 text-white font-black text-sm flex items-center justify-between shadow-soft border border-purple-400 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 text-white">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold">UPLOAD EVIDENCE</div>
              <div className="text-[11px] text-purple-100 font-normal">Capture geotagged site photo or survey readout</div>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">CAM</span>
        </button>

        {/* VIEW ASSIGNED TASKS */}
        <button
          onClick={() => {
            addToast({
              type: "info",
              title: "Assigned Field Tasks",
              message: "3 pending tasks assigned: Sector B berm verification, CHP water nozzle check, Substation earth pit.",
            });
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-navy font-black text-sm flex items-center justify-between shadow-soft border border-mineBorder transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-navy">VIEW ASSIGNED TASKS</div>
              <div className="text-[10px] text-mineMuted font-normal">3 field verifications slated for today</div>
            </div>
          </div>
          <span className="text-xs font-bold text-blue bg-blue-50 px-2 py-0.5 rounded-full">3 Tasks</span>
        </button>

        {/* SYNC DATA */}
        <button
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="w-full py-4 px-5 rounded-2xl bg-orange hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-soft border border-orange-400 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "SYNCHRONIZING WITH DGMS..." : "SYNC DATA NOW"}</span>
        </button>
      </div>

      {/* Observation Entry Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            <h3 className="text-sm font-black text-navy border-b border-mineBorder pb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue" />
              <span>
                {activeModal === "SAFETY_OBS"
                  ? "Quick Safety Hazard Observation"
                  : activeModal === "ENV_ISSUE"
                  ? "Report Environmental Non-conformance"
                  : "Start New Field Inspection"}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono">
                Location: <strong className="text-navy">North Pit Sector B</strong> ({gpsCoords})
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observation Remarks</label>
                <textarea
                  rows={3}
                  value={quickObservation}
                  onChange={(e) => setQuickObservation(e.target.value)}
                  placeholder="Record immediate field conditions..."
                  className="w-full p-2 border border-mineBorder rounded-lg text-mineText text-xs focus:ring-1 focus:ring-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-mineBorder">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={activeModal === "SAFETY_OBS" ? handleQuickSafetySubmit : handleQuickEnvSubmit}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white shadow-sm"
                >
                  Submit & Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
