"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";
import {
  Settings,
  Shield,
  UserCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  Key,
  Database,
  Building,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { user, switchRole, demoMode, resetDemo, addToast } = useApp();

  const roleDefinitions: {
    role: Role;
    title: string;
    description: string;
    permissions: string[];
  }[] = [
    {
      role: "ADMIN",
      title: "Chief Director of Mine Safety & Governance (Admin)",
      description: "Full master access to statutory configurations, audit trails, and judicial closures.",
      permissions: [
        "Full Platform Control",
        "Statutory Verification & Closure",
        "CAPA Dispatch & Override",
        "Tamper-Evident Audit Export",
        "System Baseline Reset",
      ],
    },
    {
      role: "MINE_OFFICIAL",
      title: "General Manager (Operations & Compliance)",
      description: "Authorized mine manager. Can assign CAPAs, review evidence, and sign statutory closures.",
      permissions: [
        "Mine-Level Governance Management",
        "Assign CAPA to Departments",
        "Statutory Verification of Corrective Evidence",
        "Alert Escalation to CIL Board",
      ],
    },
    {
      role: "INSPECTOR",
      title: "Statutory DGMS Dy. Director / Mining Inspector",
      description: "Field audit persona. Can file surprise inspections, log critical observations, and geotag hazards.",
      permissions: [
        "Register Field Inspections",
        "File Safety & Environmental Observations",
        "Geotagged Photo Upload",
        "Field Offline Cache Sync",
      ],
    },
    {
      role: "CORPORATE_MANAGER",
      title: "Executive Director (Safety & ESG), CIL HQ",
      description: "Corporate strategic viewer. Access to consolidated multi-subsidiary governance analytics.",
      permissions: [
        "Multi-Mine Comparative Dashboards",
        "ESG & MoEFCC Return Tracking",
        "Contractor Cross-Unit Scorecards",
        "Consolidated Report Exports",
      ],
    },
    {
      role: "REGULATORY_VIEWER",
      title: "Statutory Auditor & MoEFCC Nominee",
      description: "Independent audit and regulator access. Read-only verification of statutory returns.",
      permissions: [
        "Read-Only Audit Trail Access",
        "Statutory Return Inspection",
        "Digital Verification Seal Review",
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mineBorder pb-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Role-Based Access Control (RBAC) & Governance Settings</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Configure statutory personas, view permission matrices, and manage demo simulation parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue border border-blue-200">
            Active Persona: {user?.role}
          </span>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div className="bg-white rounded-2xl p-6 border border-mineBorder shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy">Smart India Hackathon 2026 Demo Simulation</h3>
              <p className="text-xs text-mineMuted">
                Preloaded with 128 realistic Indian coal mining records across SECL, BCCL, WCL, and MCL.
              </p>
            </div>
          </div>

          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-navy hover:bg-navy-800 text-white transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Baseline (Risk: 72/100)</span>
          </button>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <span className="font-bold text-amber-700">Notice:</span>
          <span>
            Demonstration mode is active. Data is pre-seeded for realistic evaluation of DGMS and MoEFCC statutory compliance workflows.
          </span>
        </div>
      </div>

      {/* RBAC Role Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
          Available Statutory Personas & Permissions:
        </h3>

        <div className="space-y-3">
          {roleDefinitions.map((def) => {
            const isCurrent = user?.role === def.role;
            return (
              <div
                key={def.role}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-blue-50/50 border-blue shadow-card ring-1 ring-blue"
                    : "bg-white border-mineBorder shadow-soft hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mineBorder/60 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-navy px-2 py-0.5 rounded bg-slate-100">
                        {def.role}
                      </span>
                      <h4 className="text-sm font-bold text-navy">{def.title}</h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green text-white">
                          Active Persona
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-mineMuted mt-1">{def.description}</p>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => switchRole(def.role)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-navy border border-slate-300 shadow-sm transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      Switch To This Role
                    </button>
                  )}
                </div>

                {/* Permissions List */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Granted Statutory Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {def.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-mineBorder text-slate-700 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green" />
                        <span>{perm}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statutory Disclaimer & Project Footer (Section 35) */}
      <div className="pt-4 border-t border-mineBorder text-center text-xs text-mineMuted space-y-1">
        <div className="font-black text-navy text-sm tracking-wider uppercase">KHAN DRISHTI (खान दृष्टि)</div>
        <p className="text-[11px]">Smart Governance Platform for Coal Mines</p>
        <p className="text-[11px] text-slate-400">
          Smart India Hackathon 2026 | Problem Statement ID: 26024
        </p>
        <p className="text-[10px] text-slate-400 italic pt-1">
          Designed for compliance with DGMS (CMR 2017) and MoEFCC EIA notifications. Prototype demonstration platform.
        </p>
      </div>
    </div>
  );
};
