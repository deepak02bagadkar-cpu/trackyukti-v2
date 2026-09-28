"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
} from "lucide-react";

export const ReportsView: React.FC = () => {
  const { addToast } = useApp();
  const [selectedReportId, setSelectedReportId] = useState("REP-01");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const reports = [
    {
      id: "REP-01",
      title: "Daily Statutory Compliance Bulletin",
      frequency: "Daily Shift Run",
      generatedOn: "27 Sep 2026 06:00",
      size: "1.4 MB",
      format: "PDF / CSV",
      description: "Shift-wise inspection summary, gas telemetry readout, and daily blast PPV ground vibration recordings.",
      recordsCount: 42,
    },
    {
      id: "REP-02",
      title: "Weekly Mine Safety & DGMS Governance Digest",
      frequency: "Weekly Statutory",
      generatedOn: "24 Sep 2026 18:00",
      size: "3.8 MB",
      format: "PDF",
      description: "Comprehensive review of HEMM maintenance, conveyor pull cord trips, and open CAPA resolution metrics.",
      recordsCount: 118,
    },
    {
      id: "REP-03",
      title: "Comprehensive DGMS & MoEFCC Inspection Summary",
      frequency: "Fortnightly",
      generatedOn: "22 Sep 2026 17:30",
      size: "4.2 MB",
      format: "PDF / EXCEL",
      description: "Statutory documentation of DGMS surprise visits, air & water quality monitoring, and topsoil plantation.",
      recordsCount: 65,
    },
    {
      id: "REP-04",
      title: "Contractor Safety & Labour Compliance Audit Matrix",
      frequency: "Monthly",
      generatedOn: "20 Sep 2026 12:00",
      size: "2.9 MB",
      format: "EXCEL",
      description: "Detailed compliance scorecard for ABC Mining, Shakti Infra, Eastern Coal Services, and 12 other contractors.",
      recordsCount: 15,
    },
    {
      id: "REP-05",
      title: "Overdue CAPA & Escalation Dossier",
      frequency: "Real-time Daily",
      generatedOn: "27 Sep 2026 12:00",
      size: "1.8 MB",
      format: "PDF",
      description: "Priority document listing all non-conformances exceeding statutory timeframes with assigned GM escalation levels.",
      recordsCount: 11,
    },
    {
      id: "REP-06",
      title: "AI Predictive Risk Intelligence & Anomaly Report",
      frequency: "Automated Daily",
      generatedOn: "27 Sep 2026 15:00",
      size: "2.2 MB",
      format: "PDF",
      description: "Neural cluster report detailing recurring patterns in North Pit Sector B, retarder interlocks, and risk weights.",
      recordsCount: 28,
    },
    {
      id: "REP-07",
      title: "Consolidated Coal Mine Governance Executive Report",
      frequency: "Monthly CIL HQ Format",
      generatedOn: "25 Sep 2026 10:00",
      size: "6.1 MB",
      format: "PDF / EXCEL",
      description: "Directorate-level summary incorporating production, safety index, environmental clearance, and budget audit.",
      recordsCount: 240,
    },
  ];

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast({
        type: "success",
        title: "Report Generated",
        message: `${activeReport.title} compiled with current live statutory data.`,
      });
    }, 800);
  };

  const handleDownloadPdf = () => {
    setShowPreviewModal(true);
    addToast({
      type: "success",
      title: "Statutory PDF Dossier Generated",
      message: `${activeReport.title} compiled with digital signature and QR verification seal.`,
    });
  };

  const handleExportExcel = () => {
    // Generate actual CSV download for prototype!
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Statutory Report ID,Title,Frequency,Generated Date,Status\n" +
      `${activeReport.id},"${activeReport.title}",${activeReport.frequency},${activeReport.generatedOn},VERIFIED\n` +
      "Item,Requirement,Status,Risk\n" +
      "1,Brake Retarder Telemetry,CLOSED,LOW\n" +
      "2,Slope Stability Radar,MONITORED,HIGH\n" +
      "3,MoEFCC Environmental Return,OVERDUE,HIGH\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeReport.id}_Report_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: "success",
      title: "Excel/CSV Exported",
      message: `Downloaded ${activeReport.id}_Report_Export.csv successfully.`,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-green" />
            <span>Statutory Report Generation & Export</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Official DGMS statutory formats, CIL board compliance digests, and MoEFCC six-monthly clearance dossiers.
          </p>
        </div>
      </div>

      {/* Main Grid: Report Selection + Preview / Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-mineBorder shadow-soft overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-mineBorder flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Available Governance Reports</h3>
            <span className="text-[11px] font-mono text-slate-400">7 Presets</span>
          </div>

          <div className="divide-y divide-mineBorder max-h-[550px] overflow-y-auto">
            {reports.map((rep) => {
              const isSelected = selectedReportId === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? "bg-blue-50/70 border-l-4 border-blue" : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue">{rep.id}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {rep.frequency}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-navy leading-snug">{rep.title}</h4>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{rep.description}</div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-600 flex-shrink-0">
                    {rep.format}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border-t border-mineBorder text-[11px] text-slate-500">
            Select a report above to generate, preview, or export.
          </div>
        </div>

        {/* Right: Selected Report Preview & Actions (Section 20) (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-mineBorder pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue">{activeReport.id}</span>
                <h3 className="text-base font-black text-navy mt-0.5">{activeReport.title}</h3>
                <p className="text-xs text-mineMuted mt-1">{activeReport.description}</p>
              </div>

              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue font-bold text-xs">
                {activeReport.frequency}
              </span>
            </div>

            {/* Metadata Card */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Last Generated</span>
                <span className="font-mono font-bold text-slate-800 mt-1 block">{activeReport.generatedOn}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Size</span>
                <span className="font-mono font-bold text-slate-800 mt-1 block">{activeReport.size}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Statutory Scope</span>
                <span className="font-mono font-bold text-purple mt-1 block">
                  {activeReport.recordsCount} Records
                </span>
              </div>
            </div>

            {/* Simulated Report Preview Document Box */}
            <div className="p-5 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1.5 flex justify-between">
                <span>[OFFICIAL STATUTORY RECORD DRAFT]</span>
                <span>CONFIDENTIAL</span>
              </div>
              <div className="text-slate-300">
                TITLE: {activeReport.title}
                <br />
                MINE: NORTH BLOCK OPEN CAST MINE (SECL)
                <br />
                GOVERNANCE RISK RATING: 72/100 (HIGH ATTENTION)
                <br />
                DGMS COMPLIANCE INDEX: 71.1%
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                SUMMARY OBSERVATIONS:
                <br />
                • Haul ramp Sector B berm height remediation: 1 Verified Closure
                <br />
                • Geotechnical SSR radar monitoring: OB Crest #4 within elastic limit
                <br />• Contractor VTC compliance: 14 pending renewal notices issued
              </div>
            </div>
          </div>

          {/* Action Buttons (Section 20) */}
          <div className="space-y-2 pt-3 border-t border-mineBorder">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-navy hover:bg-navy-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange" />
                <span>{isGenerating ? "Compiling..." : "GENERATE REPORT"}</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-red hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD PDF</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-green hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>EXPORT EXCEL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Form PDF Dossier Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-floating border border-mineBorder space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Official Government / Directorate Header */}
            <div className="border-b-2 border-navy pb-3 text-center space-y-1">
              <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                GOVERNMENT OF INDIA • MINISTRY OF COAL • DGMS STATUTORY COMPLIANCE
              </div>
              <h2 className="text-base font-black text-navy uppercase tracking-wide">
                {activeReport.title}
              </h2>
              <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-600 pt-0.5">
                <span>Dossier ID: <strong>{activeReport.id}/STAT/2026</strong></span>
                <span>•</span>
                <span>Date: <strong>{activeReport.generatedOn}</strong></span>
                <span>•</span>
                <span className="text-green-700 font-bold">SEAL: VERIFIED</span>
              </div>
            </div>

            {/* Mine Scope */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Operational Unit</span>
                <strong className="text-navy">North Block Open Cast Mine (SECL)</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Annual Capacity</span>
                <strong className="text-navy">12.5 MTPA Approved Lease</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Statutory Framework</span>
                <span className="text-slate-700">Mines Act 1952 / CMR 2017 Reg 106</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Executive Governance Score</span>
                <strong className="text-purple">72/100 (Prior) → 66/100 (Post-CAPA)</strong>
              </div>
            </div>

            {/* Findings Table */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase text-[11px] tracking-wider">
                Audited Statutory Non-Conformances & Verified Actions:
              </h4>
              <div className="border border-mineBorder rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-mineBorder text-[10px] font-bold text-slate-600">
                    <tr>
                      <th className="p-2">Ref ID</th>
                      <th className="p-2">Sector & Observation</th>
                      <th className="p-2">Statutory Mandate</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mineBorder text-[11px]">
                    <tr>
                      <td className="p-2 font-mono font-bold text-blue">CAPA-382</td>
                      <td className="p-2">North Pit Sector B Haul Ramp Berm Rebuilt (3.2m RL 240)</td>
                      <td className="p-2">CMR 2017 Reg 106</td>
                      <td className="p-2"><span className="text-green-700 font-bold">VERIFIED CLOSED</span></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono font-bold text-blue">INS-2000</td>
                      <td className="p-2">Dumper #D-408 Brake Retarder Interlock Testing</td>
                      <td className="p-2">DGMS Cir 04/2026</td>
                      <td className="p-2"><span className="text-green-700 font-bold">PASS (210 BAR)</span></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono font-bold text-blue">CMP-1003</td>
                      <td className="p-2">MoEFCC Environmental Clearance Half-Yearly Return</td>
                      <td className="p-2">EC Condition 14</td>
                      <td className="p-2"><span className="text-orange font-bold">SUBMISSION STAGED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Digital Signature Block */}
            <div className="border-t border-mineBorder pt-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-navy">Dr. Rajeshwar Sharma</div>
                <div className="text-[10px] text-slate-500">Chief Director of Mine Safety & Governance</div>
                <div className="text-[9px] font-mono text-slate-400">Digital Cert ID: SHA256:8f2a...c01e</div>
              </div>
              <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center font-mono text-[10px] text-green-800">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-0.5 text-green" />
                DGMS SEALED
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-mineBorder">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save Statutory PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
