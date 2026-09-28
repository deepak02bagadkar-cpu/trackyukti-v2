"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";
import { COAL_COMPANIES, CoalCompany, CoalMine } from "../../data/coalCompanies";
import { KhanDrishtiLogo } from "../KhanDrishtiLogo";
import {
  ShieldCheck,
  Cpu,
  Workflow,
  CheckCircle,
  FileSpreadsheet,
  Lock,
  Mail,
  Building,
  Key,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Building2,
  Mountain,
  Users,
  Compass,
  Activity,
  Layers,
  ShieldAlert,
} from "lucide-react";

export const LoginView: React.FC = () => {
  const { login, selectCompany, selectMine } = useApp();
  const [email, setEmail] = useState("admin@khandrishti.demo");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState<Role>("ADMIN");
  const [companyCode, setCompanyCode] = useState("SECL");
  const [mineId, setMineId] = useState("SECL-GEVRA");
  const [loading, setLoading] = useState(false);

  // Available mines for current company
  const currentCompany = COAL_COMPANIES.find((c) => c.code === companyCode) || COAL_COMPANIES[5]; // Default SECL
  const availableMines = currentCompany.mines;

  // When company changes, pick first mine or ALL_MINES
  const handleCompanyChange = (code: string) => {
    setCompanyCode(code);
    const comp = COAL_COMPANIES.find((c) => c.code === code);
    if (comp && comp.mines.length > 0) {
      setMineId(comp.mines[0].id);
    } else {
      setMineId("ALL_MINES");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Sync hierarchy
    selectCompany(companyCode);
    selectMine(mineId);

    const mineObj = availableMines.find((m) => m.id === mineId);
    const mineName = mineId === "ALL_MINES" ? "All Mines Consolidated" : (mineObj?.name || "Gevra Open Cast Project");

    await login(email, password, role, `${currentCompany.code} - ${mineName}`);
    setLoading(false);
  };

  const setDemoPersona = (
    demoEmail: string,
    demoPass: string,
    demoRole: Role,
    demoCompany: string,
    demoMine: string
  ) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);
    setCompanyCode(demoCompany);
    setMineId(demoMine);
  };

  return (
    <div className="min-h-screen bg-[#070F1E] flex items-center justify-center p-4 lg:p-8 select-none relative overflow-hidden">
      {/* Background Mission Control Blueprint Grid & Radar Aura */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#38BDF8 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px, 96px 96px, 96px 96px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-[#0C172C]/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] relative z-10">
        
        {/* Left Side: National Governance Branding & Architecture */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#09152B] via-[#0D1D3C] to-[#0A162E] text-white p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          {/* Subtle watermark telemetry */}
          <div className="absolute right-4 top-4 text-[10px] font-mono text-slate-500 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYS-ONLINE: DGMS-GRID-2026
          </div>

          <div>
            {/* National SIH Badge */}
            <div className="inline-flex items-center gap-2 bg-navy-950/90 px-3 py-1.5 rounded-full border border-sky-500/30 text-xs font-mono text-slate-300 shadow-sm mb-6">
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white font-black text-[10px] tracking-wider">
                SIH 2026
              </span>
              <span className="text-sky-300 font-bold">PS ID: 26024</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 text-[11px]">DGMS / MoEFCC / CIL Framework</span>
            </div>

            {/* Logo & Headline */}
            <div className="flex items-center gap-4">
              <KhanDrishtiLogo size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black tracking-wider text-white flex items-center gap-1.5 uppercase">
                    KHAN <span className="text-orange">DRISHTI</span>
                  </h1>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange/20 text-orange border border-orange/40 font-mono">
                    खान दृष्टि
                  </span>
                </div>
                <p className="text-xs text-sky-200/90 font-medium tracking-tight mt-1">
                  Smart Governance Platform for Coal Mines
                </p>
                <div className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5 uppercase">
                  Integrated Governance | Compliance | Transparency
                </div>
              </div>
            </div>

            {/* Problem Statement Mission */}
            <div className="mt-6 bg-[#071124]/80 p-4 rounded-xl border border-slate-700/70 shadow-inner">
              <h2 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Mining Compliance & Proactive Risk Engine</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transforming fragmented coal mine safety observations, sensor telemetry, and statutory filings into
                explainable AI intelligence, proactive risk mitigation, and verified corrective actions.
              </p>
            </div>

            {/* Core Governance Intelligence Pipeline */}
            <div className="mt-6 bg-[#0B1A38]/90 p-4 rounded-xl border border-sky-900/60">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Core Governance Pipeline</span>
                <span className="text-[10px] font-mono text-slate-400">100% Explainable AI</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span className="text-sky-300 bg-sky-950/80 px-2 py-1 rounded border border-sky-800">FIELD DATA</span>
                <span className="text-slate-500">→</span>
                <span className="text-purple-300 bg-purple-950/80 px-2 py-1 rounded border border-purple-800">AI RISK</span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-300 bg-amber-950/80 px-2 py-1 rounded border border-amber-800">CAPA WORKFLOW</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">VERIFICATION</span>
              </div>
            </div>

            {/* Live Telemetry Stats */}
            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#081226]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-base font-black text-amber-400 font-mono">10</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Organizations</div>
              </div>
              <div className="bg-[#081226]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-base font-black text-sky-400 font-mono">52</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Regulations</div>
              </div>
              <div className="bg-[#081226]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-base font-black text-emerald-400 font-mono">&lt;42ms</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Inference</div>
              </div>
              <div className="bg-[#081226]/80 p-2.5 rounded-lg border border-slate-800">
                <div className="text-base font-black text-purple-400 font-mono">100%</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Audit Chain</div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Statutory Benchmark Engine
            </span>
            <span className="font-mono text-slate-500">v2.1.0-IIT-EDITION</span>
          </div>
        </div>

        {/* Right Side: High-Tech Sign In & Hierarchy Pre-selector */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between bg-[#0F1C36]/95 text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Authorized Command Sign In</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your mining organization and authorized role persona.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> DEMO DATASET
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Hierarchical Pre-selection (Company & Mine) */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#08142B] border border-slate-700/80">
                <div>
                  <label className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Company / Subsidiary</span>
                  </label>
                  <select
                    value={companyCode}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#0F1C36] border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {COAL_COMPANIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} – {c.name.split("(")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>Mine / Operational Unit</span>
                  </label>
                  <select
                    value={mineId}
                    onChange={(e) => setMineId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#0F1C36] border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 truncate"
                  >
                    <option value="ALL_MINES">ALL MINES (Multi-Unit View)</option>
                    {availableMines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.type === "OPENCAST" ? "OCM" : m.type === "UNDERGROUND" ? "UG" : "INST"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Employee ID / Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#08142B] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-500"
                      placeholder="official@khandrishti.demo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#08142B] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Designated Role & Authority Level
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs bg-[#08142B] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-white font-medium"
                >
                  <option value="ADMIN">Admin / Safety Director (Full Control, Apex Audit)</option>
                  <option value="MINE_OFFICIAL">Mine General Manager (Field Operations & CAPA)</option>
                  <option value="INSPECTOR">Statutory Inspector (DGMS Safety Audits & Violations)</option>
                  <option value="CORPORATE_MANAGER">Corporate Risk Manager (Cross-Subsidiary Benchmarking)</option>
                  <option value="REGULATORY_VIEWER">Regulatory Viewer (Read-only MoEFCC/DGMS)</option>
                </select>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(242,105,20,0.35)] hover:shadow-[0_6px_20px_rgba(242,105,20,0.5)] cursor-pointer"
              >
                <span>{loading ? "Authenticating & Initializing Grid..." : "Authorize & Enter Mission Control"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Demo Persona Credentials */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Evaluator 1-Click Persona Quick-Fill:
                </span>
                <span className="text-[10px] text-sky-400 font-mono">Click to test instant roles</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* 1. Admin */}
                <button
                  type="button"
                  onClick={() =>
                    setDemoPersona(
                      "admin@khandrishti.demo",
                      "admin123",
                      "ADMIN",
                      "SECL",
                      "SECL-GEVRA"
                    )
                  }
                  className={`p-2 rounded-lg border text-left transition-all ${
                    role === "ADMIN"
                      ? "border-sky-500 bg-sky-500/20 text-sky-200"
                      : "border-slate-800 bg-[#08142B] text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold text-white flex items-center justify-between">
                    <span>Admin</span>
                    <span className="text-[9px] px-1 bg-purple-500/20 text-purple-300 rounded font-mono">SECL</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Safety Dir. (Gevra)</div>
                </button>

                {/* 2. Mine Official */}
                <button
                  type="button"
                  onClick={() =>
                    setDemoPersona(
                      "official@khandrishti.demo",
                      "official123",
                      "MINE_OFFICIAL",
                      "SECL",
                      "SECL-KUSMUNDA"
                    )
                  }
                  className={`p-2 rounded-lg border text-left transition-all ${
                    role === "MINE_OFFICIAL"
                      ? "border-sky-500 bg-sky-500/20 text-sky-200"
                      : "border-slate-800 bg-[#08142B] text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold text-white flex items-center justify-between">
                    <span>Mine GM</span>
                    <span className="text-[9px] px-1 bg-blue-500/20 text-blue-300 rounded font-mono">KUSM</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Operations Lead</div>
                </button>

                {/* 3. Inspector */}
                <button
                  type="button"
                  onClick={() =>
                    setDemoPersona(
                      "inspector@khandrishti.demo",
                      "inspector123",
                      "INSPECTOR",
                      "NCL",
                      "NCL-JAYANT"
                    )
                  }
                  className={`p-2 rounded-lg border text-left transition-all ${
                    role === "INSPECTOR"
                      ? "border-sky-500 bg-sky-500/20 text-sky-200"
                      : "border-slate-800 bg-[#08142B] text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold text-white flex items-center justify-between">
                    <span>Inspector</span>
                    <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-mono">NCL</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">DGMS Statutory</div>
                </button>

                {/* 4. Corporate Manager */}
                <button
                  type="button"
                  onClick={() =>
                    setDemoPersona(
                      "corporate@khandrishti.demo",
                      "corporate123",
                      "CORPORATE_MANAGER",
                      "CIL",
                      "ALL_MINES"
                    )
                  }
                  className={`p-2 rounded-lg border text-left transition-all ${
                    role === "CORPORATE_MANAGER"
                      ? "border-sky-500 bg-sky-500/20 text-sky-200"
                      : "border-slate-800 bg-[#08142B] text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold text-white flex items-center justify-between">
                    <span>Corporate</span>
                    <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-mono">CIL</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Multi-Mine Matrix</div>
                </button>
              </div>
            </div>
          </div>

          {/* Statutory Integrity Disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Complies with DGMS / MoEFCC statutory guidelines</span>
            </span>
            <span className="text-slate-500 font-mono">PS ID: 26024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
