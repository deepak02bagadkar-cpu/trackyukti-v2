"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ComplianceItem } from "../../types";
import {
  ShieldCheck,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export const ComplianceView: React.FC = () => {
  const { complianceItems, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<ComplianceItem | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState({
    category: "Safety",
    requirement: "",
    mine_area: "North Pit – Sector B",
    responsible_dept: "Safety",
    due_date: "2026-10-15",
    risk: "MEDIUM",
    statutory_ref: "CMR 2017 Reg 106",
  });

  // Filter items
  const filtered = complianceItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mine_area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLIANT":
        return "bg-green-100 text-green border-green-200";
      case "UPCOMING":
        return "bg-blue-100 text-blue border-blue-200";
      case "AT RISK":
        return "bg-orange-100 text-orange border-orange-200";
      case "OVERDUE":
        return "bg-red-100 text-red border-red-200";
      case "CRITICAL":
        return "bg-red-600 text-white border-red-600 animate-pulse";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return "text-red font-bold";
      case "HIGH":
        return "text-orange font-bold";
      case "MEDIUM":
        return "text-amber-600 font-semibold";
      default:
        return "text-green font-medium";
    }
  };

  const handleCreateCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Compliance Item Registered",
      message: `Statutory requirement "${newItem.requirement.substring(0, 30)}..." added to active surveillance.`,
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue" />
            <span>Compliance Intelligence Register</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Statutory tracking of DGMS Circulars, MoEFCC Conditions, Mines Act 1952, and CIL Policies across all units.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-navy hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Requirement</span>
          </button>
        </div>
      </div>

      {/* Analytics Mini-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Compliance Distribution Donut */}
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Compliance Health</div>
            <div className="text-2xl font-black text-navy mt-1">71.1%</div>
            <div className="text-[11px] text-green font-semibold mt-0.5">91 Compliant / 128 Total</div>
          </div>
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Compliant", value: 91, fill: "#199D69" },
                    { name: "Non-compliant", value: 37, fill: "#E83641" },
                  ]}
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overdue Breakdown */}
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Statutory Latency</div>
            <div className="text-2xl font-black text-red mt-1">11 Overdue</div>
            <div className="text-[11px] text-mineMuted mt-0.5">Safety (4), Contract (3), Env (2)</div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red border border-red-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 6-Month Governance Trend */}
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Statutory Audits (Q3)</div>
            <div className="text-2xl font-black text-purple mt-1">52 Verified</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Average closure: 4.8 days</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple border border-purple-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by requirement, ID, or mine area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-mineBorder rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-mineText"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-mineMuted font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-mineBorder rounded-md px-2.5 py-1 text-xs text-mineText bg-slate-50"
          >
            <option value="All">All Categories</option>
            <option value="Safety">Safety</option>
            <option value="Environment">Environment</option>
            <option value="Labour">Labour</option>
            <option value="Statutory">Statutory</option>
            <option value="Contractor">Contractor</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
          </select>

          <span className="text-mineMuted font-semibold ml-2">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-mineBorder rounded-md px-2.5 py-1 text-xs text-mineText bg-slate-50"
          >
            <option value="All">All Statuses</option>
            <option value="COMPLIANT">COMPLIANT</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="AT RISK">AT RISK</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Showing {filtered.length} of {complianceItems.length}
          </span>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="bg-white rounded-xl border border-mineBorder shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Compliance ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 min-w-[260px]">Statutory Requirement</th>
                <th className="py-3 px-4">Mine Area</th>
                <th className="py-3 px-4">Responsible Dept</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mineBorder text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue">{item.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-navy">{item.requirement}</div>
                    {item.statutory_ref && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.statutory_ref}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{item.mine_area}</td>
                  <td className="py-3 px-4 text-slate-600">{item.responsible_dept}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{item.due_date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] ${getRiskBadge(item.risk)}`}>{item.risk}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{item.last_updated}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedItemDetail(item)}
                      className="px-2 py-1 rounded text-[11px] font-bold text-blue hover:bg-blue-50 border border-blue-200 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-mineBorder pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue">{selectedItemDetail.id}</span>
                <h3 className="text-base font-bold text-navy mt-1">{selectedItemDetail.category} Requirement</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded border text-xs font-bold ${getStatusBadge(selectedItemDetail.status)}`}>
                {selectedItemDetail.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Statutory Mandate:</span>
                <p className="text-navy font-semibold mt-0.5 leading-snug">{selectedItemDetail.requirement}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Mine Area:</span>
                  <span className="text-slate-800 font-bold">{selectedItemDetail.mine_area}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Responsible Dept:</span>
                  <span className="text-slate-800 font-bold">{selectedItemDetail.responsible_dept}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Statutory Due Date:</span>
                  <span className="text-slate-800 font-mono font-bold">{selectedItemDetail.due_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Risk Exposure:</span>
                  <span className={`font-bold ${getRiskBadge(selectedItemDetail.risk)}`}>{selectedItemDetail.risk}</span>
                </div>
              </div>

              {selectedItemDetail.statutory_ref && (
                <div className="text-[11px] text-slate-500 font-mono bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  Statutory Rule Ref: <strong>{selectedItemDetail.statutory_ref}</strong>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-mineBorder">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Requirement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            <h3 className="text-sm font-black text-navy tracking-tight border-b border-mineBorder pb-2">
              Register Statutory Compliance Item
            </h3>

            <form onSubmit={handleCreateCompliance} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Description</label>
                <textarea
                  required
                  rows={3}
                  value={newItem.requirement}
                  onChange={(e) => setNewItem({ ...newItem, requirement: e.target.value })}
                  placeholder="e.g. DGMS quarterly flameproof enclosure testing..."
                  className="w-full p-2 border border-mineBorder rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-mineText"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Environment">Environment</option>
                    <option value="Labour">Labour</option>
                    <option value="Statutory">Statutory</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newItem.responsible_dept}
                    onChange={(e) => setNewItem({ ...newItem, responsible_dept: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Mining">Mining</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Environment">Environment</option>
                    <option value="Contract Management">Contract Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mine Area</label>
                  <input
                    type="text"
                    value={newItem.mine_area}
                    onChange={(e) => setNewItem({ ...newItem, mine_area: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newItem.due_date}
                    onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                    className="w-full p-2 border border-mineBorder rounded-lg text-mineText"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-mineBorder">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white shadow-sm"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
