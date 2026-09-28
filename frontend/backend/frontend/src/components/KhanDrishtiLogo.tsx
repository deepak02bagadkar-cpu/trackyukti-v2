"use client";

import React from "react";
import Image from "next/image";

interface KhanDrishtiLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  className?: string;
  subtextClassName?: string;
}

export const KhanDrishtiLogo: React.FC<KhanDrishtiLogoProps> = ({
  size = "md",
  showText = false,
  className = "",
  subtextClassName = "text-slate-300",
}) => {
  const pixelSize = {
    sm: 36,
    md: 48,
    lg: 72,
    xl: 104,
    "2xl": 140,
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: pixelSize, height: pixelSize }}
      >
        {/* Subtle Ambient Luminous Halo */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-50 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(242,105,20,0.4) 0%, rgba(24,105,190,0.5) 70%, transparent 100%)",
          }}
        />

        {/* Outer Orbital Network Ring (Rotating Ticks & Satellite Nodes) */}
        <svg
          className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] animate-[spin_35s_linear_infinite] pointer-events-none opacity-60"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="0.8"
            strokeDasharray="4 6 1 6"
          />
          <circle cx="50" cy="3" r="2.2" fill="#F26914" />
          <circle cx="97" cy="50" r="1.8" fill="#38BDF8" />
          <circle cx="50" cy="97" r="2" fill="#10B981" />
          <circle cx="3" cy="50" r="1.8" fill="#F59E0B" />
        </svg>

        {/* Authentic Circular Khan Drishti Emblem Badge */}
        <div
          className="relative z-10 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.45)] border-2 border-slate-700/80 bg-white flex items-center justify-center"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <img
            src="/khan-drishti-logo.png"
            alt="KHAN DRISHTI - Smart Governance Platform for Coal Mines"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-wider text-white text-lg leading-none uppercase">
              KHAN <span className="text-orange">DRISHTI</span>
            </span>
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-orange/20 text-orange border border-orange/40 font-mono">
              खान दृष्टि
            </span>
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-1 ${subtextClassName}`}>
            Smart Governance Platform for Coal Mines
          </span>
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const CoalShieldLogo = KhanDrishtiLogo;
