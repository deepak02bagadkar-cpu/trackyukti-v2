"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Role,
  User,
  ComplianceItem,
  Inspection,
  CAPA,
  Contractor,
  DocumentItem,
  AlertItem,
  AuditRecord,
  RiskScoreData,
  GISHotspot,
  RecurringPattern,
} from "../types";
import {
  COAL_COMPANIES,
  CoalCompany,
  MineNode,
  AreaNode,
  DepartmentNode,
  COMMON_DEPARTMENTS,
} from "../data/coalCompanies";

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (typeof window !== "undefined") {
    if (window.location.port === "3000") {
      return `http://127.0.0.1:8000${cleanEndpoint}`;
    }
    return cleanEndpoint;
  }
  return `http://127.0.0.1:8000${cleanEndpoint}`;
};

const API_BASE = typeof window !== "undefined" && window.location.port === "3000"
  ? "http://127.0.0.1:8000/api"
  : "/api";

const DEMO_USERS: Record<string, User> = {
  ADMIN: {
    id: "USR-001",
    name: "Dr. Rajeshwar Sharma",
    email: "admin@khandrishti.demo",
    role: "ADMIN",
    designation: "Chief Director of Mine Safety & Governance",
    mine: "Gevra Opencast Project",
    subsidiary: "SECL (South Eastern Coalfields Ltd)",
    avatar: "RS",
  },
  MINE_OFFICIAL: {
    id: "USR-002",
    name: "Vikramaditya Sen",
    email: "official@khandrishti.demo",
    role: "MINE_OFFICIAL",
    designation: "General Manager (Operations & Compliance)",
    mine: "Gevra Opencast Project",
    subsidiary: "SECL",
    avatar: "VS",
  },
  INSPECTOR: {
    id: "USR-003",
    name: "Rahul Verma",
    email: "inspector@khandrishti.demo",
    role: "INSPECTOR",
    designation: "Statutory DGMS Dy. Director / Mining Inspector",
    mine: "Gevra Opencast Project",
    subsidiary: "SECL",
    avatar: "RV",
  },
  CORPORATE_MANAGER: {
    id: "USR-004",
    name: "Sunita Mohanty",
    email: "manager@khandrishti.demo",
    role: "CORPORATE_MANAGER",
    designation: "Executive Director (Safety & ESG), CIL HQ",
    mine: "All Units (Consolidated)",
    subsidiary: "Coal India Limited",
    avatar: "SM",
  },
  REGULATORY_VIEWER: {
    id: "USR-005",
    name: "Anand R. Khurana",
    email: "regulatory@khandrishti.demo",
    role: "REGULATORY_VIEWER",
    designation: "Statutory Auditor & MoEFCC Nominee",
    mine: "All Units (Read-Only)",
    subsidiary: "DGMS & MoEFCC",
    avatar: "AK",
  },
};

