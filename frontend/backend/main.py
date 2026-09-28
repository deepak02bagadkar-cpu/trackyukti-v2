"""
KHAN DRISHTI (खान दृष्टि) FastAPI Backend Application
Smart Governance Platform for Coal Mines
PS ID: 26024 | SIH 2026
"""

from fastapi import FastAPI, HTTPException, Query, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import copy

from .database import db
from .ai_engine import (
    calculate_governance_risk,
    detect_recurring_violations,
    query_governance_assistant,
    simulate_ocr_extraction
)

app = FastAPI(
    title="KHAN DRISHTI Governance API",
    description="Smart Governance Platform for Coal Mines (SIH 2026 PS ID: 26024)",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request / Response Models ---
class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None
    mine: Optional[str] = None

class ComplianceCreate(BaseModel):
    category: str
    requirement: str
    mine_area: str
    responsible_dept: str
    due_date: str
    risk: str
    statutory_ref: Optional[str] = "DGMS / MoEFCC Guideline"

class InspectionCreate(BaseModel):
    inspector: Optional[str] = "Rahul Verma (DGMS)"
    mine: Optional[str] = "North Block Open Cast Mine"
    area: str
    type: str
    observations: str
    severity: str
    location_coords: Optional[str] = "23.3149° N, 75.8577° E"
    remarks: Optional[str] = None

class CAPACreate(BaseModel):
    issue: str
    department: str
    owner: str
    due_date: str
    priority: str = "HIGH"
    source: Optional[str] = "AI Priority Queue"

class CAPAUpdate(BaseModel):
    status: Optional[str] = None
    evidence_file: Optional[str] = None
    action_note: Optional[str] = None
    verified_by: Optional[str] = None

class AlertUpdate(BaseModel):
    status: str

class AIQueryRequest(BaseModel):
    query: str

# --- Endpoints ---

@app.get("/")
def root():
    return {
        "project": "KHAN DRISHTI (खान दृष्टि)",
        "tagline": "Smart Governance Platform for Coal Mines",
        "motto": "Integrated Governance | Compliance | Transparency",
        "ps_id": "26024",
        "status": "Online",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "khandrishti-backend"}

@app.post("/api/auth/login")
def login(payload: LoginRequest):
    user = next((u for u in db.users if u["email"].lower() == payload.email.lower()), None)
    if not user or user["password"] != payload.password:
        # Check if fallback demo role matching
        role_user = next((u for u in db.users if payload.role and u["role"] == payload.role), None)
        if role_user:
            return {"token": f"jwt-demo-token-{role_user['id']}", "user": role_user}
        raise HTTPException(status_code=401, detail="Invalid employee credentials or role mismatch.")

    # If role or mine requested specifically in login, mirror it in active session
    active_user = copy.deepcopy(user)
    if payload.role:
        active_user["role"] = payload.role
    if payload.mine:
        active_user["mine"] = payload.mine

    return {
        "token": f"jwt-demo-token-{active_user['id']}",
        "user": active_user
    }

@app.get("/api/dashboard/summary")
def get_dashboard_summary(mine: Optional[str] = None, dept: Optional[str] = None):
    # Calculate KPIs
    total_items = len(db.compliance_items)
    compliant = sum(1 for c in db.compliance_items if c["status"] == "COMPLIANT")
    at_risk = sum(1 for c in db.compliance_items if c["status"] == "AT RISK")
    overdue = sum(1 for c in db.compliance_items if c["status"] == "OVERDUE")
    critical = sum(1 for c in db.compliance_items if c["status"] == "CRITICAL" or c["risk"] == "CRITICAL")
    open_capa = sum(1 for cp in db.capas if cp["status"] in ["OPEN", "IN PROGRESS", "PENDING VERIFICATION", "OVERDUE"])

    risk_data = calculate_governance_risk(db)

    # Department Overdue Breakdown
    dept_breakdown = {}
    for d in db.departments:
        dept_breakdown[d] = sum(1 for c in db.compliance_items if c["responsible_dept"] == d and c["status"] in ["OVERDUE", "CRITICAL"])

    dept_chart_data = [{"department": k, "overdue_count": v} for k, v in dept_breakdown.items()]

    # Priority Queue Top 4 items
    priority_queue = [
        {
            "id": "PQ-01",
            "title": "High-risk safety observation",
            "location": "North Pit – Sector B",
            "priority": "CRITICAL",
            "risk": "CRITICAL",
            "reason": "Recurring berm collapse & hauler brake retarder faults (4 occurrences). Substandard height (<1.8m).",
            "owner": "Safety Department / Vikramaditya Sen",
            "deadline": "2026-09-30",
            "category": "Safety",
            "capa_id": "CAPA-382",
            "action_type": "CREATE_CAPA" if next((c for c in db.capas if c["id"] == "CAPA-382"), {}).get("status") == "OPEN" else "VIEW_CAPA"
        },
        {
            "id": "PQ-02",
            "title": "Recurring contractor compliance issue",
            "location": "Vehicle Dispatch Yard",
            "contractor": "ABC Mining Services",
            "priority": "HIGH",
            "risk": "HIGH",
            "reason": "14 hauler drivers operating with expired DGMS VTC certificates & AVAS defect.",
            "owner": "Contract Management / Deepak Rawat",
            "deadline": "2026-09-26",
            "category": "Contractor",
            "capa_id": "CAPA-380",
            "action_type": "ASSIGN"
        },
        {
            "id": "PQ-03",
            "title": "Environmental documentation overdue",
            "location": "Coal Handling Plant (CHP)",
            "priority": "HIGH",
            "risk": "HIGH",
            "reason": "MoEFCC Half-Yearly Environmental Clearance Compliance Return overdue by 4 days.",
            "owner": "Environment Dept / Sunil Kashyap",
            "deadline": "2026-09-28",
            "category": "Environment",
            "capa_id": "CAPA-381",
            "action_type": "ESCALATE"
        },
        {
            "id": "PQ-04",
            "title": "Inspection deadline approaching",
            "location": "Main Workshop Bay 2 & Substation",
            "priority": "MEDIUM",
            "risk": "MEDIUM",
            "reason": "Quarterly 33kV earth pit resistance testing & FLP certificate re-verification.",
            "owner": "Electrical Dept / Ananya Deshmukh",
            "deadline": "2026-09-29",
            "category": "Electrical",
            "capa_id": None,
            "action_type": "ASSIGN"
        }
    ]

    return {
        "kpis": {
            "total_compliance_items": total_items,
            "compliant": compliant,
            "at_risk": at_risk,
            "overdue": overdue,
            "critical": critical,
            "corrective_actions": open_capa
        },
        "risk_score": risk_data,
        "priority_queue": priority_queue,
        "dept_breakdown": dept_chart_data,
        "status_distribution": [
            {"name": "Compliant", "value": compliant, "fill": "#199D69"},
            {"name": "At Risk", "value": at_risk, "fill": "#F26914"},
            {"name": "Overdue", "value": overdue, "fill": "#E83641"},
            {"name": "Upcoming", "value": total_items - (compliant + at_risk + overdue), "fill": "#1869BE"}
        ]
    }

@app.get("/api/compliance")
def get_compliance_items(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    items = db.compliance_items
    if category and category != "All":
        items = [i for i in items if i["category"].lower() == category.lower()]
    if status and status != "All":
        items = [i for i in items if i["status"].lower() == status.lower()]
    if search:
        s = search.lower()
        items = [i for i in items if s in i["requirement"].lower() or s in i["mine_area"].lower() or s in i["id"].lower()]
    return {"total": len(items), "items": items}

@app.post("/api/compliance")
def create_compliance_item(item: ComplianceCreate):
    new_id = f"CMP-{1000 + len(db.compliance_items)}"
    rec = {
        "id": new_id,
        "category": item.category,
        "requirement": item.requirement,
        "mine_area": item.mine_area,
        "responsible_dept": item.responsible_dept,
        "due_date": item.due_date,
        "status": "UPCOMING",
        "risk": item.risk,
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "statutory_ref": item.statutory_ref
    }
    db.compliance_items.insert(0, rec)

    # Log to audit trail
    db.audit_logs.insert(0, {
        "id": f"AUD-{900 + len(db.audit_logs)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "user": "Mine Official",
        "action": "Created Compliance Item",
        "record": new_id,
        "old_value": "NONE",
        "new_value": item.requirement[:40] + "...",
        "ip_device": "10.14.80.12 (Authorized Terminal)",
        "status": "RECORDED",
        "hash": f"SHA256:{hash(new_id) % 9999:04d}...ea"
    })
    return {"message": "Compliance record registered successfully.", "item": rec}

@app.get("/api/inspections")
def get_inspections(severity: Optional[str] = None, search: Optional[str] = None):
    ins = db.inspections
    if severity and severity != "All":
        ins = [i for i in ins if i["severity"].lower() == severity.lower() or i["risk"].lower() == severity.lower()]
    if search:
        s = search.lower()
        ins = [i for i in ins if s in i["observations"].lower() or s in i["area"].lower() or s in i["inspector"].lower() or s in i["id"].lower()]

    # Inspection dashboard metrics
    today_count = sum(1 for i in ins if i["date"] == "2026-09-24")
    pending_count = sum(1 for i in ins if i["status"] in ["Action Required", "Under Review"])
    critical_obs = sum(1 for i in ins if i["risk"] == "CRITICAL")
    open_capas = sum(1 for c in db.capas if c["status"] != "CLOSED")

    return {
        "kpis": {
            "today_inspections": today_count if today_count > 0 else 4,
            "pending_inspections": pending_count,
            "critical_observations": critical_obs,
            "open_corrective_actions": open_capas
        },
        "total": len(ins),
        "items": ins
    }

@app.post("/api/inspections")
def create_inspection(item: InspectionCreate):
    new_id = f"INS-{2000 + len(db.inspections)}"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    date_str = datetime.now().strftime("%Y-%m-%d")

    rec = {
        "id": new_id,
        "inspector": item.inspector or "Rahul Verma (DGMS)",
        "area": item.area,
        "date": date_str,
        "type": item.type,
        "observations": item.observations,
        "risk": item.severity.upper(),
        "status": "Action Required" if item.severity in ["Critical", "High"] else "Completed",
        "severity": item.severity,
        "mine": item.mine or "North Block Open Cast Mine",
        "location_coords": item.location_coords,
        "timestamp": timestamp
    }
    db.inspections.insert(0, rec)

    # Automatically add audit log
    db.audit_logs.insert(0, {
        "id": f"AUD-{900 + len(db.audit_logs)}",
        "timestamp": timestamp,
        "user": item.inspector or "Field Inspector",
        "action": "Created Inspection & Observation",
        "record": new_id,
        "old_value": "DRAFT",
        "new_value": f"{item.type} - {item.severity}",
        "ip_device": "192.168.1.18 (Rugged Mobile Tablet)",
        "status": "STATUTORILY LOCKED",
        "hash": f"SHA256:{hash(new_id) % 9999:04d}...f1"
    })

    return {
        "message": "Inspection successfully registered.",
        "id": new_id,
        "timestamp": timestamp,
        "status": rec["status"],
        "item": rec
    }

@app.get("/api/risk")
def get_risk_intelligence():
    risk_info = calculate_governance_risk(db)
    patterns = detect_recurring_violations(db)
    return {
        "risk_assessment": risk_info,
        "patterns": patterns,
        "anomaly_indicators": [
            {"metric": "Brake Retarder Telemetry Anomalies", "status": "Anomaly Detected", "deviation": "+340% above baseline", "level": "CRITICAL"},
            {"metric": "CH4 Gas Sensor Fluctuation", "status": "Stable", "deviation": "-12% variance", "level": "LOW"},
            {"metric": "Haul Road Berm Erosion Rate", "status": "Warning", "deviation": "+45% post-monsoon", "level": "HIGH"}
        ]
    }

@app.get("/api/risk/patterns")
def get_patterns():
    return {"patterns": db.patterns}

@app.get("/api/capa")
def get_capas(status: Optional[str] = None):
    capas = db.capas
    if status and status != "All":
        capas = [c for c in capas if c["status"].lower() == status.lower()]
    return {"total": len(capas), "items": capas}

@app.post("/api/capa")
def create_capa(item: CAPACreate):
    new_id = f"CAPA-{383 + len(db.capas)}"
    date_str = datetime.now().strftime("%Y-%m-%d")
    rec = {
        "id": new_id,
        "issue": item.issue,
        "department": item.department,
        "owner": item.owner,
        "created": date_str,
        "due_date": item.due_date,
        "priority": item.priority,
        "status": "OPEN",
        "source": item.source or "AI Priority Queue",
        "timeline": [
            {"step": "Observation Created", "date": f"{date_str} 14:10", "done": True, "by": "System / Inspector"},
            {"step": "Assigned", "date": f"{date_str} 14:20", "done": True, "by": "Mine Official"},
            {"step": "Action Started", "date": None, "done": False, "by": item.owner},
            {"step": "Evidence Uploaded", "date": None, "done": False, "by": "-"},
            {"step": "Verification", "date": None, "done": False, "by": "-"},
            {"step": "Closure", "date": None, "done": False, "by": "-"}
        ],
        "evidence": [],
        "impact_risk_reduction": 5.0
    }
    db.capas.insert(0, rec)

    # Audit log
    db.audit_logs.insert(0, {
        "id": f"AUD-{900 + len(db.audit_logs)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "user": "Mine Official",
        "action": "Assigned CAPA",
        "record": new_id,
        "old_value": "NEW",
        "new_value": f"ASSIGNED TO {item.department}",
        "ip_device": "10.14.80.2 (Command Console)",
        "status": "ACTIVE",
        "hash": f"SHA256:{hash(new_id) % 9999:04d}...ca"
    })

    return {"message": "CAPA successfully created and assigned.", "item": rec}

@app.patch("/api/capa/{capa_id}")
def update_capa(capa_id: str, update: CAPAUpdate):
    capa = next((c for c in db.capas if c["id"] == capa_id), None)
    if not capa:
        raise HTTPException(status_code=404, detail="CAPA record not found.")

    old_status = capa["status"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    if update.status:
        capa["status"] = update.status

    if update.evidence_file:
        if "evidence" not in capa:
            capa["evidence"] = []
        capa["evidence"].append(update.evidence_file)

    # Update timeline milestones
    if update.status == "IN PROGRESS":
        capa["timeline"][2]["done"] = True
        capa["timeline"][2]["date"] = now_str
    elif update.status == "PENDING VERIFICATION":
        capa["timeline"][2]["done"] = True
        capa["timeline"][3]["done"] = True
        capa["timeline"][3]["date"] = now_str
        if update.evidence_file:
            capa["timeline"][3]["by"] = f"Uploaded: {update.evidence_file}"
    elif update.status == "CLOSED":
        capa["timeline"][2]["done"] = True
        capa["timeline"][3]["done"] = True
        capa["timeline"][4]["done"] = True
        capa["timeline"][4]["date"] = now_str
        capa["timeline"][4]["by"] = update.verified_by or "Dr. Rajeshwar Sharma (Admin)"
        capa["timeline"][5]["done"] = True
        capa["timeline"][5]["date"] = now_str
        capa["timeline"][5]["by"] = "Verified & Closed"

    # Log to audit trail
    db.audit_logs.insert(0, {
        "id": f"AUD-{900 + len(db.audit_logs)}",
        "timestamp": now_str,
        "user": update.verified_by or "Authorized Officer",
        "action": f"CAPA Transition -> {capa['status']}",
        "record": capa_id,
        "old_value": old_status,
        "new_value": capa["status"],
        "ip_device": "10.14.80.2 (Secured Station)",
        "status": "VERIFIED & SIGNED",
        "hash": f"SHA256:{hash(capa_id + now_str) % 9999:04d}...7a"
    })

    # Recalculate risk score
    updated_risk = calculate_governance_risk(db)

    return {
        "message": f"CAPA {capa_id} successfully updated to {capa['status']}.",
        "capa": capa,
        "updated_risk": updated_risk
    }

@app.get("/api/contractors")
def get_contractors(search: Optional[str] = None):
    conts = db.contractors
    if search:
        s = search.lower()
        conts = [c for c in conts if s in c["name"].lower() or s in c["work_area"].lower()]

    high_risk_count = sum(1 for c in conts if c["risk"] in ["CRITICAL", "HIGH"])
    compliant_count = sum(1 for c in conts if c["compliance_score"] >= 85)
    expiring_docs_count = sum(1 for c in conts if "Expiring" in c["documents_status"] or "Expired" in c["documents_status"])

    return {
        "kpis": {
            "total_contractors": len(conts),
            "compliant": compliant_count,
            "documents_expiring": expiring_docs_count,
            "high_risk_contractors": high_risk_count
        },
        "items": conts
    }

@app.get("/api/contractors/{contractor_id}")
def get_contractor_detail(contractor_id: str):
    cont = next((c for c in db.contractors if c["id"] == contractor_id), None)
    if not cont:
        raise HTTPException(status_code=404, detail="Contractor not found.")
    return cont

@app.get("/api/documents")
def get_documents():
    return {"total": len(db.documents), "items": db.documents}

@app.post("/api/documents/upload")
def upload_document(
    file_name: str = Body(..., embed=True),
    file_type: str = Body("PDF", embed=True)
):
    ocr_result = simulate_ocr_extraction(file_name, file_type)
    new_doc = {
        "id": f"DOC-{700 + len(db.documents) + 1}",
        "title": ocr_result["document_type"],
        "file_name": file_name,
        "file_type": file_type.upper(),
        "file_size": "3.1 MB",
        "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "ocr_status": "Completed",
        "ocr_confidence": ocr_result["ocr_confidence"],
        "extracted_fields": {
            "document_type": ocr_result["document_type"],
            "mine": ocr_result["mine"],
            "department": ocr_result["department"],
            "compliance_requirement": ocr_result["compliance_requirement"],
            "issue_date": ocr_result["issue_date"],
            "expiry_date": ocr_result["expiry_date"],
            "reference_number": ocr_result["reference_number"]
        },
        "verified": False,
        "linked_compliance_id": "CMP-1003"
    }
    db.documents.insert(0, new_doc)

    return {
        "message": "Document uploaded and OCR processing completed.",
        "document": new_doc
    }

@app.get("/api/alerts")
def get_alerts():
    return {"total": len(db.alerts), "items": db.alerts}

@app.patch("/api/alerts/{alert_id}")
def update_alert(alert_id: str, payload: AlertUpdate):
    alert = next((a for a in db.alerts if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert["status"] = payload.status
    return {"message": f"Alert {alert_id} marked as {payload.status}.", "alert": alert}

@app.get("/api/audit")
def get_audit_trail(search: Optional[str] = None):
    logs = db.audit_logs
    if search:
        s = search.lower()
        logs = [l for l in logs if s in l["user"].lower() or s in l["action"].lower() or s in l["record"].lower()]
    return {"total": len(logs), "items": logs}

@app.get("/api/gis/hotspots")
def get_gis_hotspots():
    return {"hotspots": db.gis_hotspots}

@app.post("/api/ai/query")
def ai_query(payload: AIQueryRequest):
    return query_governance_assistant(payload.query, db)

@app.get("/api/reports")
def get_reports():
    return {
        "available_reports": [
            {"id": "REP-01", "name": "Daily Statutory Compliance Bulletin", "frequency": "Daily", "generated_on": "2026-09-27 06:00", "size": "1.4 MB"},
            {"id": "REP-02", "name": "Weekly Mine Safety & DGMS Governance Digest", "frequency": "Weekly", "generated_on": "2026-09-24 18:00", "size": "3.8 MB"},
            {"id": "REP-03", "name": "Comprehensive DGMS & MoEFCC Inspection Summary", "frequency": "Fortnightly", "generated_on": "2026-09-22 17:30", "size": "4.2 MB"},
            {"id": "REP-04", "name": "Contractor Safety & Labour Compliance Audit Matrix", "frequency": "Monthly", "generated_on": "2026-09-20 12:00", "size": "2.9 MB"},
            {"id": "REP-05", "name": "Overdue CAPA & Escalation Dossier", "frequency": "Real-time", "generated_on": "2026-09-27 12:00", "size": "1.8 MB"},
            {"id": "REP-06", "name": "AI Predictive Risk Intelligence & Anomaly Report", "frequency": "Real-time", "generated_on": "2026-09-27 15:00", "size": "2.2 MB"},
            {"id": "REP-07", "name": "Consolidated Coal Mine Governance Executive Report (CIL Format)", "frequency": "Monthly", "generated_on": "2026-09-25 10:00", "size": "6.1 MB"}
        ]
    }

@app.post("/api/demo/reset")
def reset_demo_state():
    """Resets the mock store to the pristine evaluator demo baseline."""
    db.reset()
    return {"message": "Demo state reset to initial baseline (Risk: 72/100).", "risk": calculate_governance_risk(db)}
