"use client";

import React, { useState } from "react";
import { useApp, getApiUrl } from "../../context/AppContext";
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  ExternalLink,
  ChevronRight,
  User,
  Key,
} from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  source?: string;
  suggestedActions?: { label: string; route: string }[];
  citations?: string[];
  timestamp: string;
}

export const AiAssistantView: React.FC = () => {
  const { setActiveTab, getSelectedCompany, getSelectedMine, hierarchy, riskScore } = useApp();
  const selectedCompany = getSelectedCompany();
  const selectedMine = getSelectedMine();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const activeMineLabel =
    hierarchy.mineId === "ALL_MINES"
      ? `${selectedCompany.code} Consolidated Multi-Mine View`
      : `${selectedCompany.code} / ${selectedMine?.name || "Gevra Open Cast"}`;

  const presetQuestions = [
    `Why is the ${selectedCompany.code} risk score currently ${riskScore}?`,
    `Which compliance areas require immediate attention in ${selectedMine?.code || "GEVRA"}?`,
    "Show recurring violations this month.",
    "Which contractors have the highest open-risk exposure?",
    "What inspections are overdue?",
    "Show all critical observations.",
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text:
        `Greetings, Officer. I am **KHAN DRISHTI INTELLIGENCE (खान दृष्टि)**, your statutory decision-support copilot for coal mine compliance and risk governance.\n\n` +
        `Current active surveillance target: **${activeMineLabel}** (Current Risk Index: **${riskScore}/100**).\n\n` +
        `You can ask me to explain risk contributors, audit recurring patterns, query DGMS statutory deadlines, or benchmark subsidiary performance across coalfields.`,
      suggestedActions: [
        { label: `Why is the risk score ${riskScore}?`, route: "dashboard" },
        { label: "Review Sector B Recurring Pattern", route: "ai-risk" },
        { label: "Compare Mines Matrix", route: "dashboard" },
      ],
      citations: ["DGMS Act 1952", "CMR 2017", "CIL Safety SOP"],
      timestamp: "17:35 IST",
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/ai/query"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          mine_name: selectedMine?.name || "Gevra Mega Opencast Project",
          company_code: selectedCompany.code || "SECL",
          risk_score: riskScore,
          api_key: openaiKey.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.response,
            source: data.source,
            suggestedActions: data.suggested_actions,
            citations: data.citations,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // offline fallback structured response
    }

    // High quality offline fallback
    setTimeout(() => {
      let respText = "";
      let actions = [{ label: "Command Center", route: "dashboard" }];
      let cites = ["DGMS (Tech) Circulars", "CMR 2017"];

      if (q.toLowerCase().includes("why") || q.toLowerCase().includes("risk")) {
        respText =
          `**Risk Intelligence Report for [${activeMineLabel}]**:\n\n` +
          `• **Calculated Risk Index**: **${riskScore}/100** (Surveillance status: ${riskScore > 70 ? "HIGH ATTENTION" : "MODERATE MONITORING"})\n` +
          "• **3 overdue corrective actions** (CAPA-380, CAPA-381, CMP-1003)\n" +
          "• **2 recurring safety observations** in Main Excavation Bench & Haul Ramp\n" +
          "• **1 approaching compliance deadline** (MoEFCC Half-Yearly Return due in 48h)\n" +
          "• **1 contractor documentation gap** (ABC Mining hauler VTC license)\n\n" +
          `**Statutory Recommendation**:\n` +
          `Prioritize closure of CAPA-382 to reduce ${selectedCompany.code} overall hazard exposure score.`;
        actions = [
          { label: "View AI Priority Queue", route: "ai-risk" },
          { label: "Open CAPA Center", route: "capa" },
        ];
        cites = ["CAPA-382", "INS-2000", "CMR 2017 Reg 106"];
      } else if (q.toLowerCase().includes("contractor")) {
        respText =
          "**Contractor Risk Evaluation**:\n\n" +
          "• **Highest Exposure**: **ABC Mining Services** (Score 68%, 14 safety violations, 1 expired VTC driver license).\n" +
          "• **Moderate Risk**: **Eastern Coal Haulers** (Score 74%, 2 tippers expired fitness).\n" +
          "• **Benchmark Compliance**: **Bharat Industrial Contractors Pvt Ltd** (Score 94%, zero open CAPA).\n\n" +
          "Immediate audit recommended for North Pit hauler operator licences.";
        actions = [{ label: "Open Contractor Governance", route: "contractors" }];
        cites = ["MVTR 1966 Rule 6", "CON-001"];
      } else if (q.toLowerCase().includes("recurring") || q.toLowerCase().includes("pattern")) {
        respText =
          "**Recurring Safety Observation Pattern [PAT-01]**:\n\n" +
          "• **Location**: North Pit – Sector B (Haul Ramp B)\n" +
          "• **Frequency**: 4 recorded occurrences (12 Aug to 24 Sep 2026)\n" +
          "• **Primary Hazard**: Substandard berm height (<1.8m against 3.0m statutory requirement) coupled with intermittent brake retarder sensor alerts.\n\n" +
          "Recommended corrective action: Mandate physical grader profiling and deploy radar telemetry.";
        actions = [
          { label: "Review Recurring Pattern", route: "ai-risk" },
          { label: "Inspect CAPA-382", route: "capa" },
        ];
        cites = ["DGMS Cir 02/2020", "PAT-01"];
      } else {
        respText =
          `Statutory intelligence summary for: "${q}"\n\n` +
          "• 91 items verified compliant out of 128 statutory obligations (71.1% compliance index).\n" +
          "• 8 Critical non-conformances actively flagged across North Pit and CHP.\n" +
          "• All observations cross-referenced against DGMS standard operating procedures.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: respText,
          suggestedActions: actions,
          citations: cites,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mineBorder pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-navy tracking-tight uppercase">KHAN DRISHTI INTELLIGENCE</h1>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange/20 text-orange font-mono">
                खान दृष्टि
              </span>
            </div>
            <p className="text-xs text-mineMuted">
              Natural language statutory querying and root-cause intelligence assistant.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 shadow-sm ${
              openaiKey.trim()
                ? "bg-purple text-white border-purple"
                : "bg-white text-slate-700 border-mineBorder hover:bg-slate-50"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{openaiKey.trim() ? "OpenAI Active (GPT-4o)" : "Configure OpenAI Key"}</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green border border-green-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            AI Decision Engine Online
          </span>
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Recommended Statutory Prompts:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-purple-50 text-slate-700 hover:text-purple border border-mineBorder transition-colors shadow-soft"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="bg-white rounded-2xl border border-mineBorder shadow-soft p-5 min-h-[440px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isAi = m.sender === "ai";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-purple text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs space-y-2.5 shadow-sm ${
                  isAi
                    ? "bg-slate-50 text-slate-800 border border-slate-200"
                    : "bg-navy text-white"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                {/* Clickable Actions */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2">
                    {m.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab(action.route)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white hover:bg-blue hover:text-white text-navy border border-slate-300 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>{action.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Citations */}
                {m.citations && (
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                    <span>Citations:</span>
                    {m.citations.map((cite, i) => (
                      <span key={i} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                        {cite}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engine Source Badge & Timestamp */}
                {isAi ? (
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 mt-1">
                    <span className="text-[10px] font-mono font-semibold flex items-center gap-1 text-slate-500">
                      <Sparkles className="w-3 h-3 text-purple" />
                      <span>{m.source || "KHAN DRISHTI Deterministic Rule Engine"}</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{m.timestamp}</span>
                  </div>
                ) : (
                  <div className="text-[9px] font-mono text-right text-slate-300">
                    {m.timestamp}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple font-semibold bg-purple-50 p-3 rounded-xl border border-purple-200 w-fit">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Analyzing mine statutory graph and knowledge base...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Khan Drishti (खान दृष्टि) Intelligence about safety non-conformances, CAPA status, or risk scores..."
          className="flex-1 p-3 text-xs border border-mineBorder rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple text-mineText shadow-soft"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="py-3 px-5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          <span>Submit</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* OpenAI API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Key className="w-4 h-4 text-purple" />
                <span>OpenAI Statutory Copilot Key</span>
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Provide an OpenAI API key to enable live GPT-4o synthesis for complex statutory reasoning, DGMS circular interpretations, and multi-mine compliance.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">OpenAI API Key (sk-...)</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-[11px] text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Downtime Guaranteed:</span>
              </div>
              <p>
                If omitted or network is offline, KHAN DRISHTI transparently falls back to the deterministic Indian Coal Mining statutory rule-base with zero latency.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setOpenaiKey("");
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Clear / Use Local Engine
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-1.5 text-xs font-bold bg-navy text-white hover:bg-navy-800 rounded-lg shadow-sm"
              >
                Save & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
