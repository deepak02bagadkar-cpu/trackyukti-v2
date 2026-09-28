"""
KHAN DRISHTI (खान दृष्टि) AI Governance & Risk Intelligence Engine
Deterministic, Explainable AI / Decision-Support System
Statutory Indian Coal Mining Context (DGMS / MoEFCC / CIL)
"""

from typing import Dict, Any, List
from .database import db

def calculate_governance_risk(store=db) -> Dict[str, Any]:
    """
    Computes overall Mine Governance Risk Score and detailed component breakdown.
    Initial state evaluates to 72 / 100 ("HIGH ATTENTION").
    When CAPA-382 (Sector B recurring safety issue) is verified and closed,
    the score dynamically drops to 66 / 100 ("Risk reduced after verified corrective action").
    """
    # Check if CAPA-382 is closed
    capa_382 = next((c for c in store.capas if c["id"] == "CAPA-382"), None)
    is_capa_closed = capa_382 and capa_382["status"] == "CLOSED"
    is_capa_pending_verification = capa_382 and capa_382["status"] == "PENDING VERIFICATION"

    if is_capa_closed:
        score = 66
        risk_level = "MODERATE ATTENTION"
        risk_badge = "MODERATE"
        recurring_impact = 18.0
        overdue_impact = 14.5
        change_note = "Risk reduced after verified corrective action (72 → 66)"
    elif is_capa_pending_verification:
        score = 70
        risk_level = "HIGH ATTENTION"
        risk_badge = "HIGH"
        recurring_impact = 21.0
        overdue_impact = 16.0
        change_note = "Evidence under statutory verification by Mine Official"
    else:
        score = 72
        risk_level = "HIGH ATTENTION"
        risk_badge = "CRITICAL"
        recurring_impact = 24.5
        overdue_impact = 17.5
        change_note = "Initial AI baseline assessment"

    components = [
        {
            "name": "Overdue Actions",
            "weight": 25,
            "score": overdue_impact,
            "max": 25,
            "description": "3 critical CAPA actions past or nearing statutory deadlines"
        },
        {
            "name": "Recurring Violations",
            "weight": 25,
            "score": recurring_impact,
            "max": 25,
            "description": "Cluster detected: Haul ramp berm & retarder failures (North Pit B)"
        },
        {
            "name": "Inspection Risk",
            "weight": 20,
            "score": 14.0,
            "max": 20,
            "description": "Critical observations during recent surprise DGMS pit audit"
        },
        {
            "name": "Compliance Deadlines",
            "weight": 15,
            "score": 8.5,
            "max": 15,
            "description": "MoEFCC half-yearly return & Form 33 returns window active"
        },
        {
            "name": "Contractor Risk",
            "weight": 15,
            "score": 7.5,
            "max": 15,
            "description": "ABC Mining driver VTC lapse & heavy equipment safety audits"
        }
    ]

    explainability = {
        "summary": "AI decision-support analysis of 128 active compliance vectors.",
        "factors": [
            {"indicator": "+3 overdue actions", "impact": "High Risk", "detail": "CAPA-380, CAPA-381, CMP-1003"},
            {"indicator": "+2 repeated observations in Sector B" if not is_capa_closed else "✓ Corrective action verified for Sector B berms", "impact": "Resolved" if is_capa_closed else "Critical Pattern", "detail": "Haul road berm height <1.8m and brake retarder telemetry"},
            {"indicator": "+1 approaching statutory deadline", "impact": "Moderate Risk", "detail": "MoEFCC Half-Yearly Environmental Compliance Return (due in 48h)"},
            {"indicator": "+1 unresolved contractor issue", "impact": "High Risk", "detail": "ABC Mining Services VTC driver qualification audit"}
        ],
        "disclaimer": "AI-generated decision-support indicator. Not a substitute for statutory DGMS inspection or judicial review."
    }

    trend_history = [
        {"period": "Week 1 (Aug)", "score": 64, "benchmark": 50},
        {"period": "Week 2 (Aug)", "score": 68, "benchmark": 50},
        {"period": "Week 3 (Sep)", "score": 70, "benchmark": 50},
        {"period": "Week 4 (Sep)", "score": score, "benchmark": 50}
    ]

    return {
        "score": score,
        "max_score": 100,
        "level": risk_level,
        "badge": risk_badge,
        "is_capa_closed": is_capa_closed,
        "change_note": change_note,
        "components": components,
        "explainability": explainability,
        "trend_history": trend_history
    }

