"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = "border-blue-500 bg-white";
        let icon = <Info className="w-5 h-5 text-blue" />;

        if (toast.type === "success") {
          borderClass = "border-green bg-white";
          icon = <CheckCircle2 className="w-5 h-5 text-green" />;
        } else if (toast.type === "error") {
          borderClass = "border-red bg-white";
          icon = <AlertCircle className="w-5 h-5 text-red" />;
        } else if (toast.type === "warning") {
          borderClass = "border-orange bg-white";
          icon = <AlertTriangle className="w-5 h-5 text-orange" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-floating border-l-4 ${borderClass} border border-mineBorder/80 animate-in slide-in-from-bottom-3 fade-in`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-bold text-navy">{toast.title}</h4>
              <p className="text-[11px] text-mineMuted mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
