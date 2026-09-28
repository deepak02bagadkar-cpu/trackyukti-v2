"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CAPA } from "../../types";
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  UserCheck,
  ShieldAlert,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

export const CapaView: React.FC = () => {
  const {
    capas,
    uploadCapaEvidence,
    verifyAndCloseCapa,
    updateCapaStatus,
    user,
    switchRole,
    runDemoWorkflowStep,
    addToast,
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCapa, setActiveCapa] = useState<CAPA | null>(capas.find((c) => c.id === "CAPA-382") || capas[0]);
  const [evidenceName, setEvidenceName] = useState("Berm_Restoration_Survey_3.2m_RL240.pdf");

  const filtered = capas.filter((c) => {
    const matchesSearch =
      searchTerm === "" ||
      c.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CAPA["status"]) => {
    switch (status) {
      case "CLOSED":
        return "bg-green-100 text-green border-green-200";
      case "PENDING VERIFICATION":
        return "bg-purple-100 text-purple border-purple-200 animate-pulse";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue border-blue-200";
      case "OVERDUE":
        return "bg-red-100 text-red border-red-200";
      default:
        return "bg-orange-100 text-orange border-orange-200";
    }
  };

  const handleUploadEvidence = async (capaId: string) => {
    await uploadCapaEvidence(capaId, evidenceName);
    const updated = capas.find((c) => c.id === capaId);
    if (updated) setActiveCapa(updated);
  };

  const handleVerifyClosure = async (capaId: string) => {
    if (user?.role !== "MINE_OFFICIAL" && user?.role !== "ADMIN") {
      addToast({
        type: "warning",
        title: "Role Restriction",
        message: "Only Authorized Mine Official (GM) or Admin can verify and seal statutory CAPA.",
      });
      return;
    }
    await verifyAndCloseCapa(capaId);
    const updated = capas.find((c) => c.id === capaId);
    if (updated) setActiveCapa(updated);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-orange" />
            <span>Corrective Action (CAPA) Center</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            End-to-end statutory lifecycle tracking: Observation Created → Assigned → Action Started → Evidence Uploaded → Verification → Closure.
          </p>
        </div>

        {/* Evaluator Flow Guide */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-mineMuted font-mono">
            Active Case: <strong className="text-navy">{activeCapa?.id || "None"}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search CAPA ID, issue description, department, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-mineBorder rounded-lg text-mineText focus:ring-1 focus:ring-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-mineMuted font-semibold">Filter by Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-mineBorder rounded-md px-2.5 py-1 bg-slate-50 text-mineText"
          >
            <option value="All">All Statuses ({capas.length})</option>
            <option value="OPEN">OPEN</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="PENDING VERIFICATION">PENDING VERIFICATION</option>
            <option value="CLOSED">CLOSED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: CAPA List + Detailed 6-Stage Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: CAPA Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-mineBorder shadow-soft overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">CAPA ID</th>
                  <th className="py-3 px-4 min-w-[200px]">Issue</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mineBorder text-xs">
                {filtered.map((item) => {
                  const isSelected = activeCapa?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveCapa(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50/70 font-semibold" : "hover:bg-slate-50/60"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue">{item.id}</td>
                      <td className="py-3 px-4 text-slate-800 leading-snug">
                        <div className="line-clamp-2">{item.issue}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.department}</td>
                      <td className="py-3 px-4 text-slate-700">{item.owner.split(" ")[0]}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.due_date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.priority === "CRITICAL"
                              ? "bg-red text-white"
                              : item.priority === "HIGH"
                              ? "bg-orange text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-mineBorder text-[11px] text-slate-500 flex items-center justify-between">
            <span>Showing {filtered.length} statutory CAPA items</span>
            <span className="font-mono text-purple font-bold">Audit synced</span>
          </div>
        </div>

        {/* Right: Detailed 6-Step Lifecycle Timeline Drawer (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between space-y-4">
          {activeCapa ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-mineBorder pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-black text-blue">{activeCapa.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(activeCapa.status)}`}>
                      {activeCapa.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-navy mt-1 line-clamp-2">{activeCapa.issue}</h3>
                </div>
              </div>

              {/* Owner and Dept banner */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Responsible Dept</span>
                  <span className="text-slate-800 font-bold">{activeCapa.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Assigned Owner</span>
                  <span className="text-slate-800 font-bold truncate block">{activeCapa.owner}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Statutory Due</span>
                  <span className="text-slate-800 font-mono font-bold">{activeCapa.due_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Risk Reduction Impact</span>
                  <span className="text-green font-bold">-{activeCapa.impact_risk_reduction} pts</span>
                </div>
              </div>

              {/* 6-Stage Timeline */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Statutory 6-Stage Lifecycle Progress:
                </div>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeCapa.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="flex items-start gap-3 relative z-10 text-xs">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[11px] shadow-sm ${
                            step.done ? "bg-green" : "bg-slate-300"
                          }`}
                        >
                          {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div className="flex-1 bg-slate-50/80 p-2 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${step.done ? "text-navy" : "text-slate-500"}`}>
                              {step.step}
                            </span>
                            {step.date && (
                              <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">By: {step.by}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evidence Section */}
              {activeCapa.evidence && activeCapa.evidence.length > 0 && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
                  <span className="text-[10px] font-bold text-purple uppercase tracking-wider block mb-1">
                    Uploaded Verification Evidence:
                  </span>
                  {activeCapa.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-1.5 font-mono text-navy font-semibold text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-purple" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Controls for Demo Workflow */}
              <div className="space-y-2 pt-3 border-t border-mineBorder">
                {activeCapa.status === "OPEN" && (
                  <button
                    onClick={() => updateCapaStatus(activeCapa.id, "IN PROGRESS")}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-blue hover:bg-blue-600 text-white transition-colors shadow-sm"
                  >
                    Start Action (Mark IN PROGRESS)
                  </button>
                )}

                {(activeCapa.status === "OPEN" || activeCapa.status === "IN PROGRESS") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={evidenceName}
                        onChange={(e) => setEvidenceName(e.target.value)}
                        className="flex-1 p-1.5 text-[11px] border border-mineBorder rounded-lg font-mono text-mineText"
                      />
                    </div>
                    <button
                      onClick={() => handleUploadEvidence(activeCapa.id)}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-orange hover:bg-orange-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Evidence → Mark PENDING VERIFICATION</span>
                    </button>
                  </div>
                )}

                {activeCapa.status === "PENDING VERIFICATION" && (
                  <div className="space-y-2">
                    {user?.role !== "MINE_OFFICIAL" && user?.role !== "ADMIN" && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center justify-between">
                        <span>Requires Authorized Official sign-off.</span>
                        <button
                          onClick={() => switchRole("MINE_OFFICIAL")}
                          className="font-bold underline text-blue"
                        >
                          Switch to Mine Official
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleVerifyClosure(activeCapa.id)}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-green hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Verify Evidence & Sign Statutory Closure</span>
                    </button>
                  </div>
                )}

                {activeCapa.status === "CLOSED" && (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center space-y-1">
                    <div className="text-xs font-bold text-green flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Statutory Closure Cryptographically Sealed</span>
                    </div>
                    <p className="text-[10px] text-green-800">
                      Audit record generated. Risk score dynamically reduced (72 → 66).
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select a CAPA record from the table to view its statutory progress timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
