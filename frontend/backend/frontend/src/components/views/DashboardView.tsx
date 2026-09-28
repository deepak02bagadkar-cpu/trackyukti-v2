"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  Activity,
  Layers,
  FileText,
  UserCheck,
  Send,
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
  Legend,
} from "recharts";

export const DashboardView: React.FC = () => {
  const {
    riskScore,
    complianceItems,
    capas,
    inspections,
    setActiveTab,
    createCapa,
    runDemoWorkflowStep,
    addToast,
    user,
  } = useApp();

  const [selectedQueueItem, setSelectedQueueItem] = useState<any>(null);

  // KPIs
  const totalCount = complianceItems.length || 128;
  const compliantCount = complianceItems.filter((i) => i.status === "COMPLIANT").length || 91;
  const atRiskCount = complianceItems.filter((i) => i.status === "AT RISK").length || 18;
  const overdueCount = complianceItems.filter((i) => i.status === "OVERDUE").length || 11;
  const criticalCount = complianceItems.filter((i) => i.status === "CRITICAL" || i.risk === "CRITICAL").length || 8;
  const openCapasCount = capas.filter((c) => c.status !== "CLOSED").length || 24;

  const kpis = [
    {
      title: "TOTAL COMPLIANCE ITEMS",
      value: totalCount,
      trend: "+4 this month",
      trendType: "neutral",
      desc: "Active statutory obligations under DGMS/MoEFCC surveillance",
      icon: ShieldCheck,
      color: "text-blue",
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      title: "COMPLIANT",
      value: compliantCount,
      trend: "71.1% on track",
      trendType: "up",
      desc: "Validated in field inspections & statutory documentation",
      icon: CheckCircle2,
      color: "text-green",
      bgColor: "bg-green-50 border-green-100",
    },
    {
      title: "AT RISK",
      value: atRiskCount,
      trend: "+3 warning states",
      trendType: "down",
      desc: "Approaching deadlines or preliminary audit alerts",
      icon: AlertTriangle,
      color: "text-orange",
      bgColor: "bg-orange-50 border-orange-100",
    },
    {
      title: "OVERDUE",
      value: overdueCount,
      trend: "Immediate escalation",
      trendType: "down",
      desc: "Past statutory submission due dates requiring action",
      icon: Clock,
      color: "text-red",
      bgColor: "bg-red-50 border-red-100",
    },
    {
      title: "CRITICAL",
      value: criticalCount,
      trend: "Safety priority",
      trendType: "down",
      desc: "Critical haulage, slope stability & FLP non-conformances",
      icon: Flame,
      color: "text-red",
      bgColor: "bg-red-50 border-red-200",
    },
    {
      title: "CORRECTIVE ACTIONS",
      value: openCapasCount,
      trend: "Active CAPA cases",
      trendType: "neutral",
      desc: "Open CAPA remediation workflows across departments",
      icon: Layers,
      color: "text-purple",
      bgColor: "bg-purple-50 border-purple-100",
    },
  ];

  // Chart data
  const statusPieData = [
    { name: "Compliant", value: compliantCount, fill: "#199D69" },
    { name: "At Risk", value: atRiskCount, fill: "#F26914" },
    { name: "Overdue", value: overdueCount, fill: "#E83641" },
    { name: "Upcoming", value: Math.max(0, totalCount - (compliantCount + atRiskCount + overdueCount)), fill: "#1869BE" },
  ];

  const deptOverdueData = [
    { dept: "Safety", count: 4, fill: "#E83641" },
    { dept: "Mining", count: 3, fill: "#F26914" },
    { dept: "Contract", count: 3, fill: "#E83641" },
    { dept: "Environment", count: 2, fill: "#1869BE" },
    { dept: "Electrical", count: 2, fill: "#F26914" },
    { dept: "Mechanical", count: 1, fill: "#199D69" },
    { dept: "HR", count: 1, fill: "#6543AC" },
  ];

  const trendData = riskScore.trend_history || [
    { period: "Week 1", score: 64, benchmark: 50 },
    { period: "Week 2", score: 68, benchmark: 50 },
    { period: "Week 3", score: 70, benchmark: 50 },
    { period: "Week 4", score: riskScore.score, benchmark: 50 },
  ];

  // Priority queue items
  const priorityQueue = [
    {
      id: "PQ-01",
      title: "High-risk safety observation",
      location: "North Pit – Sector B",
      priority: "CRITICAL",
      reason: "Recurring haul road berm failure and dumper brake retarder telemetry fault (4 occurrences).",
      owner: "Safety Department / Vikramaditya Sen",
      deadline: "2026-09-30",
      associatedCapa: "CAPA-382",
      capaStatus: capas.find((c) => c.id === "CAPA-382")?.status || "OPEN",
    },
    {
      id: "PQ-02",
      title: "Recurring contractor compliance issue",
      location: "Vehicle Dispatch Yard",
      contractor: "ABC Mining Services",
      priority: "HIGH",
      reason: "14 hauler drivers operating with expired DGMS VTC certificates & AVAS defect.",
      owner: "Contract Management / Deepak Rawat",
      deadline: "2026-09-26",
      associatedCapa: "CAPA-380",
      capaStatus: capas.find((c) => c.id === "CAPA-380")?.status || "OVERDUE",
    },
    {
      id: "PQ-03",
      title: "Environmental documentation overdue",
      location: "Coal Handling Plant (CHP)",
      priority: "HIGH",
      reason: "MoEFCC Half-Yearly Environmental Clearance Compliance Return overdue by 4 days.",
      owner: "Environment Dept / Sunil Kashyap",
      deadline: "2026-09-28",
      associatedCapa: "CAPA-381",
      capaStatus: capas.find((c) => c.id === "CAPA-381")?.status || "IN PROGRESS",
    },
    {
      id: "PQ-04",
      title: "Inspection deadline approaching",
      location: "Main Workshop Bay 2 & Substation",
      priority: "MEDIUM",
      reason: "Quarterly 33kV earth pit resistance testing & FLP certificate re-verification.",
      owner: "Electrical Dept / Ananya Deshmukh",
      deadline: "2026-09-29",
      associatedCapa: null,
      capaStatus: "UPCOMING",
    },
  ];

  const handleQueueAction = (item: any, action: "VIEW" | "ASSIGN" | "ESCALATE") => {
    if (item.id === "PQ-01") {
      if (action === "VIEW" || action === "ASSIGN") {
        // Run evaluator flow to create / inspect CAPA
        runDemoWorkflowStep(3);
      } else {
        addToast({
          type: "warning",
          title: "Urgent Escalation Filed",
          message: "Statutory notice forwarded to Mine General Manager and DGMS Regional Office.",
        });
      }
    } else {
      addToast({
        type: "info",
        title: `${action} Triggered`,
        message: `Action recorded for ${item.title} (${item.location}).`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-navy tracking-tight">
              Smart Mine Governance Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue border border-blue-200">
              Live Statutory Telemetry
            </span>
          </div>
          <p className="text-xs text-mineMuted mt-1">
            Real-time compliance surveillance, AI-prioritized hazard detection, and auditable governance workflows for
            Indian Coal Mines.
          </p>
        </div>

        {/* Evaluator Shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => runDemoWorkflowStep(2)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple text-white hover:bg-purple-600 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Evaluator Storyline</span>
          </button>
        </div>
      </div>

      {/* Dynamic Score Impact Assessment Banner (Visible upon verified CAPA closure) */}
      {riskScore.is_capa_closed && (
        <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border border-green-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-navy">
                  Governance Risk Dynamically Reduced: 72 → 66 / 100
                </span>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                  -6.0 Risk Points Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Statutory CAPA-382 closed by General Manager Vikramaditya Sen. North Pit Sector B haul ramp berm reconstructed to 3.2m RL 240, and dumper brake retarder telemetry recalibrated.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 line-through">
              Baseline: 72
            </div>
            <span className="text-slate-400 font-bold">→</span>
            <div className="px-3 py-1.5 rounded-lg bg-green text-white font-bold shadow-sm">
              Current: 66 (Moderate)
            </div>
          </div>
        </div>
      )}

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border bg-white shadow-soft transition-all hover:shadow-card flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    kpi.trendType === "up"
                      ? "bg-green-100 text-green"
                      : kpi.trendType === "down"
                      ? "bg-red-100 text-red"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {kpi.trend}
                </span>
              </div>

              <div className="mt-2.5">
                <div className="text-2xl font-black text-navy">{kpi.value}</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate mt-0.5">
                  {kpi.title}
                </div>
                <div className="text-[10px] text-mineMuted mt-1 leading-tight line-clamp-2">{kpi.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Section: AI Risk Score (Section 7) + AI Priority Queue (Section 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: MINE GOVERNANCE RISK SCORE (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between relative overflow-hidden">
          {/* Risk Level Accent Header */}
          <div className="flex items-center justify-between border-b border-mineBorder pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-navy tracking-tight">MINE GOVERNANCE RISK SCORE</h3>
                <p className="text-[11px] text-mineMuted">Multi-factor decision-support index</p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border ${
                riskScore.score > 70
                  ? "bg-red-50 text-red border-red-200 animate-pulse"
                  : riskScore.score > 60
                  ? "bg-orange-50 text-orange border-orange-200"
                  : "bg-green-50 text-green border-green-200"
              }`}
            >
              {riskScore.level}
            </span>
          </div>

          {/* Central Gauge & Big Score */}
          <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Visual Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="9" fill="transparent" />
                {/* Filled Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={riskScore.score > 70 ? "#E83641" : riskScore.score > 60 ? "#F26914" : "#199D69"}
                  strokeWidth="9"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * riskScore.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-navy tracking-tighter">{riskScore.score}</span>
                <span className="text-[11px] font-bold text-slate-400">/ 100</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">
                  Index Rating
                </span>
              </div>
            </div>

            {/* Score Meta & Dynamic Change Indicator */}
            <div className="flex-1 space-y-2.5">
              <div
                className={`p-3 rounded-xl border text-xs font-semibold ${
                  riskScore.is_capa_closed
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  {riskScore.is_capa_closed ? (
                    <CheckCircle2 className="w-4 h-4 text-green" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red" />
                  )}
                  <span>{riskScore.change_note}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {riskScore.is_capa_closed
                    ? "Sector B haulage berm verified compliant. Recurring violation factor closed."
                    : "Elevated due to recurring observations in North Pit and 3 overdue CAPAs."}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700 not-italic">Statutory Notice: </span>
                AI-generated decision-support indicator. Not a substitute for statutory DGMS inspection or judicial
                review.
              </div>
            </div>
          </div>

          {/* Breakdown Component Bars */}
          <div className="space-y-2.5 pt-4 border-t border-mineBorder">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Risk Factor Breakdown</span>
              <span className="text-[11px] text-mineMuted font-normal">Weighted contributions</span>
            </div>
            {riskScore.components.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">{comp.name}</span>
                  <span className="font-mono text-slate-500 font-bold">
                    {comp.score.toFixed(1)} / {comp.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      comp.score / comp.max > 0.7
                        ? "bg-red"
                        : comp.score / comp.max > 0.4
                        ? "bg-orange"
                        : "bg-blue"
                    }`}
                    style={{ width: `${(comp.score / comp.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI PRIORITY QUEUE (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-mineBorder pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-navy tracking-tight">AI PRIORITY QUEUE</h3>
                  <p className="text-[11px] text-mineMuted">Automated risk escalation requiring immediate intervention</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("ai-risk")}
                className="text-xs font-bold text-blue hover:text-navy flex items-center gap-1"
              >
                <span>Deep Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {priorityQueue.map((item, idx) => {
                const isCritical = item.priority === "CRITICAL";
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all hover:border-slate-400 ${
                      isCritical
                        ? "border-red-200 bg-red-50/40"
                        : item.priority === "HIGH"
                        ? "border-orange-200 bg-orange-50/30"
                        : "border-slate-200 bg-slate-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              isCritical ? "bg-red text-white" : item.priority === "HIGH" ? "bg-orange text-white" : "bg-blue text-white"
                            }`}
                          >
                            {item.priority}
                          </span>
                          <h4 className="text-xs font-bold text-navy">{item.title}</h4>
                        </div>

                        <div className="text-[11px] text-slate-700 font-medium">
                          <span className="text-slate-500">Location/Zone: </span>
                          <span className="font-semibold text-navy">{item.location}</span>
                          {item.contractor && (
                            <span className="ml-2 text-slate-500">
                              | Contractor: <strong className="text-navy">{item.contractor}</strong>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 leading-snug">{item.reason}</p>

                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1">
                          <span>
                            Owner: <strong className="text-slate-700">{item.owner}</strong>
                          </span>
                          <span>
                            Statutory Due: <strong className="text-slate-700">{item.deadline}</strong>
                          </span>
                          {item.associatedCapa && (
                            <span className="font-mono text-purple font-bold">
                              Status: {item.capaStatus}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons matching prompt */}
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleQueueAction(item, "VIEW")}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-white hover:bg-slate-100 text-navy border border-slate-300 transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>VIEW</span>
                        </button>

                        <button
                          onClick={() => handleQueueAction(item, "ASSIGN")}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-blue hover:bg-blue-600 text-white transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>ASSIGN</span>
                        </button>

                        <button
                          onClick={() => handleQueueAction(item, "ESCALATE")}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-white hover:bg-red-50 text-red border border-red-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>ESCALATE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-mineBorder text-[11px] text-slate-500 flex items-center justify-between">
            <span>Connected to automated DGMS rule-engine & sensor anomaly detectors</span>
            <button
              onClick={() => setActiveTab("mine-map")}
              className="font-bold text-blue hover:underline flex items-center gap-1"
            >
              <span>View On Mine GIS Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visualizations Grid (Section 22) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Status Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-mineBorder shadow-soft flex flex-col justify-between">
          <div className="border-b border-mineBorder pb-3 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Compliance Status Distribution</h3>
            <span className="text-[10px] font-mono text-slate-400">Total: 128</span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Items`, name]}
                  contentStyle={{ backgroundColor: "#10264C", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-mineBorder">
            {statusPieData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }}></span>
                <span className="text-slate-600">{s.name}:</span>
                <strong className="text-navy">{s.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Department-wise Overdue Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-mineBorder shadow-soft flex flex-col justify-between">
          <div className="border-b border-mineBorder pb-3 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Overdue Items by Department</h3>
            <span className="text-[10px] text-red font-semibold">11 Actionable</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptOverdueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Overdue`, "Count"]}
                  contentStyle={{ backgroundColor: "#10264C", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {deptOverdueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-mineBorder flex items-center justify-between">
            <span>Highest latency: Safety & Contract Mgmt</span>
            <button onClick={() => setActiveTab("compliance")} className="text-blue font-bold hover:underline">
              View Items
            </button>
          </div>
        </div>

        {/* Compliance Trend Line Chart */}
        <div className="bg-white rounded-2xl p-5 border border-mineBorder shadow-soft flex flex-col justify-between">
          <div className="border-b border-mineBorder pb-3 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Governance Risk Trend</h3>
            <span className="text-[10px] font-mono text-purple font-semibold">Q3 2026</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`Risk Score: ${val}`, "Rating"]}
                  contentStyle={{ backgroundColor: "#10264C", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#E83641"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#E83641" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#199D69"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-mineBorder flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-green-500"></span> Statutory Safe Ceiling (50)
            </span>
            <span className="text-red font-bold">Current: {riskScore.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
