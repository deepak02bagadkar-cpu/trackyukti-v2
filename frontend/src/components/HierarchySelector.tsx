"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Building2,
  Mountain,
  MapPin,
  Users,
  Search,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  Check,
} from "lucide-react";

export const HierarchySelector: React.FC = () => {
  const {
    companies,
    hierarchy,
    selectCompany,
    selectMine,
    selectArea,
    selectDepartment,
    resetFilters,
    getAvailableMines,
    getAvailableAreas,
    getSelectedMine,
    getSelectedCompany,
    setShowCompareMinesModal,
  } = useApp();

  const [openDropdown, setOpenDropdown] = useState<"company" | "mine" | "area" | "dept" | null>(null);
  const [searchCompany, setSearchCompany] = useState("");
  const [searchMine, setSearchMine] = useState("");
  const [searchArea, setSearchArea] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCompany = getSelectedCompany();
  const availableMines = getAvailableMines();
  const selectedMine = getSelectedMine();
  const availableAreas = getAvailableAreas();

  // Filtered lists for searchable dropdowns
  const filteredCompanies = companies.filter((c) => {
    const s = searchCompany.toLowerCase();
    return c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.full_name.toLowerCase().includes(s);
  });

  const filteredMines = availableMines.filter((m) => {
    const s = searchMine.toLowerCase();
    return m.name.toLowerCase().includes(s) || m.code.toLowerCase().includes(s) || m.district.toLowerCase().includes(s) || m.state.toLowerCase().includes(s);
  });

  const filteredAreas = availableAreas.filter((a) => {
    const s = searchArea.toLowerCase();
    return a.name.toLowerCase().includes(s) || a.code.toLowerCase().includes(s);
  });

  return (
    <div
      ref={dropdownRef}
      className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-2.5 shadow-sm text-xs flex flex-wrap items-center justify-between gap-2.5 relative z-30"
    >
      {/* Selector Groups */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Hierarchy Label */}
        <div className="flex items-center gap-1.5 font-bold text-navy mr-1 select-none">
          <Layers className="w-3.5 h-3.5 text-blue" />
          <span className="text-[11px] uppercase tracking-wider">Operational Context:</span>
        </div>

        {/* 1. COMPANY DROPDOWN (Searchable) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(openDropdown === "company" ? null : "company");
              setSearchCompany("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs ${
              openDropdown === "company"
                ? "border-blue bg-blue-50 text-blue ring-2 ring-blue/20"
                : "border-slate-300 bg-white hover:border-slate-400 text-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-orange" />
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-navy">{selectedCompany.code}</span>
              <span className="text-[10px] text-slate-500 font-normal hidden sm:inline max-w-[120px] truncate">
                ({selectedCompany.name.split(" ")[0]})
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Company Dropdown Menu */}
          {openDropdown === "company" && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-floating border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 pb-2 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Mining Organization / Subsidiary
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search company (e.g. SECL, NCL, BCCL)..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-slate-800"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-50">
                {filteredCompanies.map((c) => {
                  const isSelected = c.code === hierarchy.companyCode;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        selectCompany(c.code);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between gap-2 ${
                        isSelected ? "bg-blue-50/80 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-extrabold text-navy">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-700">
                            {c.code}
                          </span>
                          <span>{c.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{c.headquarters}</div>
                        {c.notes && (
                          <div className="text-[9px] text-slate-400 italic mt-0.5 line-clamp-1">{c.notes}</div>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="text-slate-300 font-bold hidden sm:inline">→</span>

        {/* 2. MINE DROPDOWN (Searchable, dependent on selected company) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(openDropdown === "mine" ? null : "mine");
              setSearchMine("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs ${
              openDropdown === "mine"
                ? "border-blue bg-blue-50 text-blue ring-2 ring-blue/20"
                : "border-slate-300 bg-white hover:border-slate-400 text-slate-800"
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-blue" />
            <span className="truncate max-w-[150px]">
              {hierarchy.mineId === "ALL_MINES" ? "All Mines (Consolidated)" : selectedMine?.name || "Select Mine"}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Mine Dropdown Menu */}
          {openDropdown === "mine" && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-floating border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mines in {selectedCompany.code}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {availableMines.length} Units Available
                  </span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder={`Search mines in ${selectedCompany.code}...`}
                    value={searchMine}
                    onChange={(e) => setSearchMine(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-slate-800"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-50">
                {/* Option 1: ALL MINES (Consolidated) */}
                <button
                  type="button"
                  onClick={() => {
                    selectMine("ALL_MINES");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    hierarchy.mineId === "ALL_MINES" ? "bg-blue-50 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-100 text-blue font-bold text-[10px]">ALL</span>
                    <div>
                      <div className="font-extrabold text-navy">All Mines (Consolidated {selectedCompany.code})</div>
                      <div className="text-[10px] text-slate-500">Multi-unit organization dashboard</div>
                    </div>
                  </div>
                  {hierarchy.mineId === "ALL_MINES" && <Check className="w-4 h-4 text-blue" />}
                </button>

                {/* Specific Mines */}
                {filteredMines.map((m) => {
                  const isSelected = m.id === hierarchy.mineId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        selectMine(m.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between gap-2 ${
                        isSelected ? "bg-blue-50 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-navy flex items-center gap-1.5">
                          <span>{m.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              m.baseline_risk > 70
                                ? "bg-red-100 text-red"
                                : m.baseline_risk > 60
                                ? "bg-orange-100 text-orange"
                                : "bg-green-100 text-green"
                            }`}
                          >
                            Risk: {m.baseline_risk}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {m.district}, {m.state} • {m.mine_type}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="text-slate-300 font-bold hidden sm:inline">→</span>

        {/* 3. AREA / PROJECT DROPDOWN (Dependent on selected mine) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenDropdown(openDropdown === "area" ? null : "area");
              setSearchArea("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${
              openDropdown === "area"
                ? "border-blue bg-blue-50 text-blue ring-2 ring-blue/20"
                : "border-slate-300 bg-white hover:border-slate-400 text-slate-800"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-green" />
            <span className="truncate max-w-[130px]">
              {hierarchy.areaId === "ALL_AREAS"
                ? "All Areas / Pits"
                : availableAreas.find((a) => a.id === hierarchy.areaId)?.name || "Select Area"}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Area Dropdown Menu */}
          {openDropdown === "area" && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-floating border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 pb-2 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Operational Areas & Pits
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search area/pit..."
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue text-slate-800"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    selectArea("ALL_AREAS");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    hierarchy.areaId === "ALL_AREAS" ? "bg-blue-50 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>All Operational Areas (Entire Mine)</span>
                  {hierarchy.areaId === "ALL_AREAS" && <Check className="w-4 h-4 text-blue" />}
                </button>

                {filteredAreas.map((a) => {
                  const isSelected = a.id === hierarchy.areaId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        selectArea(a.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between ${
                        isSelected ? "bg-blue-50 text-blue font-bold" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-navy">{a.name}</div>
                        <div className="text-[10px] text-slate-400">{a.type}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="text-slate-300 font-bold hidden sm:inline">→</span>

        {/* 4. DEPARTMENT DROPDOWN */}
        <div className="relative">
          <select
            value={hierarchy.departmentCode}
            onChange={(e) => selectDepartment(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue shadow-2xs"
          >
            <option value="ALL">All Departments</option>
            <option value="MINING">Mining Operations</option>
            <option value="SAFETY">Safety & DGMS</option>
            <option value="MECH">Mechanical / HEMM</option>
            <option value="ELEC">Electrical & Power</option>
            <option value="ENV">Environment & Forest</option>
            <option value="HR">HR & Labour Compliance</option>
            <option value="CONTRACT">Contract Management</option>
          </select>
        </div>
      </div>

      {/* Action Buttons: Compare Mines + Reset Filters */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCompareMinesModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white transition-colors shadow-sm"
          title="Factual multi-mine comparative governance matrix"
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          <span>COMPARE MINES</span>
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Reset back to baseline SECL → Gevra Opencast Project"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