def detect_recurring_violations(store=db) -> List[Dict[str, Any]]:
    """
    Returns AI pattern clustering detections across inspection and compliance events.
    """
    return store.patterns

def query_governance_assistant(query: str, store=db) -> Dict[str, Any]:
    """
    Conversational AI Governance Assistant ('KHAN DRISHTI INTELLIGENCE')
    Returns structured, explainable responses with actionable citations.
    """
    q = query.lower()

    if "why" in q and ("score" in q or "risk" in q or "high" in q):
        risk_info = calculate_governance_risk(store)
        return {
            "query": query,
            "response": (
                f"The current Mine Governance Risk Score is **{risk_info['score']} / 100** ({risk_info['level']}).\n\n"
                "**Primary Drivers of Elevated Risk Exposure:**\n"
                "• **3 Overdue Corrective Actions**: Delayed response on dumper brake checks and VTC certification.\n"
                "• **Recurring Safety Observations in North Pit – Sector B**: 4 repeated incidents of berm height degradation and brake telemetry alerts.\n"
                "• **Approaching Statutory Deadline**: MoEFCC Half-Yearly Environmental Return due within 48 hours.\n"
                "• **Contractor Governance Gap**: ABC Mining Services has 2 expiring safety documents and 1 expired driver certification.\n\n"
                "**Recommended Action Priority**:\n"
                "Assign CAPA-382 to the Safety Department and mandate certified berm height reconstruction before next dumper hauling shift."
            ),
            "suggested_actions": [
                {"label": "View AI Priority Queue", "route": "/ai-risk"},
                {"label": "Inspect Sector B Pattern", "route": "/inspections"},
                {"label": "Open CAPA Center", "route": "/capa"}
            ],
            "citations": ["DGMS Cir 04/2026", "CMR 2017 Reg 106", "CAPA-382", "INS-2000"]
        }

    if "contractor" in q:
        return {
            "query": query,
            "response": (
                "**Contractor Risk Assessment Summary**:\n\n"
                "• **Highest Risk**: **ABC Mining Services** (Score: 68%, 14 safety observations, 3 open CAPAs, 1 expired VTC driver license).\n"
                "• **Moderate Risk**: **Eastern Coal Haulers** (Score: 74%, 2 tippers expired PUC / fitness).\n"
                "• **Best Performer**: **Bharat Industrial Contractors Pvt Ltd** (Score: 94%, zero open CAPA, 100% biometric safety cards).\n\n"
                "**Immediate Statutory Mandate**:\n"
                "Enforce DGMS Vocational Training Certificate (VTC) verification for all 142 deployed personnel of ABC Mining before shift entry."
            ),
            "suggested_actions": [
                {"label": "Open Contractor Governance", "route": "/contractors"},
                {"label": "Audit ABC Mining Profile", "route": "/contractors?id=CON-001"}
            ],
            "citations": ["MVTR 1966 Rule 6", "CLRA Act 1970", "CON-001"]
        }

    if "recurring" in q or "pattern" in q:
        return {
            "query": query,
            "response": (
                "**Recurring Violation Pattern Detected [PAT-01]**:\n\n"
                "• **Location**: North Pit – Sector B (Haul Ramp B & Bench 4)\n"
                "• **Category**: Safety & Haulage Berm Stability\n"
                "• **Occurrences**: 4 distinct incidents logged between 12 Aug 2026 and 24 Sep 2026\n"
                "• **Severity**: CRITICAL\n"
                "• **Key Observation**: Berm height measured at 1.4m to 1.8m (statutory minimum is 3.0m / 1.5x tyre diameter of 100T dumpers).\n\n"
                "**Root Cause Diagnosis**:\n"
                "Heavy monsoon runoff coupled with grader maintenance delay has caused repetitive washouts along the outer crest."
            ),
            "suggested_actions": [
                {"label": "Review Recurring Pattern", "route": "/ai-risk"},
                {"label": "Create / View CAPA-382", "route": "/capa?id=CAPA-382"}
            ],
            "citations": ["DGMS Circular 02/2020", "CMR 2017 Reg 106", "INS-2000", "INS-2014"]
        }

    if "immediate" in q or "attention" in q or "critical" in q:
        return {
            "query": query,
            "response": (
                "**Top 3 Immediate Attention Priorities Requiring Intervention**:\n\n"
                "1. **North Pit – Sector B Berm & Retarder Interlock [CRITICAL]**:\n"
                "   Inspection INS-2000 flagged non-functional brake telemetry and crest edge degradation. Associated with CAPA-382.\n"
                "2. **Overburden Dump #4 Slope Tension Markers [CRITICAL]**:\n"
                "   Geotechnical crack displacement of 1.8mm detected. Tension prisms require physical reassessment.\n"
                "3. **MoEFCC Environmental Return [HIGH - Statutory Deadline]**:\n"
                "   Due in under 48 hours for Coal Handling Plant. Form IV draft pending final GM signature."
            ),
            "suggested_actions": [
                {"label": "Open Command Center", "route": "/"},
                {"label": "Inspect GIS Map Hotspots", "route": "/mine-map"}
            ],
            "citations": ["CAPA-382", "CAPA-379", "CMP-1003"]
        }

    # Default fallback structured response
    return {
        "query": query,
        "response": (
            f"**KHAN DRISHTI (खान दृष्टि) Statutory Intelligence Analysis for:** *\"{query}\"*\n\n"
            "• **Compliance State**: 91 items compliant out of 128 monitored statutory obligations (71.1% compliance rate).\n"
            "• **Active Risk Load**: 8 Critical items, 18 At Risk, 11 Overdue actions.\n"
            "• **AI Governance Advice**: Focus immediate field resources on North Pit haulage safety and contractor documentation compliance.\n\n"
            "All data is synced with statutory DGMS, MoEFCC, and Coal India Limited governance standards."
        ),
        "suggested_actions": [
            {"label": "View All Compliance Items", "route": "/compliance"},
            {"label": "Review Inspection Records", "route": "/inspections"}
        ],
        "citations": ["DGMS Tech Circulars", "Mines Act 1952", "CMR 2017"]
    }

