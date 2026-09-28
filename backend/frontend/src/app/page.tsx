"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { DemoTourBar } from "../components/DemoTourBar";
import { CompareMinesModal } from "../components/CompareMinesModal";

// Views
import { LoginView } from "../components/views/LoginView";
import { DashboardView } from "../components/views/DashboardView";
import { ComplianceView } from "../components/views/ComplianceView";
import { InspectionsView } from "../components/views/InspectionsView";
import { FieldMobileView } from "../components/views/FieldMobileView";
import { AiRiskView } from "../components/views/AiRiskView";
import { MineMapView } from "../components/views/MineMapView";
import { CapaView } from "../components/views/CapaView";
import { ContractorsView } from "../components/views/ContractorsView";
import { DocumentOcrView } from "../components/views/DocumentOcrView";
import { AlertsView } from "../components/views/AlertsView";
import { AuditTrailView } from "../components/views/AuditTrailView";
import { ReportsView } from "../components/views/ReportsView";
import { AiAssistantView } from "../components/views/AiAssistantView";
import { SettingsView } from "../components/views/SettingsView";

export default function Home() {
  const { isLoggedIn, activeTab, getSelectedCompany, getSelectedMine, hierarchy } = useApp();

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const selectedCompany = getSelectedCompany();
  const selectedMine = getSelectedMine();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "compliance":
        return <ComplianceView />;
      case "inspections":
        return <InspectionsView />;
      case "field-mode":
        return <FieldMobileView />;
      case "ai-risk":
        return <AiRiskView />;
      case "mine-map":
        return <MineMapView />;
      case "capa":
        return <CapaView />;
      case "contractors":
        return <ContractorsView />;
      case "documents":
        return <DocumentOcrView />;
      case "alerts":
        return <AlertsView />;
      case "audit":
        return <AuditTrailView />;
      case "reports":
        return <ReportsView />;
      case "ai-assistant":
        return <AiAssistantView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden command-center-bg font-sans">
      {/* Persistent Left Sidebar with CoalShield Deep-Tech Branding */}
      <Sidebar />

      {/* Main Mission Control Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Header Filter & Hierarchy Selector */}
        <Header />

        {/* Real-Time Command Telemetry Bar */}
        <div className="bg-[#0A162C]/95 text-slate-300 px-6 py-1 text-[11px] font-mono flex items-center justify-between border-b border-slate-800 shadow-inner z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STATUTORY SURVEILLANCE ACTIVE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-300 font-semibold">
              ORGANIZATION: {selectedCompany.code} ({selectedCompany.shortName})
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              TARGET: {hierarchy.mineId === "ALL_MINES" ? "ALL SUBSIDIARY MINES (CONSOLIDATED)" : (selectedMine?.name || "Selected Unit")}
            </span>
            {selectedMine?.coordinates && hierarchy.mineId !== "ALL_MINES" && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400">
                  COORDS: {selectedMine.coordinates.lat.toFixed(3)}°N, {selectedMine.coordinates.lng.toFixed(3)}°E
                </span>
              </>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] text-slate-400">
            <span>DGMS CMR-2017: <strong className="text-emerald-400">VERIFIED</strong></span>
            <span>AUDIT HASH: <strong className="text-sky-300">CHAIN-SYNCED</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">DEMO BENCHMARK</span>
          </div>
        </div>

        {/* Interactive Evaluator Demo Tour Guide */}
        <DemoTourBar />

        {/* Dynamic View Scroll Area with Blueprint Grid Texture */}
        <main className="flex-1 overflow-y-auto pb-12 relative">
          {renderActiveView()}

          {/* Statutory Footer */}
          <footer className="mt-8 pt-4 pb-6 border-t border-slate-300/80 text-center text-xs text-mineMuted">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-black text-navy uppercase">KHAN DRISHTI (खान दृष्टि)</span>
              <span>•</span>
              <span>Smart Governance Platform for Coal Mines</span>
              <span>•</span>
              <span className="font-mono text-orange font-bold">SIH 2026 PS ID: 26024</span>
              <span>•</span>
              <span>DGMS / MoEFCC / Coal India Statutory Architecture</span>
            </div>
          </footer>
        </main>

        {/* Multi-Mine Benchmark Comparison Matrix Modal */}
        <CompareMinesModal />
      </div>
    </div>
  );
}
