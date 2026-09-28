"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Cpu,
  Flame,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Eye,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Activity,
  ShieldCheck,
  History,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export const AiRiskView: React.FC = () => {
  const { riskScore, patterns, runDemoWorkflowStep, addToast } = useApp();
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const pattern = patterns[0] || {
    id: "PAT-01",
    category: "Safety & Haulage Berm Stability",
    location: "North Pit – Sector B",
    occurrences: 4,
    first_detected: "12 Aug 2026",
    latest_detected: "24 Sep 2026",
    ai_priority: "HIGH",
    summary: "Similar safety observations have been recorded 4 times in the same operational category during the selected period.",
    recommended_action: "Review root cause and verify effectiveness of corrective action.",
    historical_records: [
      { date: "12 Aug 2026", id: "INS-2014", inspector: "Rahul Verma", observation: "Berm height on haul ramp found diminished; dumper wheel marks over crest edge." },
      { date: "28 Aug 2026", id: "INS-2010", inspector: "Rahul Verma", observation: "Loose boulders perched on upper bench face; excavator working in radius." },
      { date: "18 Sep 2026", id: "INS-2006", inspector: "Rahul Verma", observation: "Operator seatbelt sensor bypassed; oil leakage on steering pump line." },
      { date: "24 Sep 2026", id: "INS-2000", inspector: "Rahul Verma", observation: "Recurring failure of brake retarder telemetry on 100T dumpers; berm height substandard (<1.8m)." }
    ]
  };

  const handleCreateCapaClick = () => {
    runDemoWorkflowStep(3);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple" />
            <span>AI GOVERNANCE INTELLIGENCE</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Explainable neural risk clustering, repetitive non-conformance detection, and proactive statutory decision support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple border border-purple-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Explainable AI Model Active
          </span>
        </div>
      </div>

      {/* 4 AI Intelligence Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Risk Prediction</div>
            <div className="text-2xl font-black text-red mt-1">{riskScore.score} / 100</div>
            <div className="text-[10px] text-red font-semibold mt-0.5">{riskScore.level}</div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red border border-red-100">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Anomaly Detection</div>
            <div className="text-2xl font-black text-orange mt-1">2 Clustered</div>
            <div className="text-[10px] text-orange font-semibold mt-0.5">HEMM Retarder & Berm erosion</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange border border-orange-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Recurring Violation Analysis</div>
            <div className="text-2xl font-black text-purple mt-1">1 Critical Pattern</div>
            <div className="text-[10px] text-purple font-semibold mt-0.5">North Pit Sector B (4 events)</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple border border-purple-100">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-mineBorder shadow-soft flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Priority Recommendation</div>
            <div className="text-lg font-black text-blue mt-1">Safety CAPA Mandate</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Immediate berm reconstruction</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue border border-blue-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Recurring Pattern & Explainability Section (Section 12 & 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECURRING PATTERN DETECTED Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border-2 border-red-200 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-mineBorder pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red text-white">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-navy uppercase tracking-wider">
                    RECURRING PATTERN DETECTED
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Pattern ID: PAT-01</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-red text-white uppercase tracking-wider">
                AI Priority: {pattern.ai_priority}
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-red-50/70 border border-red-200">
              <p className="text-xs font-bold text-red-950 leading-relaxed">
                "{pattern.summary}"
              </p>
              <div className="text-[11px] text-red-800 font-semibold mt-1">
                Category: <strong className="text-navy">{pattern.category}</strong> | Zone:{" "}
                <strong className="text-navy">{pattern.location}</strong>
              </div>
            </div>

            {/* Pattern Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Occurrences</span>
                <span className="text-2xl font-black text-red mt-0.5 block">{pattern.occurrences}</span>
                <span className="text-[9px] text-slate-400">Within 45 Days</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">First Detected</span>
                <span className="text-xs font-mono font-bold text-slate-800 mt-2 block">{pattern.first_detected}</span>
                <span className="text-[9px] text-slate-400">INS-2014</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Latest Detected</span>
                <span className="text-xs font-mono font-bold text-red mt-2 block">{pattern.latest_detected}</span>
                <span className="text-[9px] text-slate-400">INS-2000</span>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-4 p-3.5 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-[11px] font-bold text-purple uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Action:
              </div>
              <p className="text-xs text-purple-950 font-semibold leading-snug">
                "{pattern.recommended_action}"
              </p>
              <div className="text-[10px] text-slate-500 mt-1">
                Mandate physical grader profiling to reinstate 3.0m safety berm and calibrate telematics interlock on Dumper #D-408.
              </div>
            </div>
          </div>

          {/* Action Buttons (Section 12) */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-mineBorder">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-2 border border-slate-300"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>VIEW RECORDS (4 Events)</span>
            </button>

            <button
              onClick={handleCreateCapaClick}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-orange hover:bg-orange-600 text-white transition-all shadow-sm flex items-center justify-center gap-2 border border-orange-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CREATE CAPA (Auto-Dispatch)</span>
            </button>
          </div>
        </div>

        {/* AI EXPLANATION Card - "WHY THIS WAS FLAGGED" (Section 13) (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-mineBorder pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-black text-navy uppercase tracking-wider">WHY THIS WAS FLAGGED</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Explainable AI</span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Risk increased because our neural attribution engine identified 4 correlated statutory vulnerabilities:
              </p>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl border border-red-200 bg-red-50/60 flex items-start gap-2.5">
                  <span className="text-xs font-black text-red font-mono flex-shrink-0 mt-0.5">+3</span>
                  <div>
                    <div className="text-xs font-bold text-navy">Overdue Actions</div>
                    <div className="text-[11px] text-slate-600">CAPA-380, CAPA-381, CMP-1003 past statutory due dates.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-red-200 bg-red-50/60 flex items-start gap-2.5">
                  <span className="text-xs font-black text-red font-mono flex-shrink-0 mt-0.5">+2</span>
                  <div>
                    <div className="text-xs font-bold text-navy">Repeated Observations in Sector B</div>
                    <div className="text-[11px] text-slate-600">
                      Haul road berm height diminished below 1.8m and brake retarder telemetry.
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/60 flex items-start gap-2.5">
                  <span className="text-xs font-black text-orange font-mono flex-shrink-0 mt-0.5">+1</span>
                  <div>
                    <div className="text-xs font-bold text-navy">Approaching Statutory Deadline</div>
                    <div className="text-[11px] text-slate-600">
                      MoEFCC Half-Yearly Environmental Compliance Return due in 48h.
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/60 flex items-start gap-2.5">
                  <span className="text-xs font-black text-orange font-mono flex-shrink-0 mt-0.5">+1</span>
                  <div>
                    <div className="text-xs font-bold text-navy">Unresolved Contractor Issue</div>
                    <div className="text-[11px] text-slate-600">
                      ABC Mining Services VTC driver qualification lapse.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 italic">
            <strong>Transparency Principle: </strong> Decision-support models must provide fully explainable indicators
            with verifiable field citations.
          </div>
        </div>
      </div>

      {/* Historical Records Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-mineBorder pb-3">
              <div>
                <h3 className="text-sm font-black text-navy uppercase tracking-wider">
                  Historical Records for Recurring Pattern [PAT-01]
                </h3>
                <p className="text-xs text-mineMuted">North Pit – Sector B (Haulage & Berm Stability)</p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red text-white">4 Occurrences</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {pattern.historical_records.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue">{rec.id}</span>
                    <span className="font-mono text-slate-500">{rec.date}</span>
                  </div>
                  <p className="text-xs text-navy font-semibold leading-snug">{rec.observation}</p>
                  <div className="text-[11px] text-slate-400">Inspector: {rec.inspector}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-mineBorder">
              <button
                onClick={() => setShowHistoryModal(false)}
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