def simulate_ocr_extraction(file_name: str, file_type: str) -> Dict[str, Any]:
    """
    Simulates high-precision OCR extraction for uploaded mining statutory documents.
    """
    fn_lower = file_name.lower()
    if "dgms" in fn_lower or "form" in fn_lower or "notice" in fn_lower:
        return {
            "document_type": "DGMS Statutory Form IV (Notice of Occurrence)",
            "mine": "North Block Open Cast Mine",
            "department": "Safety & Operations",
            "compliance_requirement": "Regulation 8 CMR 2017 Notice Filing",
            "issue_date": "2026-09-24",
            "expiry_date": "N/A (Statutory Historical Record)",
            "reference_number": f"DGMS/SECL/NB/2026/{hash(file_name) % 900 + 100}",
            "ocr_status": "Completed",
            "ocr_confidence": 98.6,
            "extracted_text_snippet": "MINES ACT 1952 - FORM IV. Notice of accident/occurrence at North Pit Sector B. Date of event: 2026-09-24. Type: Dumper brake telemetry retarder trip without injury. Berm buffer prevented spillover."
        }
    elif "ec" in fn_lower or "env" in fn_lower or "moef" in fn_lower:
        return {
            "document_type": "MoEFCC Environmental Clearance Compliance Report",
            "mine": "North Block Open Cast Mine",
            "department": "Environment",
            "compliance_requirement": "MoEFCC EC Clearance Condition No. 14",
            "issue_date": "2026-09-20",
            "expiry_date": "2027-03-31",
            "reference_number": "J-11015/342/2014-IA.II(M)",
            "ocr_status": "Completed",
            "ocr_confidence": 97.4,
            "extracted_text_snippet": "MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE. Half-Yearly Compliance Status Report for North Block Opencast Mine (12.5 MTPA). Condition 14: Continuous ambient air monitoring stations PM10 82 ug/m3."
        }
    else:
        return {
            "document_type": "Contractor Equipment Fitness & Non-Destructive Test Certificate",
            "mine": "North Block Open Cast Mine",
            "department": "Contract Management & Safety",
            "compliance_requirement": "DGMS Circular 02 of 2020 (HEMM Safety Standard)",
            "issue_date": "2026-09-15",
            "expiry_date": "2026-12-15",
            "reference_number": f"CERT/HEMM/2026/{hash(file_name) % 800 + 100}",
            "ocr_status": "Completed",
            "ocr_confidence": 96.5,
            "extracted_text_snippet": "HEMM NON-DESTRUCTIVE TESTING & STATUTORY BRAKE TEST CERTIFICATE. Equipment: Cat 777D 100T Dumper. Hydraulic steering pressure: 210 bar. Parking and service brakes certified under DGMS circular guidelines."
        }
