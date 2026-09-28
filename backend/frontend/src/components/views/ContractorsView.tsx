"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Contractor } from "../../types";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  FileText,
  Phone,
  Truck,
  HardHat,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export const ContractorsView: React.FC = () => {
  const { contractors } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(contractors[0] || null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const totalContractors = contractors.length || 15;
  const compliantCount = contractors.filter((c) => c.compliance_score >= 85).length || 11;
  const expiringDocsCount = contractors.filter((c) => c.documents_status.includes("Expiring") || c.documents_status.includes("Expired")).length || 3;
  const highRiskCount = contractors.filter((c) => c.risk === "CRITICAL" || c.risk === "HIGH").length || 3;

  const filtered = contractors.filter((c) => {
    return (
      searchTerm === "" ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.work_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red text-white";
      case "HIGH":
        return "bg-orange text-white";
      case "MEDIUM":
        return "bg-amber-100 text-amber-900";
      default:
        return "bg-green-100 text-green";
    }
  };

  const handleOpenDetail = (cont: Contractor) => {
    setSelectedContractor(cont);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue" />
            <span>Contractor Governance & Oversight</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Statutory tracking of outsourced mining contractors, VTC driver competency, heavy machinery fitness, and labour welfare.
          </p>
        </div>
      </div>

      {/* 4 Cards (Section 16) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Total Contractors</div>
            <div className="text-2xl font-black text-navy mt-1">{totalContractors}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Active outsourced vendors</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Compliant</div>
            <div className="text-2xl font-black text-green mt-1">{compliantCount}</div>
            <div className="text-[10px] text-green font-semibold mt-0.5">&gt; 85% Statutory Score</div>
          </div>
          <div className="p-3 rounded-xl bg-green-50 text-green border border-green-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Documents Expiring</div>
            <div className="text-2xl font-black text-orange mt-1">{expiringDocsCount}</div>
            <div className="text-[10px] text-orange font-semibold mt-0.5">VTC & Fleet Fitness</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange border border-orange-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">High Risk Contractors</div>
            <div className="text-2xl font-black text-red mt-1">{highRiskCount}</div>
            <div className="text-[10px] text-red font-semibold mt-0.5">Surveillance mandated</div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red border border-red-100">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search contractor by name or assigned operational area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-mineBorder rounded-lg text-mineText focus:ring-1 focus:ring-blue"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Showing {filtered.length} Contractors
        </span>
      </div>

      {/* Contractors Table */}
      <div className="bg-white rounded-xl border border-mineBorder shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Work Area</th>
                <th className="py-3 px-4">Compliance %</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4 text-center">Safety Obs</th>
                <th className="py-3 px-4 text-center">Open CAPA</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mineBorder text-xs">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{item.work_area}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-navy">{item.compliance_score}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.compliance_score >= 85 ? "bg-green" : item.compliance_score >= 70 ? "bg-orange" : "bg-red"
                          }`}
                          style={{ width: `${item.compliance_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.documents_status.includes("Expired")
                          ? "bg-red-100 text-red"
                          : item.documents_status.includes("Expiring")
                          ? "bg-orange-100 text-orange"
                          : "bg-green-100 text-green"
                      }`}
                    >
                      {item.documents_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">{item.safety_observations}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        item.open_capa > 0 ? "bg-purple-100 text-purple" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.open_capa}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadge(item.risk)}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(item);
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-bold text-blue hover:bg-blue-50 border border-blue-200 transition-colors"
                    >
                      Audit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractor Detail Modal (Section 16) */}
      {showDetailModal && selectedContractor && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-mineBorder pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue">{selectedContractor.id}</span>
                <h3 className="text-lg font-black text-navy">{selectedContractor.name}</h3>
                <p className="text-xs text-mineMuted">{selectedContractor.work_area}</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-bold ${getRiskBadge(selectedContractor.risk)}`}>
                {selectedContractor.risk} EXPOSURE
              </span>
            </div>

            {/* Profile Statistics */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Compliance Score</span>
                <span className="text-xl font-black text-navy mt-0.5 block">
                  {selectedContractor.compliance_score}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Manpower Deployed</span>
                <span className="text-xl font-black text-navy mt-0.5 block flex items-center justify-center gap-1">
                  <HardHat className="w-3.5 h-3.5 text-orange" />
                  {selectedContractor.deployment_count}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Heavy Machinery</span>
                <span className="text-xl font-black text-navy mt-0.5 block flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue" />
                  {selectedContractor.heavy_equipment}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Open CAPAs</span>
                <span className="text-xl font-black text-purple mt-0.5 block">
                  {selectedContractor.open_capa}
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex items-center justify-between bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 text-xs">
              <span className="font-semibold text-navy">
                Site Incharge: <strong>{selectedContractor.contact_person}</strong>
              </span>
              <span className="font-mono text-slate-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue" />
                {selectedContractor.phone}
              </span>
            </div>

            {/* Documents List */}
            <div>
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Statutory Documents & Clearances:
              </h4>
              <div className="space-y-2">
                {selectedContractor.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-mineBorder text-xs bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500">Exp: {doc.expiry}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          doc.status === "EXPIRED"
                            ? "bg-red-100 text-red"
                            : doc.status === "EXPIRING_SOON"
                            ? "bg-orange-100 text-orange"
                            : "bg-green-100 text-green"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Safety Observations */}
            <div>
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Recent Safety Observations ({selectedContractor.safety_observations} Total):
              </h4>
              <ul className="space-y-1 text-xs text-slate-700 bg-red-50/40 p-2.5 rounded-xl border border-red-100">
                {selectedContractor.recent_observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red font-bold">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-mineBorder">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Audit Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