export interface HierarchyState {
  companyCode: string; // e.g. "SECL", "NCL", "BCCL", "MCL", "CIL", "CMPDI", "SCCL"
  mineId: string; // e.g. "secl-gevra", "ncl-jayant", or "ALL_MINES"
  areaId: string; // e.g. "gevra-north-pit" or "ALL_AREAS"
  departmentCode: string; // e.g. "SAFETY", "MINING", or "ALL"
  dateRange: string;
  category: string;
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  activeTab: string;
  hierarchy: HierarchyState;
  companies: CoalCompany[];
  riskScore: RiskScoreData;
  complianceItems: ComplianceItem[];
  inspections: Inspection[];
  capas: CAPA[];
  contractors: Contractor[];
  documents: DocumentItem[];
  alerts: AlertItem[];
  auditLogs: AuditRecord[];
  hotspots: GISHotspot[];
  patterns: RecurringPattern[];
  isOffline: boolean;
  toasts: ToastMessage[];
  demoStep: number;
  demoMode: boolean;
  showCompareMinesModal: boolean;
  setShowCompareMinesModal: (show: boolean) => void;
  login: (email: string, password?: string, role?: Role, company?: string, mine?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  setActiveTab: (tab: string) => void;
  selectCompany: (code: string) => void;
  selectMine: (mineId: string) => void;
  selectArea: (areaId: string) => void;
  selectDepartment: (deptCode: string) => void;
  setHierarchy: React.Dispatch<React.SetStateAction<HierarchyState>>;
  resetFilters: () => void;
  getAvailableMines: () => MineNode[];
  getAvailableAreas: () => AreaNode[];
  getSelectedMine: () => MineNode | null;
  getSelectedCompany: () => CoalCompany;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  toggleOffline: () => void;
  syncOfflineData: () => void;
  createInspection: (data: Partial<Inspection>) => Promise<void>;
  createCapa: (data: Partial<CAPA>) => Promise<void>;
  updateCapaStatus: (id: string, status: CAPA["status"]) => Promise<void>;
  uploadCapaEvidence: (id: string, fileName: string) => Promise<void>;
  verifyAndCloseCapa: (id: string) => Promise<void>;
  uploadDocument: (fileName: string, fileType: string) => Promise<void>;
  verifyDocument: (id: string) => void;
  acknowledgeAlert: (id: string) => Promise<void>;
  escalateAlert: (id: string) => Promise<void>;
  runDemoWorkflowStep: (stepNumber: number) => Promise<void>;
  resetDemo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USERS.ADMIN);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showCompareMinesModal, setShowCompareMinesModal] = useState<boolean>(false);

  // Hierarchical state: Company -> Mine -> Area -> Department
  const [hierarchy, setHierarchy] = useState<HierarchyState>({
    companyCode: "SECL",
    mineId: "secl-gevra",
    areaId: "ALL_AREAS",
    departmentCode: "ALL",
    dateRange: "Aug - Sep 2026",
    category: "All",
  });

  const [riskScore, setRiskScore] = useState<RiskScoreData>({
    score: 72,
    max_score: 100,
    level: "HIGH ATTENTION",
    badge: "CRITICAL",
    is_capa_closed: false,
    change_note: "Initial AI baseline assessment (Gevra Opencast Project)",
    components: [
      { name: "Overdue Actions", weight: 25, score: 17.5, max: 25, description: "3 critical CAPA actions past statutory deadlines" },
      { name: "Recurring Violations", weight: 25, score: 24.5, max: 25, description: "Cluster detected: Haul ramp berm & retarder failures (North Pit B)" },
      { name: "Inspection Risk", weight: 20, score: 14.0, max: 20, description: "Critical observations during recent surprise DGMS pit audit" },
      { name: "Compliance Deadlines", weight: 15, score: 8.5, max: 15, description: "MoEFCC half-yearly return & Form 33 window active" },
      { name: "Contractor Risk", weight: 15, score: 7.5, max: 15, description: "ABC Mining driver VTC lapse & equipment safety audits" }
    ],
    explainability: {
      summary: "AI decision-support analysis of 128 active compliance vectors for Gevra Opencast Project (SECL).",
      factors: [
        { indicator: "+3 overdue actions", impact: "High Risk", detail: "CAPA-380, CAPA-381, CMP-1003" },
        { indicator: "+2 repeated observations in Sector B", impact: "Critical Pattern", detail: "Haul road berm height <1.8m and brake retarder telemetry" },
        { indicator: "+1 approaching statutory deadline", impact: "Moderate Risk", detail: "MoEFCC Half-Yearly Environmental Compliance Return (due in 48h)" },
        { indicator: "+1 unresolved contractor issue", impact: "High Risk", detail: "ABC Mining Services VTC driver qualification audit" }
      ],
      disclaimer: "AI-generated decision-support indicator. Not a substitute for statutory DGMS inspection or judicial review."
    },
    trend_history: [
      { period: "Week 1 (Aug)", score: 64, benchmark: 50 },
      { period: "Week 2 (Aug)", score: 68, benchmark: 50 },
      { period: "Week 3 (Sep)", score: 70, benchmark: 50 },
      { period: "Week 4 (Sep)", score: 72, benchmark: 50 }
    ]
  });

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [hotspots, setHotspots] = useState<GISHotspot[]>([]);
  const [patterns, setPatterns] = useState<RecurringPattern[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = "toast_" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchInitialData = async () => {
    try {
      const [sumRes, compRes, insRes, capaRes, contRes, docRes, alertRes, auditRes, gisRes, patRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/summary`).then((r) => r.json()),
        fetch(`${API_BASE}/compliance`).then((r) => r.json()),
        fetch(`${API_BASE}/inspections`).then((r) => r.json()),
        fetch(`${API_BASE}/capa`).then((r) => r.json()),
        fetch(`${API_BASE}/contractors`).then((r) => r.json()),
        fetch(`${API_BASE}/documents`).then((r) => r.json()),
        fetch(`${API_BASE}/alerts`).then((r) => r.json()),
        fetch(`${API_BASE}/audit`).then((r) => r.json()),
        fetch(`${API_BASE}/gis/hotspots`).then((r) => r.json()),
        fetch(`${API_BASE}/risk/patterns`).then((r) => r.json()),
      ]);

      if (sumRes && sumRes.risk_score) setRiskScore(sumRes.risk_score);
      if (compRes && compRes.items) setComplianceItems(compRes.items);
      if (insRes && insRes.items) setInspections(insRes.items);
      if (capaRes && capaRes.items) setCapas(capaRes.items);
      if (contRes && contRes.items) setContractors(contRes.items);
      if (docRes && docRes.items) setDocuments(docRes.items);
      if (alertRes && alertRes.items) setAlerts(alertRes.items);
      if (auditRes && auditRes.items) setAuditLogs(auditRes.items);
      if (gisRes && gisRes.hotspots) setHotspots(gisRes.hotspots);
      if (patRes && patRes.patterns) setPatterns(patRes.patterns);
    } catch (err) {
      console.warn("Backend not immediately reachable, loaded resilient demo state.", err);
    }
  };

  // Helper getters for hierarchy
  const getSelectedCompany = (): CoalCompany => {
    return COAL_COMPANIES.find((c) => c.code === hierarchy.companyCode) || COAL_COMPANIES[1]; // default SECL
  };

  const getAvailableMines = (): MineNode[] => {
    const comp = getSelectedCompany();
    return comp.mines;
  };

  const getSelectedMine = (): MineNode | null => {
    if (hierarchy.mineId === "ALL_MINES") return null;
    const comp = getSelectedCompany();
    return comp.mines.find((m) => m.id === hierarchy.mineId) || comp.mines[0] || null;
  };

  const getAvailableAreas = (): AreaNode[] => {
    const mine = getSelectedMine();
    if (!mine) {
      // If ALL MINES or none, aggregate areas from the company
      const comp = getSelectedCompany();
      return comp.mines.flatMap((m) => m.areas);
    }
    return mine.areas;
  };

  // Dynamic risk calculation upon changing mine
  const updateRiskScoreForMine = (companyCode: string, mineId: string, isCapaClosed = false) => {
    const comp = COAL_COMPANIES.find((c) => c.code === companyCode) || COAL_COMPANIES[1];

    if (mineId === "ALL_MINES") {
      const avgScore = Math.round(
        comp.mines.reduce((acc, m) => acc + m.baseline_risk, 0) / (comp.mines.length || 1)
      );
      setRiskScore({
        score: avgScore,
        max_score: 100,
        level: avgScore > 70 ? "HIGH ATTENTION" : "MODERATE ATTENTION",
        badge: avgScore > 70 ? "CRITICAL" : "MODERATE",
        is_capa_closed: isCapaClosed,
        change_note: `Consolidated multi-mine governance index across ${comp.code}`,
        components: [
          { name: "Overdue Actions", weight: 25, score: 16.0, max: 25, description: "Multi-mine aggregated overdue actions" },
          { name: "Recurring Violations", weight: 25, score: 19.5, max: 25, description: "Regional safety hazard clusters" },
          { name: "Inspection Risk", weight: 20, score: 13.5, max: 20, description: "DGMS audit observations across subsidiary" },
          { name: "Compliance Deadlines", weight: 15, score: 10.0, max: 15, description: "MoEFCC & statutory return schedules" },
          { name: "Contractor Risk", weight: 15, score: 9.0, max: 15, description: "Contractor VTC and fleet qualifications" },
        ],
        explainability: {
          summary: `Aggregated governance index for ${comp.full_name} (${comp.mines.length} operational units monitored).`,
          factors: [
            { indicator: "+6 regional overdue actions", impact: "High Risk", detail: "Spread across open pit and underground units" },
            { indicator: "+3 high-priority geotechnical alerts", impact: "Moderate Risk", detail: "Radar slope displacement monitoring" },
            { indicator: "+2 statutory EC compliance windows", impact: "Active Schedule", detail: "Half-yearly MoEFCC filings" }
          ],
          disclaimer: "AI-generated decision-support indicator. Not a substitute for statutory DGMS inspection or judicial review."
        },
        trend_history: [
          { period: "Week 1", score: avgScore - 4, benchmark: 50 },
          { period: "Week 2", score: avgScore - 2, benchmark: 50 },
          { period: "Week 3", score: avgScore - 1, benchmark: 50 },
          { period: "Week 4", score: avgScore, benchmark: 50 },
        ]
      });
      return;
    }

    const mine = comp.mines.find((m) => m.id === mineId) || comp.mines[0];
    const score = (mine.code === "GEVRA" && isCapaClosed) ? 66 : mine.baseline_risk;
    const isClosed = mine.code === "GEVRA" && isCapaClosed;

    setRiskScore({
      score,
      max_score: 100,
      level: isClosed ? "MODERATE ATTENTION" : mine.risk_level,
      badge: score > 70 ? "CRITICAL" : score > 60 ? "HIGH" : "MODERATE",
      is_capa_closed: isClosed,
      change_note: isClosed
        ? "Risk reduced after verified corrective action (72 → 66)"
        : `Baseline assessment for ${mine.name}`,
      components: [
        { name: "Overdue Actions", weight: 25, score: Math.round(score * 0.24 * 10) / 10, max: 25, description: `Active non-conformance items at ${mine.name}` },
        { name: "Recurring Violations", weight: 25, score: isClosed ? 18.0 : Math.round(score * 0.32 * 10) / 10, max: 25, description: mine.primary_issue },
        { name: "Inspection Risk", weight: 20, score: Math.round(score * 0.20 * 10) / 10, max: 20, description: "Recent DGMS surprise inspection observations" },
        { name: "Compliance Deadlines", weight: 15, score: Math.round(score * 0.12 * 10) / 10, max: 15, description: "Statutory filing return timeline" },
        { name: "Contractor Risk", weight: 15, score: Math.round(score * 0.12 * 10) / 10, max: 15, description: "Contractor machinery and manpower safety" },
      ],
      explainability: {
        summary: `AI decision-support analysis of active statutory compliance vectors for ${mine.name}.`,
        factors: [
          { indicator: mine.primary_issue.substring(0, 35) + "...", impact: score > 70 ? "Critical Hazard" : "Monitored", detail: mine.primary_issue },
          { indicator: isClosed ? "✓ Haul ramp berm reconstructed (3.2m RL 240)" : "+2 safety observations", impact: isClosed ? "Resolved" : "Open CAPA", detail: "Statutory berm height & retarder telemetry" },
          { indicator: "+1 statutory filing window", impact: "Schedule", detail: "DGMS / MoEFCC return calendar" },
        ],
        disclaimer: "AI-generated decision-support indicator. Not a substitute for statutory DGMS inspection or judicial review."
      },
      trend_history: [
        { period: "Week 1", score: score - 5, benchmark: 50 },
        { period: "Week 2", score: score - 2, benchmark: 50 },
        { period: "Week 3", score: score - 1, benchmark: 50 },
        { period: "Week 4", score: score, benchmark: 50 },
      ]
    });
  };

  // Select Company -> Automatically updates available mines
  const selectCompany = (code: string) => {
    const comp = COAL_COMPANIES.find((c) => c.code === code) || COAL_COMPANIES[1];
    const firstMineId = comp.mines[0]?.id || "ALL_MINES";
    
    setHierarchy({
      ...hierarchy,
      companyCode: comp.code,
      mineId: firstMineId,
      areaId: "ALL_AREAS",
    });

    updateRiskScoreForMine(comp.code, firstMineId, riskScore.is_capa_closed);

    addToast({
      type: "info",
      title: "Organization Selected",
      message: `Switched context to ${comp.full_name} (${comp.code}). Mines dynamically filtered.`,
    });
  };

  // Select Mine -> Automatically updates available areas
  const selectMine = (mineId: string) => {
    setHierarchy((prev) => ({
      ...prev,
      mineId,
      areaId: "ALL_AREAS",
    }));

    updateRiskScoreForMine(hierarchy.companyCode, mineId, riskScore.is_capa_closed);

    const mineName = mineId === "ALL_MINES" ? "All Mines (Consolidated)" : getAvailableMines().find((m) => m.id === mineId)?.name || mineId;
    addToast({
      type: "info",
      title: "Mine Selected",
      message: `Operational dashboard loaded for: ${mineName}`,
    });
  };

  // Select Area
  const selectArea = (areaId: string) => {
    setHierarchy((prev) => ({ ...prev, areaId }));
    const areaName = areaId === "ALL_AREAS" ? "All Areas" : getAvailableAreas().find((a) => a.id === areaId)?.name || areaId;
    addToast({
      type: "info",
      title: "Area Selected",
      message: `Filtered operational area: ${areaName}`,
    });
  };

  // Select Department
  const selectDepartment = (deptCode: string) => {
    setHierarchy((prev) => ({ ...prev, departmentCode: deptCode }));
  };

  // Reset Filters to baseline Gevra
  const resetFilters = () => {
    setHierarchy({
      companyCode: "SECL",
      mineId: "secl-gevra",
      areaId: "ALL_AREAS",
      departmentCode: "ALL",
      dateRange: "Aug - Sep 2026",
      category: "All",
    });
    updateRiskScoreForMine("SECL", "secl-gevra", false);
    addToast({
      type: "info",
      title: "Filters Reset",
      message: "Restored baseline view: SECL → Gevra Opencast Project (Risk: 72/100).",
    });
  };

  const login = async (
    email: string,
    password = "password",
    role: Role = "ADMIN",
    company = "SECL",
    mine = "Gevra Opencast Project"
  ): Promise<boolean> => {
    const matched = DEMO_USERS[role] || DEMO_USERS.ADMIN;
    setUser({ ...matched, mine, subsidiary: company });
    setIsLoggedIn(true);

    // Apply company & mine to hierarchy
    const compObj = COAL_COMPANIES.find((c) => c.code === company) || COAL_COMPANIES[1];
    const matchedMine = compObj.mines.find((m) => m.name.toLowerCase().includes(mine.toLowerCase())) || compObj.mines[0];

    setHierarchy((prev) => ({
      ...prev,
      companyCode: compObj.code,
      mineId: matchedMine ? matchedMine.id : "ALL_MINES",
    }));

    updateRiskScoreForMine(compObj.code, matchedMine ? matchedMine.id : "ALL_MINES", false);

    addToast({
      type: "success",
      title: "Authenticated (Demo Mode)",
      message: `Welcome, ${matched.name} [${role}]. Organization: ${compObj.code} → ${matchedMine ? matchedMine.name : "All Units"}.`,
    });
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    addToast({ type: "info", title: "Logged Out", message: "Session ended safely." });
  };

  const switchRole = (newRole: Role) => {
    const targetUser = DEMO_USERS[newRole] || DEMO_USERS.ADMIN;
    setUser(targetUser);

    // Context changes per role
    if (newRole === "CORPORATE_MANAGER") {
      setHierarchy((prev) => ({ ...prev, companyCode: "CIL", mineId: "ALL_MINES" }));
      updateRiskScoreForMine("CIL", "ALL_MINES", false);
    } else if (newRole === "MINE_OFFICIAL" || newRole === "INSPECTOR") {
      setHierarchy((prev) => ({ ...prev, companyCode: "SECL", mineId: "secl-gevra" }));
      updateRiskScoreForMine("SECL", "secl-gevra", riskScore.is_capa_closed);
    }

    addToast({
      type: "info",
      title: "Role Switched",
      message: `Active session now running as ${targetUser.designation} (${newRole})`,
    });
  };

  const toggleOffline = () => {
    setIsOffline(!isOffline);
    if (!isOffline) {
      addToast({
        type: "warning",
        title: "Field Offline Mode Enabled",
        message: "OFFLINE — DATA STORED LOCALLY. Field records will queue until connection is restored.",
      });
    } else {
      addToast({
        type: "success",
        title: "Back Online",
        message: "Network restored. Sync queue is ready.",
      });
    }
  };

  const syncOfflineData = () => {
    addToast({
      type: "success",
      title: "Data Synchronized",
      message: "6 records synchronized successfully with central DGMS server.",
    });
  };

  const createInspection = async (data: Partial<Inspection>) => {
    const newId = `INS-${2000 + inspections.length + 1}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const dateStr = timestamp.substring(0, 10);
    const mineObj = getSelectedMine();
    const mineName = data.mine || (mineObj ? mineObj.name : "Gevra Opencast Project");

    const newInsp: Inspection = {
      id: newId,
      inspector: user ? user.name : "Rahul Verma (DGMS)",
      area: data.area || "North Pit – Sector B",
      date: dateStr,
      type: data.type || "Safety & DGMS Audit",
      observations: data.observations || "Berm degradation & haul road surface inspection.",
      risk: (data.severity?.toUpperCase() as any) || "HIGH",
      status: "Action Required",
      severity: data.severity || "Critical",
      mine: mineName,
      location_coords: data.location_coords || "22.3595° N, 82.7501° E",
      timestamp,
    };

    setInspections([newInsp, ...inspections]);

    // Record audit log
    const newAudit: AuditRecord = {
      id: `AUD-${900 + auditLogs.length + 1}`,
      timestamp,
      user: user?.name || "Field Inspector",
      action: "Created Inspection & Observation",
      record: newId,
      old_value: "DRAFT",
      new_value: `${newInsp.type} - ${newInsp.severity} (${mineName})`,
      ip_device: "192.168.1.18 (Rugged Mobile Tablet)",
      status: "STATUTORILY LOCKED",
      hash: "SHA256:4b10...91ef",
    };
    setAuditLogs([newAudit, ...auditLogs]);

    addToast({
      type: "success",
      title: "Inspection Registered",
      message: `Inspection ${newId} registered for ${mineName} (${newInsp.area}).`,
    });
  };

  const createCapa = async (data: Partial<CAPA>) => {
    const newId = data.id || `CAPA-${383 + capas.length}`;
    const dateStr = new Date().toISOString().substring(0, 10);
    const newCapa: CAPA = {
      id: newId,
      issue: data.issue || "Haul road berm height remediation in North Pit Sector B",
      department: data.department || "Safety",
      owner: data.owner || "Vikramaditya Sen (GM Ops)",
      created: dateStr,
      due_date: data.due_date || "2026-09-30",
      priority: data.priority || "CRITICAL",
      status: "IN PROGRESS",
      source: data.source || "AI Priority Queue",
      timeline: [
        { step: "Observation Created", date: `${dateStr} 14:10`, done: true, by: "Rahul Verma (DGMS)" },
        { step: "Assigned", date: `${dateStr} 14:20`, done: true, by: "AI Priority Queue" },
        { step: "Action Started", date: `${dateStr} 15:00`, done: true, by: data.owner || "Safety Team" },
        { step: "Evidence Uploaded", date: null, done: false, by: "-" },
        { step: "Verification", date: null, done: false, by: "-" },
        { step: "Closure", date: null, done: false, by: "-" },
      ],
      evidence: [],
      impact_risk_reduction: 6.0,
    };

    setCapas([newCapa, ...capas]);
    setDemoStep(4);

    addToast({
      type: "success",
      title: "CAPA Dispatched",
      message: `CAPA ${newId} assigned to ${newCapa.department} with deadline ${newCapa.due_date}.`,
    });
  };

  const updateCapaStatus = async (id: string, status: CAPA["status"]) => {
    setCapas((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status };
          if (status === "IN PROGRESS") updated.timeline[2].done = true;
          if (status === "PENDING VERIFICATION") updated.timeline[3].done = true;
          if (status === "CLOSED") {
            updated.timeline[4].done = true;
            updated.timeline[5].done = true;
          }
          return updated;
        }
        return c;
      })
    );

    addToast({
      type: "info",
      title: "CAPA Updated",
      message: `${id} status changed to ${status}.`,
    });
  };

  const uploadCapaEvidence = async (id: string, fileName: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    setCapas((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: "PENDING VERIFICATION",
            evidence: [...c.evidence, fileName],
            timeline: c.timeline.map((t, idx) => {
              if (idx === 2) return { ...t, done: true, date: nowStr };
              if (idx === 3) return { ...t, done: true, date: nowStr, by: `Uploaded: ${fileName}` };
              return t;
            }),
          };
        }
        return c;
      })
    );

    const newAudit: AuditRecord = {
      id: `AUD-${900 + auditLogs.length + 1}`,
      timestamp: nowStr,
      user: user?.name || "Safety Officer",
      action: "Uploaded Evidence",
      record: id,
      old_value: "IN PROGRESS",
      new_value: `PENDING VERIFICATION (${fileName})`,
      ip_device: "10.14.82.44 (Safety Workstation)",
      status: "SUBMITTED",
      hash: "SHA256:7b11...99ef",
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setDemoStep(5);

    addToast({
      type: "success",
      title: "Evidence Uploaded",
      message: `Document "${fileName}" attached. Status is now PENDING VERIFICATION.`,
    });
  };

  const verifyAndCloseCapa = async (id: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const verifierName = user?.name || "Dr. Rajeshwar Sharma (Admin)";

    setCapas((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: "CLOSED",
            timeline: c.timeline.map((t, idx) => {
              if (idx === 4) return { ...t, done: true, date: nowStr, by: verifierName };
              if (idx === 5) return { ...t, done: true, date: nowStr, by: "Verified Closure & Sealed" };
              return t;
            }),
          };
        }
        return c;
      })
    );

    // Recalculate score from 72 to 66
    updateRiskScoreForMine(hierarchy.companyCode, hierarchy.mineId, true);

    const newAudit: AuditRecord = {
      id: `AUD-${900 + auditLogs.length + 1}`,
      timestamp: nowStr,
      user: verifierName,
      action: "Verified Closure",
      record: id,
      old_value: "PENDING VERIFICATION",
      new_value: "CLOSED",
      ip_device: "10.14.82.10 (Secured Workstation)",
      status: "VERIFIED & SIGNED",
      hash: "SHA256:8f2a...c01e",
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setDemoStep(6);

    addToast({
      type: "success",
      title: "CAPA Verified & Closed",
      message: "Governance risk score updated from 72 → 66. Verified corrective action completed.",
    });
  };

  const uploadDocument = async (fileName: string, fileType: string) => {
    const newDocId = `DOC-${700 + documents.length + 1}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const mineObj = getSelectedMine();
    const mineName = mineObj ? mineObj.name : "Gevra Opencast Project";

    let docType = "Contractor Equipment Fitness & Non-Destructive Test Certificate";
    let req = "DGMS Circular 02 of 2020";
    if (fileName.toLowerCase().includes("form") || fileName.toLowerCase().includes("dgms")) {
      docType = "DGMS Statutory Form IV (Notice of Occurrence)";
      req = "Regulation 8 CMR 2017 Notice Filing";
    } else if (fileName.toLowerCase().includes("ec") || fileName.toLowerCase().includes("env")) {
      docType = "MoEFCC Environmental Clearance Compliance Report";
      req = "MoEFCC EC Clearance Condition No. 14";
    }

    const newDoc: DocumentItem = {
      id: newDocId,
      title: docType,
      file_name: fileName,
      file_type: fileType.toUpperCase(),
      file_size: "3.2 MB",
      upload_time: timestamp,
      ocr_status: "Completed",
      ocr_confidence: 98.2,
      extracted_fields: {
        document_type: docType,
        mine: mineName,
        department: "Safety & Operations",
        compliance_requirement: req,
        issue_date: "2026-09-24",
        expiry_date: "2027-03-31",
        reference_number: `DGMS/${hierarchy.companyCode}/${newDocId}/2026`,
      },
      verified: false,
      linked_compliance_id: "CMP-1003",
    };

    setDocuments([newDoc, ...documents]);

    addToast({
      type: "success",
      title: "OCR Scan Completed",
      message: `Document parsed with 98.2% AI confidence and tagged to ${mineName}.`,
    });
  };

  const verifyDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verified: true } : d))
    );
    addToast({
      type: "success",
      title: "Document Verified",
      message: `${id} verified and linked to statutory compliance register.`,
    });
  };

  const acknowledgeAlert = async (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" } : a))
    );
    addToast({ type: "info", title: "Alert Acknowledged", message: `${id} acknowledged.` });
  };

  const escalateAlert = async (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ESCALATED" } : a))
    );
    addToast({
      type: "warning",
      title: "Alert Escalated",
      message: `${id} escalated to General Manager & Safety Directorate.`,
    });
  };

  const resetDemo = async () => {
    setDemoStep(1);
    resetFilters();
    await fetchInitialData();
    addToast({
      type: "info",
      title: "Demo State Reset",
      message: "Governance Risk Score reset to initial baseline (Gevra: 72 / 100).",
    });
  };

  const runDemoWorkflowStep = async (step: number) => {
    if (step === 1) {
      setActiveTab("dashboard");
      setDemoStep(1);
    } else if (step === 2) {
      setActiveTab("ai-risk");
      setDemoStep(2);
      addToast({
        type: "info",
        title: "Evaluator Step 2",
        message: "AI detected recurring pattern PAT-01 in North Pit Sector B (4 historical events).",
      });
    } else if (step === 3) {
      setActiveTab("capa");
      await createCapa({
        id: "CAPA-382",
        issue: "Recurring safety observation: Substandard haul road berms and dumper brake retarder failure in North Pit Sector B",
        department: "Safety",
        owner: "Vikramaditya Sen (GM Ops)",
        due_date: "2026-09-30",
        priority: "CRITICAL",
        source: "AI Priority Queue / Inspection INS-2000",
      });
      setDemoStep(3);
    } else if (step === 4) {
      setActiveTab("capa");
      await uploadCapaEvidence("CAPA-382", "Berm_Restoration_Survey_3.2m_RL240.pdf");
      setDemoStep(4);
    } else if (step === 5) {
      switchRole("MINE_OFFICIAL");
      setActiveTab("capa");
      setDemoStep(5);
      addToast({
        type: "info",
        title: "Evaluator Step 5",
        message: "Switched to Vikramaditya Sen (Authorized Mine Official). Click 'Verify Closure'.",
      });
    } else if (step === 6) {
      await verifyAndCloseCapa("CAPA-382");
      setActiveTab("dashboard");
      setDemoStep(6);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        activeTab,
        hierarchy,
        companies: COAL_COMPANIES,
        riskScore,
        complianceItems,
        inspections,
        capas,
        contractors,
        documents,
        alerts,
        auditLogs,
        hotspots,
        patterns,
        isOffline,
        toasts,
        demoStep,
        demoMode,
        showCompareMinesModal,
        setShowCompareMinesModal,
        login,
        logout,
        switchRole,
        setActiveTab,
        selectCompany,
        selectMine,
        selectArea,
        selectDepartment,
        setHierarchy,
        resetFilters,
        getAvailableMines,
        getAvailableAreas,
        getSelectedMine,
        getSelectedCompany,
        addToast,
        removeToast,
        toggleOffline,
        syncOfflineData,
        createInspection,
        createCapa,
        updateCapaStatus,
        uploadCapaEvidence,
        verifyAndCloseCapa,
        uploadDocument,
        verifyDocument,
        acknowledgeAlert,
        escalateAlert,
        runDemoWorkflowStep,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
