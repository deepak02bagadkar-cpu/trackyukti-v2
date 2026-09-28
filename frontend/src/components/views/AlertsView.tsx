"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AlertItem } from "../../types";
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Send,
  Eye,
  ShieldAlert,
  Cpu,
  FileText,
  UserCheck,
} from "lucide-react";

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, escalateAlert, setActiveTab, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAlertDetail, setActiveAlertDetail] = useState<AlertItem | null>(null);

  const filtered = alerts.filter((a) => {
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: AlertItem["category"]) => {
    switch (cat) {
      case "CRITICAL":
        return "bg-red text-white";
      case "DEADLINE":
        return "bg-orange-100 text-orange border-orange-200";
      case "OVERDUE":
        return "bg-red-100 text-red border-red-200";
      case "AI RISK":
        return "bg-purple-100 text-purple border-purple-200";
      case "DOCUMENT EXPIRY":
        return "bg-amber-100 text-amber-900 border-amber-200";
      default:
        return "bg-blue-100 text-blue border-blue-200";
    }
  };

  const handleAction = async (alert: AlertItem, action: "ACKNOWLEDGE" | "ESCALATE" | "VIEW") => {
    if (action === "ACKNOWLEDGE") {
      await acknowledgeAlert(alert.id);
    } else if (action === "ESCALATE") {
      await escalateAlert(alert.id);
    } else {
      setActiveAlertDetail(alert);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-red" />
            <span>Statutory Alerts & Escalation Center</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Real-time critical event dispatching, DGMS deadline alerts, and automated managerial escalations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red border border-red-200">
            {alerts.filter((a) => a.status === "UNACKNOWLEDGED").length} Unacknowledged Alerts
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by title, source, or assigned officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-mineBorder rounded-lg text-mineText focus:ring-1 focus:ring-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-mineMuted font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-mineBorder rounded-md px-2.5 py-1 bg-slate-50 text-mineText"
          >
            <option value="All">All Categories ({alerts.length})</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="DEADLINE">DEADLINE</option>
            <option value="OVERDUE">OVERDUE</option>
            <option value="AI RISK">AI RISK</option>
            <option value="INSPECTION">INSPECTION</option>
            <option value="DOCUMENT EXPIRY">DOCUMENT EXPIRY</option>
          </select>
        </div>
      </div>

      {/* Alerts Table (Section 18) */}
      <div className="bg-white rounded-xl border border-mineBorder shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-mineBorder text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 min-w-[280px]">Alert Title & Description</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mineBorder text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryBadge(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.description}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{item.source}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                  <td className="py-3 px-4 text-slate-700">{item.assigned_to}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        item.status === "UNACKNOWLEDGED"
                          ? "bg-red-50 text-red border-red-200"
                          : item.status === "ESCALATED"
                          ? "bg-orange-50 text-orange border-orange-200"
                          : "bg-green-50 text-green border-green-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.status === "UNACKNOWLEDGED" && (
                        <button
                          onClick={() => handleAction(item, "ACKNOWLEDGE")}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-green hover:bg-green-600 text-white transition-colors"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(item, "ESCALATE")}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 hover:bg-red-50 text-red border border-red-200 transition-colors"
                      >
                        ESCALATE
                      </button>
                      <button
                        onClick={() => handleAction(item, "VIEW")}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-white hover:bg-slate-100 text-navy border border-slate-300 transition-colors"
                      >
                        VIEW
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {activeAlertDetail && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-mineBorder pb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryBadge(activeAlertDetail.category)}`}>
                {activeAlertDetail.category}
              </span>
              <span className="text-xs font-mono text-slate-400">{activeAlertDetail.time}</span>
            </div>

            <div>
              <h3 className="text-sm font-black text-navy">{activeAlertDetail.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeAlertDetail.description}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Trigger Source:</span>
                <span className="font-semibold text-slate-800">{activeAlertDetail.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Responsible Official:</span>
                <span className="font-semibold text-slate-800">{activeAlertDetail.assigned_to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-navy">{activeAlertDetail.status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-mineBorder">
              <button
                onClick={() => setActiveAlertDetail(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
