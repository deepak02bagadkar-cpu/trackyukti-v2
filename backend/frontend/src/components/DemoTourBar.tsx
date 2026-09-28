"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const DemoTourBar: React.FC = () => {
  const { demoStep, runDemoWorkflowStep, resetDemo, riskScore } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const steps = [
    { step: 1, label: "1. Baseline Risk (72/100)", desc: "Command center shows 72/100 High Attention." },
    { step: 2, label: "2. AI Priority Queue", desc: "Inspect 4 recurring safety events in North Pit B." },
    { step: 3, label: "3. Create CAPA-382", desc: "Auto-dispatch CAPA to Safety Department." },
    { step: 4, label: "4. Upload Evidence", desc: "Submit 3.2m berm restoration survey certificate." },
    { step: 5, label: "5. Mine Official Verification", desc: "Statutory review by GM Operations." },
    { step: 6, label: "6. Score Drops to 66!", desc: "Dynamic recalculation: 72 → 66 verified risk reduction." },
  ];

  const handleNextStep = () => {
    const next = demoStep < 6 ? demoStep + 1 : 1;
    runDemoWorkflowStep(next);
  };

  const handleRunFullTour = async () => {
    setIsRunningAll(true);
    await resetDemo();
    await new Promise((r) => setTimeout(r, 600));
    await runDemoWorkflowStep(2);
    await new Promise((r) => setTimeout(r, 1200));
    await runDemoWorkflowStep(3);
    await new Promise((r) => setTimeout(r, 1200));
    await runDemoWorkflowStep(4);
    await new Promise((r) => setTimeout(r, 1200));
    await runDemoWorkflowStep(5);
    await new Promise((r) => setTimeout(r, 1200));
    await runDemoWorkflowStep(6);
    setIsRunningAll(false);
  };

  return (
    <div className="bg-gradient-to-r from-navy via-[#14305D] to-[#1B407D] text-white border-b border-navy-800 px-6 py-2 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-orange flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-amber-300">
                SIH Evaluator Demo Scenario Guide (2–3 Min Showcase)
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                Current Risk: {riskScore.score}/100
              </span>
            </div>
            {!collapsed && (
              <p className="text-[11px] text-slate-300">
                {steps[demoStep - 1]?.desc || "Follow the structured governance demonstration."}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick buttons */}
          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-orange hover:bg-orange-600 text-white shadow-sm transition-all"
          >
            <span>Advance to Step {demoStep < 6 ? demoStep + 1 : 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRunFullTour}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-green-400" />
            <span>{isRunningAll ? "Simulating..." : "Auto-Run Story"}</span>
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title={collapsed ? "Expand demo steps" : "Collapse demo steps"}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Steps Pill Bar */}
      {!collapsed && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5 mt-2 pt-2 border-t border-white/10">
          {steps.map((s) => {
            const isCompleted = s.step < demoStep;
            const isCurrent = s.step === demoStep;
            return (
              <button
                key={s.step}
                onClick={() => runDemoWorkflowStep(s.step)}
                className={`text-left px-2 py-1 rounded text-[11px] transition-all flex items-center justify-between border ${
                  isCurrent
                    ? "bg-orange/20 border-orange text-orange-200 font-bold shadow-sm"
                    : isCompleted
                    ? "bg-green/10 border-green/40 text-green-300 font-medium"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span className="truncate">{s.label}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 ml-1" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-orange animate-ping ml-1"></span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
