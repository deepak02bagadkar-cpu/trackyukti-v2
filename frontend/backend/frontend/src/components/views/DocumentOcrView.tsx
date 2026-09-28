"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { DocumentItem } from "../../types";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Edit3,
  Search,
  FileCheck,
  Cpu,
  Shield,
  Layers,
} from "lucide-react";

export const DocumentOcrView: React.FC = () => {
  const { documents, uploadDocument, verifyDocument, addToast, setActiveTab } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleSimulatedUpload = async (presetName: string, presetType: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    await uploadDocument(presetName, presetType);
    setIsProcessing(false);
    setSelectedDoc(documents[0]);
  };

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 800));
      await uploadDocument(file.name, file.name.split(".").pop() || "PDF");
      setIsProcessing(false);
      setSelectedDoc(documents[0]);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple" />
            <span>Document Intelligence & Statutory OCR</span>
          </h1>
          <p className="text-xs text-mineMuted mt-1">
            Optical Character Recognition and statutory field extraction for DGMS Form IV, EC returns, and HEMM certificates.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple border border-purple-200 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" /> AI OCR Engine: Online (98.4% Precision)
        </span>
      </div>

      {/* Upload Dropzone Section (Section 17) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-mineBorder shadow-soft text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple flex items-center justify-center mx-auto shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-navy">Upload Statutory Document for AI Field Extraction</h3>
          <p className="text-xs text-mineMuted mt-0.5">Supports PDF, JPG, PNG, DOCX up to 25MB</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <label className="cursor-pointer px-4 py-2 bg-navy hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
            <span>Browse Device</span>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.docx"
              onChange={handleCustomUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleSimulatedUpload("DGMS_Form_IV_AccidentNotice_Sep2026.pdf", "PDF")}
            disabled={isProcessing}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple border border-purple-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isProcessing ? "Processing OCR..." : "+ Sample DGMS Form IV (PDF)"}
          </button>

          <button
            onClick={() => handleSimulatedUpload("MoEFCC_HalfYearly_EC_Clearance_Return.pdf", "PDF")}
            disabled={isProcessing}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue border border-blue-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isProcessing ? "Processing OCR..." : "+ Sample MoEFCC EC Report"}
          </button>
        </div>
      </div>

      {/* Grid: Document List + Selected Document Extraction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Documents Table (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-mineBorder shadow-soft overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-mineBorder flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Processed Statutory Documents</h3>
            <span className="text-[11px] font-mono text-slate-400">{documents.length} Records</span>
          </div>

          <div className="divide-y divide-mineBorder max-h-[500px] overflow-y-auto">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? "bg-purple-50/70 border-l-4 border-purple" : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple">{doc.id}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          doc.verified ? "bg-green-100 text-green" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doc.verified ? "VERIFIED" : "PENDING VERIFICATION"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-navy leading-snug">{doc.title}</h4>
                    <div className="text-[11px] font-mono text-slate-500">{doc.file_name}</div>
                    <div className="text-[10px] text-slate-400">
                      Uploaded: {doc.upload_time} | Confidence: {doc.ocr_confidence}%
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-600">
                    {doc.file_type}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border-t border-mineBorder text-[11px] text-slate-500">
            Click document to inspect extracted statutory metadata and link to compliance records.
          </div>
        </div>

        {/* Right: AI Extracted Fields & Actions (Section 17) (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-mineBorder shadow-soft flex flex-col justify-between space-y-4">
          {selectedDoc ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-mineBorder pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple">{selectedDoc.id}</span>
                    <span className="text-[10px] bg-green-100 text-green font-bold px-2 py-0.5 rounded">
                      OCR STATUS: {selectedDoc.ocr_status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy mt-1">{selectedDoc.title}</h3>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">AI Confidence</div>
                  <div className="text-base font-black text-purple">{selectedDoc.ocr_confidence}%</div>
                </div>
              </div>

              {/* AI Extracted Fields Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple" />
                    <span>AI Extracted Fields</span>
                  </span>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="text-xs text-blue hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{editMode ? "Save Edits" : "Edit Fields"}</span>
                  </button>
                </div>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Document Type</span>
                    <span className="font-semibold text-navy">{selectedDoc.extracted_fields.document_type}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Mine</span>
                      <span className="font-semibold text-slate-800">{selectedDoc.extracted_fields.mine}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
                      <span className="font-semibold text-slate-800">{selectedDoc.extracted_fields.department}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance Requirement</span>
                    <span className="font-semibold text-navy">{selectedDoc.extracted_fields.compliance_requirement}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Date</span>
                      <span className="font-mono text-slate-700">{selectedDoc.extracted_fields.issue_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Expiry Date</span>
                      <span className="font-mono text-slate-700">{selectedDoc.extracted_fields.expiry_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reference No.</span>
                      <span className="font-mono text-blue font-bold truncate block">
                        {selectedDoc.extracted_fields.reference_number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Actions (Section 17) */}
              <div className="space-y-2 pt-2 border-t border-mineBorder">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => verifyDocument(selectedDoc.id)}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-green hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFY</span>
                  </button>

                  <button
                    onClick={() => {
                      addToast({
                        type: "info",
                        title: "Field Editor Activated",
                        message: "Statutory fields unlocked for manual metadata correction.",
                      });
                      setEditMode(!editMode);
                    }}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1 border border-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>

                  <button
                    onClick={() => {
                      addToast({
                        type: "success",
                        title: "Linked to Compliance Item",
                        message: `Document linked to ${selectedDoc.linked_compliance_id} in compliance register.`,
                      });
                      setActiveTab("compliance");
                    }}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-navy hover:bg-navy-800 text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>LINK TO COMPLIANCE</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select or upload a document to view AI-extracted statutory fields.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
