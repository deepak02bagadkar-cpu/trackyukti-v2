"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";
import { HierarchySelector } from "./HierarchySelector";
import {
  Wifi,
  WifiOff,
  Smartphone,
  Shield,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Mountain,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    user,
    switchRole,
    isOffline,
    toggleOffline,
    resetDemo,
    activeTab,
    setActiveTab,
    hierarchy,
    getSelectedCompany,
    getSelectedMine,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const selectedCompany = getSelectedCompany();
  const selectedMine = getSelectedMine();

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: "ADMIN", label: "Admin", desc: "Full governance, statutory closure" },
    { role: "MINE_OFFICIAL", label: "Mine Official", desc: "Assign CAPA, verify actions" },
    { role: "INSPECTOR", label: "Inspector", desc: "Create inspection & observation" },
    { role: "CORPORATE_MANAGER", label: "Corporate Manager", desc: "Consolidated multi-mine views" },
    { role: "REGULATORY_VIEWER", label: "Regulatory Viewer", desc: "DGMS / MoEFCC read-only audit" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-mineBorder px-6 py-2.5 flex flex-col gap-2 shadow-sm sticky top-0 z-20">
      {/* Top row: Status, Demo Banner, Role Quick-switch, Tools */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-navy text-base tracking-tight uppercase">KHAN DRISHTI</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange/15 text-orange font-mono">
              खान दृष्टि
            </span>
            <span className="text-mineMuted text-xs">|</span>
            <span className="text-xs font-bold text-mineMuted uppercase tracking-wider">
              {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              DEMO DATA (SIH 2026)
            </span>

            <button
              onClick={toggleOffline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border ${
                isOffline
                  ? "bg-red-50 text-red border-red-200 animate-pulse"
                  : "bg-green-50 text-green border-green-200"
              }`}
              title="Toggle simulated field offline state"
            >
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              {isOffline ? "OFFLINE — DATA STORED LOCALLY" : "CONNECTED TO DGMS GRID"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Unit Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
            <Building2 className="w-3 h-3 text-orange" />
            <strong className="text-navy">{selectedCompany.code}</strong>
            <span className="text-slate-400">/</span>
            <Mountain className="w-3 h-3 text-blue" />
            <span className="text-slate-700 truncate max-w-[140px]">
              {hierarchy.mineId === "ALL_MINES" ? "ALL MINES" : selectedMine?.name || "All Units"}
            </span>
          </div>

          {/* Mobile field toggle */}
          <button
            onClick={() => setActiveTab(activeTab === "field-mode" ? "dashboard" : "field-mode")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              activeTab === "field-mode"
                ? "bg-blue text-white border-blue shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Field Mobile
          </button>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-navy text-white hover:bg-navy-800 transition-colors shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-orange" />
              <span>Role: {user?.role || "ADMIN"}</span>
              <SlidersHorizontal className="w-3 h-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-card border border-mineBorder py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active RBAC Persona
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                      user?.role === r.role ? "bg-blue-50 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="font-semibold flex items-center justify-between">
                      {r.label}
                      {user?.role === r.role && <span className="text-[10px] text-blue">Active</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemo}
            title="Reset demo scenario to initial baseline (SECL Gevra 72/100)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Hierarchical Searchable Dependent Dropdown Bar */}
      <HierarchySelector />
    </header>
  );
};
