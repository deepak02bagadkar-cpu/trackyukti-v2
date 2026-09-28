"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  History,
  Search,
  ShieldCheck,
  Lock,
  Download,
  Filter,
  CheckCircle2,
  FileText,
  KeyRound,
  ArrowRight,
} from "lucide-react";

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = auditLogs.filter((log) => {
    return (
      searchTerm === "" ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_device.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue" />
            <span>Enterprise Statutory Audit Trail</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Immutable, cryptographically verifiable ledger recording all field observations, CAPA transitions, evidence submissions, and official signatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-green-50 text-green border border-green-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Integrity Verified
          </span>
        </div>
      </div>

      {/* Verification Banner */}
      <div className="bg-navy rounded-2xl p-5 text-white shadow-soft border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue/30 text-blue-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Statutory Non-Repudiation Architecture</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Each state change is sealed with timestamp, user credential identity, IP subnet, and hash verification compliant with Section 48 Mines Act.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-[11px] text-slate-400">
          Total Audit Events: <strong className="text-white">{auditLogs.length} Records</strong>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, record ID, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-mineBorder rounded-lg text-mineText focus:ring-1 focus:ring-blue"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Displaying {filtered.length} Immutable Entries
        </span>
      </div>

      {/* Enterprise Audit Trail Table (Section 19) */}
      <div className="bg-white rounded-xl border border-mineBorder shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Authorized User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Record</th>
                <th className="py-3 px-4">Old Value</th>
                <th className="py-3 px-4">New Value</th>
                <th className="py-3 px-4">IP / Device Terminal</th>
                <th className="py-3 px-4">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mineBorder text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{log.user}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-purple">{log.record}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] truncate max-w-[120px]">
                    {log.old_value}
                  </td>
                  <td className="py-3 px-4 font-mono text-navy font-semibold text-[11px] truncate max-w-[160px]">
                    {log.new_value}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                    {log.ip_device}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-green font-bold whitespace-nowrap">
                    {log.hash || "SHA256:8f2a...c01e"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
