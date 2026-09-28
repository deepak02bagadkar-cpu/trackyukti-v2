"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MineNode } from "../data/coalCompanies";
import {
  BarChart3,
  X,
  Mountain,
  Building2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Filter,
} from "lucide-react";

export const CompareMinesModal: React.FC = () => {
  const {
    companies,
    showCompareMinesModal,
    setShowCompareMinesModal,
    hierarchy,
    selectCompany,
    selectMine,
    addToast,
  } = useApp();

  const [companyFilter, setCompanyFilter] = useState<string>(hierarchy.companyCode || "ALL");

  if (!showCompareMinesModal) return null;

  // Flatten mines with their parent company
  const allMinesWithCompany = companies.flatMap((comp) =>
    comp.mines.map((m) => ({
      ...m,
      companyCode: comp.code,
      companyName: comp.name,
    }))
  );

  const displayedMines =
    companyFilter === "ALL"
      ? allMinesWithCompany
      : allMinesWithCompany.filter((m) => m.companyCode === companyFilter);

  const handleSelectAndLoad = (companyCode: string, mineId: string, mineName: string) => {
    selectCompany(companyCode);
    selectMine(mineId);
    setShowCompareMinesModal(false);
    addToast({
      type: "success",
      title: "Mine Selected",
      message: `Switched operational context to ${mineName} (${companyCode}).`,
    });
  };

  return (
    <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-floating border border-slate-200 space-y-4 animate-in fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-navy text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-base font-black text-navy uppercase tracking-wide">
                Factual Multi-Mine Comparative Governance Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Objective operational and compliance metrics across Indian coal mining subsidiaries. Non-ranked factual indicators.
            </p>
          </div>

          <button
            onClick={() => setShowCompareMinesModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter by Subsidiary */}
        <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-700">Filter by Mining Company:</span>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="ALL">All Monitored Organizations ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Displaying <strong>{displayedMines.length} Units</strong> | Marked as{" "}
            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">DEMO DATA</span>
          </div>
        </div>

        {/* Comparative Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 bg-slate-100 z-10">
              <tr>
                <th className="p-3">Mine / Operational Project</th>
                <th className="p-3">Company</th>
                <th className="p-3">Location & Type</th>
                <th className="p-3 text-center">Governance Risk</th>
                <th className="p-3 text-center">Compliance Index</th>
                <th className="p-3 text-center">Overdue Items</th>
                <th className="p-3 text-center">Open CAPA</th>
                <th className="p-3 min-w-[200px]">Primary Audited Hazard</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedMines.map((m) => {
                const isCurrent = m.id === hierarchy.mineId;
                const complianceScore = Math.max(50, 100 - Math.round(m.baseline_risk * 0.45));
                const overdueEstimate = Math.max(1, Math.round(m.baseline_risk / 7));
                const openCapaEstimate = Math.max(1, Math.round(m.baseline_risk / 12));

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      isCurrent ? "bg-blue-50/70 font-semibold" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-navy flex items-center gap-1.5">
                        <Mountain className="w-3.5 h-3.5 text-blue" />
                        <span>{m.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.code}</div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 text-[10px]">
                        {m.companyCode}
                      </span>
                    </td>

                    <td className="p-3 text-slate-700">
                      <div>{m.district}, {m.state}</div>
                      <div className="text-[10px] text-slate-400">{m.mine_type}</div>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-black ${
                          m.baseline_risk > 70
                            ? "bg-red text-white"
                            : m.baseline_risk > 60
                            ? "bg-orange text-white"
                            : "bg-green text-white"
                        }`}
                      >
                        {m.baseline_risk} / 100
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-navy">
                      {complianceScore}%
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-red">
                      {overdueEstimate}
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-purple">
                      {openCapaEstimate}
                    </td>

                    <td className="p-3 text-slate-600 text-[11px] leading-snug">
                      {m.primary_issue}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleSelectAndLoad(m.companyCode, m.id, m.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-2xs ${
                          isCurrent
                            ? "bg-blue text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                        }`}
                      >
                        {isCurrent ? "Active" : "Load Mine"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 flex-shrink-0">
          <span>Non-ranking factual metrics. Sourced for SIH 2026 prototype evaluation.</span>
          <button
            onClick={() => setShowCompareMinesModal(false)}
            className="px-4 py-1.5 rounded-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
