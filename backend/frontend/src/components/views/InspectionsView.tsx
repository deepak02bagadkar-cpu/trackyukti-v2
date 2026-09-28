"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Inspection } from "../../types";
import {
  ClipboardList,
  Search,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  Camera,
  Upload,
  User,
  Flame,
  Shield,
} from "lucide-react";

export const InspectionsView: React.FC = () => {
  const { inspections, createInspection, addToast, capas } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  // New Inspection form state
  const [form, setForm] = useState({
    mine: "North Block Open Cast Mine",
    area: "North Pit – Sector B",
    type: "Safety & DGMS Audit",
    observations: "",
    severity: "Critical",
    location_coords: "23.3149° N, 75.8577° E",
    remarks: "Berm height below statutory 3m threshold; brake retarder warning recorded on 100T dumper #408.",
    photoName: "Site_Survey_Berm_Defect.jpg",
  });

  const todayCount = inspections.filter((i) => i.date === "2026-09-24").length || 4;
  const pendingCount = inspections.filter((i) => i.status === "Action Required" || i.status === "Under Review").length || 9;
  const criticalCount = inspections.filter((i) => i.risk === "CRITICAL").length || 6;
  const openCapasCount = capas.filter((c) => c.status !== "CLOSED").length || 24;

  const filtered = inspections.filter((i) => {
    const matchesSearch =
      searchTerm === "" ||
      i.observations.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "All" || i.severity === severityFilter || i.risk === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.observations) {
      form.observations = "Berm erosion noted along haul ramp with brake interlock telemetry warning.";
    }
    await createInspection({
      mine: form.mine,
      area: form.area,
      type: form.type,
      observations: form.observations,
      severity: form.severity,
      location_coords: form.location_coords,
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue" />
            <span>Statutory Inspection Management</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Official DGMS pit checks, HEMM safety audits, geotechnical radar telemetry, and ventilation surveys.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-navy hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>NEW INSPECTION</span>
        </button>
      </div>

      {/* 4 Cards (Section 10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Today&apos;s Inspections</div>
            <div className="text-2xl font-black text-navy mt-1">{todayCount}</div>
            <div className="text-[10px] text-green font-semibold mt-0.5">All statutory shifts active</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue border border-blue-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Inspections</div>
            <div className="text-2xl font-black text-orange mt-1">{pendingCount}</div>
            <div className="text-[10px] text-orange font-semibold mt-0.5">Awaiting sign-off</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange border border-orange-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Critical Observations</div>
            <div className="text-2xl font-black text-red mt-1">{criticalCount}</div>
            <div className="text-[10px] text-red font-semibold mt-0.5">High hazard priority</div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red border border-red-100">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Open Corrective Actions</div>
            <div className="text-2xl font-black text-purple mt-1">{openCapasCount}</div>
            <div className="text-[10px] text-purple font-semibold mt-0.5">Linked to audit logs</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple border border-purple-100">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inspections by area, inspector, observation keyword, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-mineBorder rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-mineText"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-mineMuted font-semibold">Severity Filter:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-mineBorder rounded-md px-2.5 py-1 text-xs text-mineText bg-slate-50"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Showing {filtered.length} of {inspections.length}
          </span>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-xl border border-mineBorder shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 min-w-[280px]">Observations</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mineBorder text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue">{item.id}</td>
                  <td className="py-3 px-4 font-semibold text-navy">{item.inspector}</td>
                  <td className="py-3 px-4 text-slate-700">{item.area}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[10px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-snug">
                    <div>{item.observations}</div>
                    {item.location_coords && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-orange" />
                        <span>{item.location_coords}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.risk === "CRITICAL"
                          ? "bg-red text-white"
                          : item.risk === "HIGH"
                          ? "bg-orange-100 text-orange"
                          : item.risk === "MEDIUM"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green"
                      }`}
                    >
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.status === "Action Required"
                          ? "bg-red-50 text-red border-red-200"
                          : item.status === "Under Review"
                          ? "bg-orange-50 text-orange border-orange-200"
                          : "bg-green-50 text-green border-green-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-mineBorder pb-2">
              <h3 className="text-sm font-black text-navy tracking-tight flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-orange" />
                <span>Register New Field Inspection</span>
              </h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">
                Auto-assigned ID & Timestamp
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mine</label>
                  <input
                    type="text"
                    value={form.mine}
                    disabled
                    className="w-full p-2 bg-slate-50 border border-mineBorder rounded-lg text-mineMuted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area / Sector</label>
                  <select
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  >
                    <option value="North Pit – Sector B">North Pit – Sector B</option>
                    <option value="North Pit Haul Road">North Pit Haul Road</option>
                    <option value="Central Pit Seam 4">Central Pit Seam 4</option>
                    <option value="Coal Handling Plant">Coal Handling Plant</option>
                    <option value="OB Dump #4 Crest">OB Dump #4 Crest</option>
                    <option value="Main Workshop Bay 2">Main Workshop Bay 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspection Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  >
                    <option value="Safety & DGMS Audit">Safety & DGMS Audit</option>
                    <option value="Ventilation & Gas">Ventilation & Gas</option>
                    <option value="HEMM & Haulage">HEMM & Haulage</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Electrical Statutory">Electrical Statutory</option>
                    <option value="Geotechnical / Slope">Geotechnical / Slope</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity Rating</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg font-bold text-red"
                  >
                    <option value="Critical">Critical (Immediate Halt/Action)</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low (Routine Compliant)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Observation</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record precise statutory observation, equipment tag, or physical measurements..."
                  value={form.observations}
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
                  className="w-full p-2 border border-mineBorder rounded-lg text-mineText focus:ring-1 focus:ring-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GPS Coordinates</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-orange absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={form.location_coords}
                      onChange={(e) => setForm({ ...form, location_coords: e.target.value })}
                      className="w-full pl-8 pr-2 py-1.5 border border-mineBorder rounded-lg font-mono text-[11px] text-mineText"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evidence / Photo Upload</label>
                  <div className="flex items-center gap-2 p-1.5 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                    <Camera className="w-4 h-4 text-blue" />
                    <span className="truncate">{form.photoName}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Remarks & Notes</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-mineBorder">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white shadow-sm"
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
