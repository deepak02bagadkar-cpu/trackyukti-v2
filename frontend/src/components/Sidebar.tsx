"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { KhanDrishtiLogo } from "./KhanDrishtiLogo";
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  Smartphone,
  Cpu,
  MapPin,
  CheckSquare,
  Users,
  FileText,
  Bell,
  History,
  FileSpreadsheet,
  Bot,
  Settings,
  ChevronRight,
  ShieldAlert,
  LogOut,
  UserCheck,
  Scale,
  Building2,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    logout,
    alerts,
    capas,
    hierarchy,
    getSelectedCompany,
    getSelectedMine,
    openCompareMinesModal,
  } = useApp();

  const selectedCompany = getSelectedCompany();
  const selectedMine = getSelectedMine();

  const unreadAlerts = alerts.filter((a) => a.status === "UNACKNOWLEDGED").length;
  const openCapas = capas.filter((c) => c.status !== "CLOSED").length;

  const navItems = [
    { id: "dashboard", label: "COMMAND CENTER", icon: LayoutDashboard, badge: null },
    { id: "compliance", label: "COMPLIANCE", icon: ShieldCheck, badge: "52" },
    { id: "inspections", label: "INSPECTIONS", icon: ClipboardList, badge: null },
    { id: "field-mode", label: "FIELD MODE (MOBILE)", icon: Smartphone, badge: "GPS" },
    { id: "ai-risk", label: "AI RISK", icon: Cpu, badge: "ALERT", badgeColor: "bg-red-500 text-white" },
    { id: "mine-map", label: "MINE MAP", icon: MapPin, badge: null },
    { id: "capa", label: "CORRECTIVE ACTIONS", icon: CheckSquare, badge: `${openCapas}`, badgeColor: "bg-orange-500 text-white" },
    { id: "contractors", label: "CONTRACTORS", icon: Users, badge: "15" },
    { id: "documents", label: "DOCUMENT INTELLIGENCE", icon: FileText, badge: "OCR" },
    { id: "alerts", label: "ALERTS", icon: Bell, badge: `${unreadAlerts}`, badgeColor: "bg-red-500 text-white" },
    { id: "audit", label: "AUDIT TRAIL", icon: History, badge: null },
    { id: "reports", label: "REPORTS", icon: FileSpreadsheet, badge: null },
    { id: "ai-assistant", label: "AI ASSISTANT", icon: Bot, badge: "LIVE", badgeColor: "bg-purple-600 text-white" },
    { id: "settings", label: "SETTINGS / ROLES", icon: Settings, badge: null },
  ];

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "MINE_OFFICIAL":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "INSPECTOR":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CORPORATE_MANAGER":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <aside className="w-72 bg-navy text-white flex flex-col h-screen border-r border-navy-800 select-none flex-shrink-0 z-30">
      {/* Brand Header with Deep-Tech Logo */}
      <div className="p-4 border-b border-navy-800 bg-[#0B1A36]">
        <div className="flex items-center gap-3">
          <KhanDrishtiLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm tracking-wider leading-none text-white uppercase">
                KHAN <span className="text-orange">DRISHTI</span>
              </h1>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-orange/20 text-orange border border-orange/40 font-mono">
                खान दृष्टि
              </span>
            </div>
            <p className="text-[9px] text-slate-300 font-medium tracking-tight mt-1">Smart Governance Platform</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between bg-navy-950 px-2.5 py-1.5 rounded-md border border-navy-800 text-[11px]">
          <span className="text-slate-400 font-mono">PS ID: 26024</span>
          <span className="text-orange font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"></span>
            SIH 2026
          </span>
        </div>

        {/* Compare Mines Quick Trigger */}
        <button
          onClick={openCompareMinesModal}
          className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-navy-950 hover:bg-[#152B52] border border-navy-800 text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center justify-between transition-colors shadow-sm"
        >
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>COMPARE MINES</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
            BENCHMARK
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="px-3 pb-1.5 pt-1 text-[10px] font-bold text-slate-400 tracking-wider">
          GOVERNANCE & STATUTORY MODULES
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue text-white shadow-sm border-l-4 border-orange"
                  : "text-slate-300 hover:bg-[#152B52] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || "bg-[#18396D] text-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* User & Role Footer */}
      <div className="p-3 border-t border-navy-800 bg-[#0B1A36]">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {user.avatar || user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate text-white leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-300 truncate">{user.designation}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded text-slate-400 hover:text-red hover:bg-navy-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-navy-800/60 text-[10px]">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              <span className="text-amber-400 font-mono font-bold flex items-center gap-1" title={`${selectedCompany.code} - ${hierarchy.mineId === 'ALL_MINES' ? 'ALL MINES' : selectedMine?.name}`}>
                <Building2 className="w-3 h-3 text-orange" />
                <span>{selectedCompany.code}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-200 truncate max-w-[80px]">
                  {hierarchy.mineId === "ALL_MINES" ? "ALL" : selectedMine?.code || "MINE"}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <span className="text-xs text-slate-400">Not logged in</span>
          </div>
        )}
      </div>
    </aside>
  );
};
