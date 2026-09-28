"""
KHAN DRISHTI (खान दृष्टि) Backend Database & Seed Data Store
Statutory Indian Coal Mining Governance (DGMS / MoEFCC / CIL Compliant)
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import copy

# In-memory realistic store with full state management
class DataStore:
    def __init__(self):
        self.reset()

    def reset(self):
        self.users = [
            {
                "id": "USR-001",
                "name": "Dr. Rajeshwar Sharma",
                "email": "admin@khandrishti.demo",
                "password": "admin123",
                "role": "ADMIN",
                "designation": "Chief Director of Mine Safety & Governance",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL (South Eastern Coalfields Ltd)",
                "avatar": "RS"
            },
            {
                "id": "USR-002",
                "name": "Vikramaditya Sen",
                "email": "official@khandrishti.demo",
                "password": "official123",
                "role": "MINE_OFFICIAL",
                "designation": "General Manager (Operations & Compliance)",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL",
                "avatar": "VS"
            },
            {
                "id": "USR-003",
                "name": "Rahul Verma",
                "email": "inspector@khandrishti.demo",
                "password": "inspector123",
                "role": "INSPECTOR",
                "designation": "Statutory DGMS Dy. Director / Mining Inspector",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL",
                "avatar": "RV"
            },
            {
                "id": "USR-004",
                "name": "Sunita Mohanty",
                "email": "manager@khandrishti.demo",
                "password": "manager123",
                "role": "CORPORATE_MANAGER",
                "designation": "Executive Director (Safety & ESG), CIL HQ",
                "mine": "All Units",
                "subsidiary": "Coal India Limited",
                "avatar": "SM"
            },
            {
                "id": "USR-005",
                "name": "Anand R. Khurana",
                "email": "regulatory@khandrishti.demo",
                "password": "reg123",
                "role": "REGULATORY_VIEWER",
                "designation": "Statutory Auditor & MoEFCC Nominee",
                "mine": "All Units",
                "subsidiary": "DGMS & MoEFCC",
                "avatar": "AK"
            },
            # Backwards compatibility credentials
            {
                "id": "USR-001B",
                "name": "Dr. Rajeshwar Sharma",
                "email": "admin@coalshield.demo",
                "password": "admin123",
                "role": "ADMIN",
                "designation": "Chief Director of Mine Safety & Governance",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL",
                "avatar": "RS"
            },
            {
                "id": "USR-002B",
                "name": "Vikramaditya Sen",
                "email": "official@coalshield.demo",
                "password": "official123",
                "role": "MINE_OFFICIAL",
                "designation": "General Manager",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL",
                "avatar": "VS"
            },
            {
                "id": "USR-003B",
                "name": "Rahul Verma",
                "email": "inspector@coalshield.demo",
                "password": "inspector123",
                "role": "INSPECTOR",
                "designation": "DGMS Inspector",
                "mine": "Gevra Opencast Project",
                "subsidiary": "SECL",
                "avatar": "RV"
            }
        ]

        self.mines = [
            {"id": "MINE-01", "name": "North Block Open Cast Mine", "subsidiary": "SECL", "location": "Korba, Chhattisgarh", "lat": 22.3595, "lng": 82.7501, "production_mtpa": 12.5, "status": "Operational"},
            {"id": "MINE-02", "name": "Central Pit Underground Mine", "subsidiary": "BCCL", "location": "Dhanbad, Jharkhand", "lat": 23.7957, "lng": 86.4304, "production_mtpa": 4.2, "status": "Operational"},
            {"id": "MINE-03", "name": "East Sector Opencast", "subsidiary": "WCL", "location": "Nagpur, Maharashtra", "lat": 21.1458, "lng": 79.0882, "production_mtpa": 8.0, "status": "High Attention"},
            {"id": "MINE-04", "name": "South Open Cast Mine", "subsidiary": "MCL", "location": "Talcher, Odisha", "lat": 20.9500, "lng": 85.2167, "production_mtpa": 15.0, "status": "Operational"}
        ]

        self.departments = [
            "Mining", "Safety", "Electrical", "Mechanical", "Environment", "HR", "Contract Management"
        ]

        # 50+ Compliance Items
        self.compliance_items = [
            {
                "id": f"CMP-{1000 + i}",
                "category": cat,
                "requirement": req,
                "mine_area": area,
                "responsible_dept": dept,
                "due_date": due,
                "status": status,
                "risk": risk,
                "last_updated": "2026-09-24",
                "statutory_ref": ref
            }
            for i, (cat, req, area, dept, due, status, risk, ref) in enumerate([
                ("Safety", "DGMS Circular 04/2026 HEMM Brake Retarder Interlock Testing", "North Pit – Sector B", "Mechanical", "2026-09-28", "CRITICAL", "CRITICAL", "DGMS (Tech) S&T Cir. 04"),
                ("Safety", "Continuous Monitoring of Gas Telemetry (CH4 & CO) in Seam 4", "Central Pit Underground", "Safety", "2026-09-29", "AT RISK", "HIGH", "CMR 2017 Reg 169"),
                ("Safety", "Bench Height-to-Width Statutory Ratio Verification (Berm 3m)", "North Pit – Sector A", "Mining", "2026-10-05", "COMPLIANT", "LOW", "CMR 2017 Reg 106"),
                ("Environment", "MoEFCC Half-Yearly Environmental Clearance Compliance Return", "Coal Handling Plant", "Environment", "2026-09-20", "OVERDUE", "HIGH", "MoEFCC EC Condition 14"),
                ("Environment", "Ambient Air Quality PM10 & PM2.5 Continuous Monitoring Calibration", "CHP & Haul Road", "Environment", "2026-09-30", "UPCOMING", "MEDIUM", "CPCB / SPCB Consent III"),
                ("Labour", "DGMS Initial & Periodical Medical Examination (IME/PME) Compliance", "Central Mine Hospital", "HR", "2026-10-15", "COMPLIANT", "LOW", "Mines Rules 1955 R 29B"),
                ("Statutory", "Monthly Explosive Consumption Return Submission (Form 33)", "Magazine Enclosure", "Mining", "2026-09-22", "OVERDUE", "HIGH", "Explosives Rules 2008"),
                ("Contractor", "Statutory VTC (Vocational Training Center) Certificate for Hauler Drivers", "Workshop & Yard", "Contract Management", "2026-09-25", "OVERDUE", "CRITICAL", "MVTR 1966 Rule 6"),
                ("Safety", "Deep Hole Blasting Ground Vibration PPV Seismograph Audit", "East Sector Opencast", "Mining", "2026-10-02", "UPCOMING", "LOW", "DGMS DG Tech 07/17"),
                ("Electrical", "Flameproof Enclosure (FLP) FLP Testing in Hazardous Zone 1", "Central Pit Shaft 2", "Electrical", "2026-09-27", "CRITICAL", "CRITICAL", "CEA Regulations 2010 R 116"),
                ("Environment", "Effluent Treatment Plant (ETP) Discharge Heavy Metal Audit", "Mine Sump & Washery", "Environment", "2026-10-08", "COMPLIANT", "LOW", "Water Act 1974 Sec 25"),
                ("Mechanical", "Conveyor Belt Fire Resistant Antistatic (FRAS) Testing", "Overland Conveyor Line", "Mechanical", "2026-10-12", "COMPLIANT", "LOW", "IS 3181 DGMS Approved"),
                ("Safety", "Haul Road Berm Height Maintenance (Min 1.5x Dumper Tyre Diameter)", "North Pit Haul Road B", "Mining", "2026-09-26", "AT RISK", "HIGH", "DGMS Circular 02/2020"),
                ("Contractor", "Contractor Dumper Telematics & Speed Governor Calibration", "Vehicle Dispatch Yard", "Contract Management", "2026-09-24", "OVERDUE", "HIGH", "CIL Safety Policy 2024"),
                ("Labour", "Contract Labour Regulation & Abolition Act (CLRA) Wage Audit", "Admin Block", "HR", "2026-10-10", "COMPLIANT", "LOW", "CLRA Act 1970 Sec 21"),
                ("Statutory", "Quarterly Safety Committee Meeting Minutes Upload to DGMS Portal", "GM Conference Hall", "Safety", "2026-09-30", "UPCOMING", "MEDIUM", "Mines Rules 1955 R 29T"),
                ("Safety", "Slope Stability Radar (SSR) Alert Threshold Calibration", "Highwall North Face", "Mining", "2026-10-04", "COMPLIANT", "LOW", "CIL DGMS Guideline 2022"),
                ("Environment", "Overburden (OB) Dump Topsoil Preservation & Plantation Audit", "OB Dump #4", "Environment", "2026-10-20", "COMPLIANT", "LOW", "MoEFCC Clearance Cond 8"),
                ("Electrical", "Substation 33kV Earth Pit Resistance Testing (< 1.0 Ohm)", "Main Substation Sub-1", "Electrical", "2026-09-29", "AT RISK", "MEDIUM", "CEA Reg 2010 R 99"),
                ("Contractor", "ESI & EPF Statutory Return Verification for Shakti Infra Crew", "Contract Cell", "Contract Management", "2026-09-21", "OVERDUE", "HIGH", "EPF & MP Act 1952"),
                ("Safety", "Self-Contained Self-Rescuer (SCSR) Batch Expiry & Leak Check", "Underground Lamp Room", "Safety", "2026-10-01", "UPCOMING", "LOW", "CMR 2017 Reg 212"),
                ("Mechanical", "Shovel 12 Cu.M Hydraulic Pressure Relief Valve Certification", "Heavy Workshop Bay 3", "Mechanical", "2026-10-06", "COMPLIANT", "LOW", "DGMS Tech Cir 12/2019"),
                ("Safety", "Driver Operator Fatigue Monitoring System (DFMS) Telemetry Check", "Fleet Operations Desk", "Safety", "2026-09-28", "CRITICAL", "HIGH", "CIL AI Policy 2025"),
                ("Environment", "Piezometer Ground Water Table Level Weekly Recording", "Monitoring Well W-3", "Environment", "2026-09-29", "UPCOMING", "LOW", "CGWA NOC Cond 5"),
                ("Labour", "Mines Creche & Rest Shelter Sanitation Inspection", "Pithead Bath Area", "HR", "2026-10-14", "COMPLIANT", "LOW", "Mines Creche Rules 1966"),
                ("Statutory", "Annual Rescue Room Equipment Inspection & Mock Drill Log", "Mines Rescue Station", "Safety", "2026-10-03", "UPCOMING", "LOW", "Mines Rescue Rules 1985"),
                ("Safety", "Dust Extraction System Airflow Velocity Measurement in CHP", "Crusher House 1", "Safety", "2026-09-26", "AT RISK", "MEDIUM", "CMR 2017 Reg 143"),
                ("Contractor", "Eastern Coal Haulers Fitness Certs for 28 Tipper Trucks", "Gate 4 Logistics", "Contract Management", "2026-09-23", "OVERDUE", "CRITICAL", "Motor Vehicles Act"),
                ("Electrical", "Lightning Arrester Ground Continuity on High Mast Towers", "Pit Yard Floodlights", "Electrical", "2026-10-18", "COMPLIANT", "LOW", "CEA 2010 R 74"),
                ("Environment", "Water Sprinkling Log on Haul Roads (4-hour frequency)", "All Internal Haul Roads", "Environment", "2026-09-27", "AT RISK", "MEDIUM", "Air Act 1981 Sec 21"),
                ("Safety", "Emergency Siren & Warning System Weekly Audio Audit", "Mine Sub-Station Roof", "Safety", "2026-09-28", "COMPLIANT", "LOW", "Disaster Mgmt Plan 2024"),
                ("Mechanical", "Dragline Walking Cam Lub Oil Viscosity Analysis", "Opencast Bench 5", "Mechanical", "2026-10-09", "COMPLIANT", "LOW", "OEM Cat Manual Ch 7"),
                ("Statutory", "Quarterly Return Form E (Mine Production & Manpower)", "EDP Center", "Mining", "2026-10-15", "UPCOMING", "LOW", "Mines Act 1952 Sec 48"),
                ("Labour", "First Aid Room Kit Replenishment & Oxygen Cylinder Pressure", "First Aid Station 2", "Safety", "2026-09-30", "UPCOMING", "LOW", "Mines Rules 1955 R 44"),
                ("Contractor", "Bharat Industrial Safety Induction Records for 45 Fitters", "Contract HR Desk", "Contract Management", "2026-10-07", "COMPLIANT", "LOW", "DGMS VTC Rules"),
                ("Safety", "Underground Main Ventilation Fan (MVF) Water Gauge Check", "Exhaust Fan Shaft", "Mining", "2026-09-29", "COMPLIANT", "LOW", "CMR 2017 Reg 155"),
                ("Environment", "Noise Dosimetry Survey at Coal Screening Plant", "Screening Plant 2", "Environment", "2026-10-11", "COMPLIANT", "LOW", "DGMS (Tech) Cir 05/2016"),
                ("Safety", "Overburden Slope Tension Crack Settlement Markers Readout", "OB South Crest", "Mining", "2026-09-27", "CRITICAL", "CRITICAL", "CMR 2017 Reg 108"),
                ("Electrical", "Transformer Oil Breakdown Voltage (BDV) & DGA Testing", "Switchyard Sub-2", "Electrical", "2026-10-16", "COMPLIANT", "LOW", "IS 1866:2020"),
                ("Labour", "Personal Protective Equipment (PPE) Issuance Biometric Audit", "Safety Store Depot", "Safety", "2026-10-13", "COMPLIANT", "LOW", "DGMS Standard SOP 01"),
                ("Contractor", "Subcontractor Excavator Operator Competency Certificates", "East Sector Cut 2", "Contract Management", "2026-09-25", "OVERDUE", "HIGH", "DGMS Tech Cir 08/2021"),
                ("Safety", "Hauler Reversing Audio-Visual Alarm (AVAS) 100% Inspection", "Workshop Check Pit", "Safety", "2026-09-28", "AT RISK", "HIGH", "DGMS Tech Cir 01/2010"),
                ("Environment", "Fly Ash Backfilling Environmental Leaching Test Certificate", "Void Quarry 3", "Environment", "2026-10-22", "COMPLIANT", "LOW", "MoEFCC Notification 2021"),
                ("Statutory", "Notice of Opening/Sinking New Sump Pit to DGMS (Form I)", "Survey Office", "Mining", "2026-10-05", "UPCOMING", "MEDIUM", "Mines Act 1952 Sec 16"),
                ("Mechanical", "Dozer Blade Rollover Protective Structure (ROPS) Survey", "Dozer Maintenance Yard", "Mechanical", "2026-10-17", "COMPLIANT", "LOW", "ISO 3471 / DGMS"),
                ("Safety", "Underground Auxiliary Fan Interlocking with Power Circuit", "Seam 3 Heading East", "Electrical", "2026-09-29", "CRITICAL", "CRITICAL", "CMR 2017 Reg 160"),
                ("Labour", "Contractor Statutory Minimum Wages Payment Bank Advice Slip", "Accounts Section", "HR", "2026-10-07", "COMPLIANT", "LOW", "Payment of Wages Act"),
                ("Environment", "Solar Powered Continuous Water Sprinkler Pressure Check", "Dispatch Weighbridge", "Environment", "2026-10-02", "COMPLIANT", "LOW", "Green Mine Initiative"),
                ("Contractor", "Shakti Infra Safety Supervisor Deployment Ratio Check (1:20)", "North Pit Face 1", "Contract Management", "2026-09-26", "AT RISK", "HIGH", "Mines Rules 1955 R 34"),
                ("Statutory", "Monthly DGMS Form IV Statutory Accident / Dangerous Occurrence", "Safety Directorate", "Safety", "2026-10-01", "UPCOMING", "LOW", "Mines Act 1952 Sec 23"),
                ("Safety", "Conveyor Pull Cord & Belt Sway Switch Trip Calibration", "Main Trunk Conveyor", "Mechanical", "2026-10-04", "COMPLIANT", "LOW", "DGMS Circular 03/2014"),
                ("Electrical", "Earth Leakage Relay (ELR) Trip Test on High Voltage Panels", "Feeder Sub-4", "Electrical", "2026-09-29", "COMPLIANT", "LOW", "CEA 2010 R 100")
            ])
        ]

        # 30+ Inspections
        self.inspections = [
            {
                "id": f"INS-{2000 + i}",
                "inspector": insp,
                "area": area,
                "date": date,
                "type": itype,
                "observations": obs,
                "risk": risk,
                "status": status,
                "severity": sev,
                "mine": mine
            }
            for i, (insp, area, date, itype, obs, risk, status, sev, mine) in enumerate([
                ("Rahul Verma (DGMS)", "North Pit – Sector B", "2026-09-24", "Safety & DGMS Audit", "Recurring failure of brake retarder telemetry on 100T dumpers; berm height substandard (<1.8m)", "CRITICAL", "Action Required", "Critical", "North Block Open Cast Mine"),
                ("R. K. Meena", "Central Pit Seam 4", "2026-09-24", "Ventilation & Gas", "Methane trace 0.45% within limits, auxiliary fan ducting leaking at joint 14", "HIGH", "Action Required", "High", "Central Pit Underground Mine"),
                ("Sunil Kashyap", "Coal Handling Plant", "2026-09-23", "Environmental", "Water mist dust suppression nozzle clogged at hopper intake", "HIGH", "Under Review", "High", "North Block Open Cast Mine"),
                ("Rahul Verma (DGMS)", "North Pit Haul Road", "2026-09-22", "HEMM & Haulage", "AVAS warning buzzer found muted on 2 contractor dumpers (ABC Mining)", "CRITICAL", "Action Required", "Critical", "North Block Open Cast Mine"),
                ("Ananya Deshmukh", "Main Workshop Bay 2", "2026-09-22", "Electrical Safety", "Earth pit #4 showing 2.8 Ohms; loose cable terminal in welding booth", "MEDIUM", "Completed", "Medium", "North Block Open Cast Mine"),
                ("S. K. Murmu", "East Sector Opencast", "2026-09-21", "Blasting & Vibration", "Vibration monitoring at 300m boundary recorded 4.8 mm/s PPV (statutory limit 5 mm/s)", "HIGH", "Under Review", "High", "East Sector Opencast"),
                ("Rahul Verma (DGMS)", "North Pit – Sector B", "2026-09-18", "Safety & DGMS Audit", "Operator seatbelt sensor bypassed; oil leakage observed on steering pump line", "HIGH", "Completed", "High", "North Block Open Cast Mine"),
                ("R. K. Meena", "Underground Lamp Room", "2026-09-18", "Statutory Equipment", "3 SCSR units found past annual seal check interval", "MEDIUM", "Completed", "Medium", "Central Pit Underground Mine"),
                ("Sunil Kashyap", "Mine Effluent Sump", "2026-09-17", "Environmental", "TSS level 88 mg/l against norm of 100 mg/l; filter cloth requires backwash", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Praveen Nayak", "OB Dump #4 Crest", "2026-09-16", "Geotechnical / Slope", "Hairline settlement cracks noticed on crest slope; tension markers placed", "CRITICAL", "Action Required", "Critical", "North Block Open Cast Mine"),
                ("Rahul Verma (DGMS)", "North Pit – Sector B", "2026-08-28", "Surprise DGMS Check", "Loose boulders noted perched on upper bench face; excavator working in radius", "CRITICAL", "Action Required", "Critical", "North Block Open Cast Mine"),
                ("Deepak Rawat", "Vehicle Dispatch Yard", "2026-09-15", "Contractor Compliance", "Shakti Infra tipper trucks missing DGMS reflective prism tape", "MEDIUM", "Completed", "Medium", "North Block Open Cast Mine"),
                ("Ananya Deshmukh", "33kV Switchyard", "2026-09-14", "Electrical Statutory", "Fire extinguisher CO2 cylinder hydrostatic test due next week", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("S. K. Murmu", "Explosive Van Road", "2026-09-13", "Explosive Rules", "Static grounding chain worn out on PESO authorized transport van", "HIGH", "Completed", "High", "East Sector Opencast"),
                ("Rahul Verma (DGMS)", "North Pit – Sector B", "2026-08-12", "Safety & DGMS Audit", "Berm height on haul ramp found diminished; dumper wheel marks over crest edge", "HIGH", "Completed", "High", "North Block Open Cast Mine"),
                ("Sunil Kashyap", "Crusher Plant Area", "2026-09-12", "Noise & Dust", "Ambient noise at screen feed 86 dB(A); earmuffs issued and worn by crew", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("R. K. Meena", "Central Pit Shaft 1", "2026-09-11", "Winding & Ropes", "Winder cage braking distance within test tolerance (1.1m decelerator)", "LOW", "Completed", "Low", "Central Pit Underground Mine"),
                ("Praveen Nayak", "Highwall North Face", "2026-09-10", "Geotechnical Radar", "SSR data shows zero residual displacement over past 72 hours", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Deepak Rawat", "Gate 4 Contractor Hub", "2026-09-09", "Labour & Induction", "Eastern Coal Haulers 12 drivers completed mandatory refresher VTC course", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Rahul Verma (DGMS)", "Central Pit Seam 3", "2026-09-08", "Statutory Electrical", "FLP certificate for coal drill machine checked and validated", "LOW", "Completed", "Low", "Central Pit Underground Mine"),
                ("Ananya Deshmukh", "Main Substation Feeder 4", "2026-09-07", "Safety Interlocks", "ELR relay operated within 28 milliseconds on 100mA leakage test", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Sunil Kashyap", "Plant Nursery & Greenbelt", "2026-09-06", "Forest & Eco-restoration", "1,200 saplings planted along external overburden dump border", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("S. K. Murmu", "East Sector Magazine", "2026-09-05", "Explosive Security", "CCTV coverage 100% operational; lightning conductor passed continuity", "LOW", "Completed", "Low", "East Sector Opencast"),
                ("Deepak Rawat", "Heavy Workshop Bay 1", "2026-09-04", "Machinery Safeguard", "Overhead crane wire rope ultrasonic flaw detection test report verified", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("R. K. Meena", "Central Pit Trunk Road", "2026-09-03", "Dust Suppression", "Stone dust barriers filled with non-caking limestone dust", "LOW", "Completed", "Low", "Central Pit Underground Mine"),
                ("Rahul Verma (DGMS)", "Workshop Tyre Bay", "2026-09-02", "Tyre Safety", "Tyre inflation safety cage in sound structural condition", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Ananya Deshmukh", "CHP Conveyor Gallery 3", "2026-09-01", "Conveyor Safeguards", "Emergency pull wire switches tested on full 450m span", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Praveen Nayak", "South Open Cast Bench 2", "2026-08-30", "Pit Slope Audit", "Bench slope angle verified at 42 degrees (statutory max 45 degrees)", "LOW", "Completed", "Low", "South Open Cast Mine"),
                ("Sunil Kashyap", "Settling Tank Overflow", "2026-08-29", "Effluent Discharge", "pH reading 7.4; oil & grease trap skimmed and cleared", "LOW", "Completed", "Low", "North Block Open Cast Mine"),
                ("Deepak Rawat", "Contractor Labor Camp", "2026-08-26", "Welfare Audit", "RO drinking water dispenser filter replaced; hygienic kitchen maintained", "LOW", "Completed", "Low", "North Block Open Cast Mine")
            ])
        ]

        # 20+ CAPA Records
        self.capas = [
            {
                "id": "CAPA-382",
                "issue": "Recurring safety observation: Substandard haul road berms and dumper brake retarder failure in North Pit Sector B",
                "department": "Safety",
                "owner": "Vikramaditya Sen (GM Ops)",
                "created": "2026-09-24",
                "due_date": "2026-09-30",
                "priority": "CRITICAL",
                "status": "OPEN",
                "source": "AI Priority Queue / Inspection INS-2000",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-09-24 14:10", "done": True, "by": "Rahul Verma (DGMS Inspector)"},
                    {"step": "Assigned to Safety Dept", "date": "2026-09-24 14:35", "done": True, "by": "AI Governance Dispatcher"},
                    {"step": "Action Started", "date": "2026-09-24 15:00", "done": False, "by": "Pending Engineer Sign-off"},
                    {"step": "Evidence Uploaded", "date": None, "done": False, "by": "Safety Officer"},
                    {"step": "Statutory Verification", "date": None, "done": False, "by": "Authorized Official"},
                    {"step": "Closure", "date": None, "done": False, "by": "DGMS & Mine Official"}
                ],
                "evidence": [],
                "impact_risk_reduction": 6.0
            },
            {
                "id": "CAPA-381",
                "issue": "MoEFCC Half-Yearly Environmental Compliance Return overdue submission",
                "department": "Environment",
                "owner": "Sunil Kashyap (Env Officer)",
                "created": "2026-09-20",
                "due_date": "2026-09-28",
                "priority": "HIGH",
                "status": "IN PROGRESS",
                "source": "CMP-1003 Overdue",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-09-20 09:00", "done": True, "by": "System Alert"},
                    {"step": "Assigned", "date": "2026-09-20 09:30", "done": True, "by": "Vikramaditya Sen"},
                    {"step": "Action Started", "date": "2026-09-21 11:00", "done": True, "by": "Sunil Kashyap"},
                    {"step": "Evidence Uploaded", "date": None, "done": False, "by": "Pending Draft Annexure"},
                    {"step": "Verification", "date": None, "done": False, "by": "-"},
                    {"step": "Closure", "date": None, "done": False, "by": "-"}
                ],
                "evidence": ["Draft_EC_Annexure_VII.pdf"],
                "impact_risk_reduction": 3.5
            },
            {
                "id": "CAPA-380",
                "issue": "Contractor ABC Mining dumper driver VTC certificate expiry & AVAS defect",
                "department": "Contract Management",
                "owner": "Deepak Rawat (Contract Cell)",
                "created": "2026-09-22",
                "due_date": "2026-09-26",
                "priority": "CRITICAL",
                "status": "OVERDUE",
                "source": "INS-2003 / Contractor Audit",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-09-22 16:00", "done": True, "by": "Rahul Verma"},
                    {"step": "Assigned", "date": "2026-09-22 16:30", "done": True, "by": "Vikramaditya Sen"},
                    {"step": "Action Started", "date": "2026-09-23 10:00", "done": True, "by": "Deepak Rawat"},
                    {"step": "Evidence Uploaded", "date": None, "done": False, "by": "Pending Contractor Submission"},
                    {"step": "Verification", "date": None, "done": False, "by": "-"},
                    {"step": "Closure", "date": None, "done": False, "by": "-"}
                ],
                "evidence": [],
                "impact_risk_reduction": 4.0
            },
            {
                "id": "CAPA-379",
                "issue": "Highwall slope tension crack displacement sensor installation in North Crest",
                "department": "Mining",
                "owner": "Praveen Nayak (Survey Head)",
                "created": "2026-09-16",
                "due_date": "2026-09-25",
                "priority": "HIGH",
                "status": "PENDING VERIFICATION",
                "source": "INS-2009",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-09-16 11:30", "done": True, "by": "Praveen Nayak"},
                    {"step": "Assigned", "date": "2026-09-16 12:00", "done": True, "by": "Vikramaditya Sen"},
                    {"step": "Action Started", "date": "2026-09-17 08:30", "done": True, "by": "Geotech Team"},
                    {"step": "Evidence Uploaded", "date": "2026-09-24 16:45", "done": True, "by": "Praveen Nayak"},
                    {"step": "Verification", "date": None, "done": False, "by": "Awaiting GM Sign-off"},
                    {"step": "Closure", "date": None, "done": False, "by": "-"}
                ],
                "evidence": ["SSR_Tension_Prism_Telemetry_Report.pdf", "Site_Photograph_NorthCrest.jpg"],
                "impact_risk_reduction": 4.5
            },
            {
                "id": "CAPA-378",
                "issue": "Substation 33kV earth pit resistance remediation to bring under 1.0 Ohm",
                "department": "Electrical",
                "owner": "Ananya Deshmukh (Sr. EE)",
                "created": "2026-09-14",
                "due_date": "2026-09-23",
                "priority": "MEDIUM",
                "status": "CLOSED",
                "source": "INS-2004",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-09-14 14:00", "done": True, "by": "Ananya Deshmukh"},
                    {"step": "Assigned", "date": "2026-09-14 14:20", "done": True, "by": "Vikramaditya Sen"},
                    {"step": "Action Started", "date": "2026-09-15 09:00", "done": True, "by": "Electrical Crew"},
                    {"step": "Evidence Uploaded", "date": "2026-09-19 15:30", "done": True, "by": "Ananya Deshmukh"},
                    {"step": "Verification", "date": "2026-09-21 11:00", "done": True, "by": "Vikramaditya Sen"},
                    {"step": "Closure", "date": "2026-09-21 11:30", "done": True, "by": "Vikramaditya Sen"}
                ],
                "evidence": ["Bentonite_Chemical_Earthing_Test_0.84_Ohm.pdf"],
                "impact_risk_reduction": 2.0
            }
        ]

        # Add remaining 15 CAPAs
        for j in range(5, 20):
            self.capas.append({
                "id": f"CAPA-{377 - j}",
                "issue": f"Statutory audit non-conformance remediation item #{j}: safety shield, lighting, or dust filter",
                "department": ["Safety", "Mechanical", "Electrical", "Environment", "Mining"][j % 5],
                "owner": ["Vikramaditya Sen", "Sunil Kashyap", "Ananya Deshmukh", "Praveen Nayak", "Deepak Rawat"][j % 5],
                "created": f"2026-08-{10 + (j % 18):02d}",
                "due_date": f"2026-09-{15 + (j % 15):02d}",
                "priority": ["HIGH", "MEDIUM", "LOW", "MEDIUM"][j % 4],
                "status": ["CLOSED", "CLOSED", "IN PROGRESS", "PENDING VERIFICATION"][j % 4],
                "source": f"Audit-REC-{j}",
                "timeline": [
                    {"step": "Observation Created", "date": "2026-08-15", "done": True, "by": "System"},
                    {"step": "Assigned", "date": "2026-08-16", "done": True, "by": "Dept Head"},
                    {"step": "Action Started", "date": "2026-08-18", "done": True, "by": "Team Lead"},
                    {"step": "Evidence Uploaded", "date": "2026-08-25", "done": True, "by": "Officer"},
                    {"step": "Verification", "date": "2026-08-28", "done": True, "by": "DGMS Nominee"},
                    {"step": "Closure", "date": "2026-08-29", "done": True, "by": "General Manager"}
                ],
                "evidence": [f"Rectification_Certificate_{j}.pdf"],
                "impact_risk_reduction": 1.5
            })

        # 15+ Contractors
        self.contractors = [
            {
                "id": "CON-001",
                "name": "ABC Mining Services",
                "work_area": "North Pit Overburden Extraction",
                "compliance_score": 68,
                "documents_status": "2 Expiring, 1 Expired",
                "safety_observations": 14,
                "open_capa": 3,
                "risk": "CRITICAL",
                "contact_person": "Harish Patel (Site Incharge)",
                "phone": "+91 98261 45012",
                "deployment_count": 142,
                "heavy_equipment": 38,
                "documents": [
                    {"name": "DGMS VTC Driver Batch Certification", "expiry": "2026-09-25", "status": "EXPIRED"},
                    {"name": "Fleet Comprehensive Insurance & Fitness", "expiry": "2026-10-02", "status": "EXPIRING_SOON"},
                    {"name": "CLRA Form V Licence", "expiry": "2026-12-31", "status": "VALID"},
                    {"name": "EPF E-Sewa Challan Submission", "expiry": "2026-09-20", "status": "EXPIRED"}
                ],
                "recent_observations": [
                    "AVAS reverse horn disabled on Dumper #D-408",
                    "Hauler speed limit exceeded (34 km/h in 20 km/h bench zone)",
                    "Subcontractor welder operating without hot work permit"
                ]
            },
            {
                "id": "CON-002",
                "name": "Shakti Infra & Mining Ltd",
                "work_area": "East Sector Coal Haulage & Crushing",
                "compliance_score": 82,
                "documents_status": "1 Expiring",
                "safety_observations": 6,
                "open_capa": 1,
                "risk": "HIGH",
                "contact_person": "Ramanath Roy",
                "phone": "+91 94370 88219",
                "deployment_count": 96,
                "heavy_equipment": 24,
                "documents": [
                    {"name": "Safety Supervisor Competency Certs", "expiry": "2026-09-26", "status": "EXPIRING_SOON"},
                    {"name": "ESI Registration Proof", "expiry": "2027-03-31", "status": "VALID"},
                    {"name": "PESO Authorized Driver Clearances", "expiry": "2026-11-15", "status": "VALID"}
                ],
                "recent_observations": [
                    "Delay in submitting daily trip sheet logbook",
                    "Dust suppression pipe leak at feeder 2"
                ]
            },
            {
                "id": "CON-003",
                "name": "Eastern Coal Haulers",
                "work_area": "CHP Dispatch Logistics & Rail Siding",
                "compliance_score": 74,
                "documents_status": "1 Expired",
                "safety_observations": 9,
                "open_capa": 2,
                "risk": "HIGH",
                "contact_person": "Gopal Mukherjee",
                "phone": "+91 97321 04412",
                "deployment_count": 65,
                "heavy_equipment": 28,
                "documents": [
                    {"name": "Tipper Road Tax & PUC Records", "expiry": "2026-09-23", "status": "EXPIRED"},
                    {"name": "Mines Labour Welfare Fund Receipt", "expiry": "2026-10-30", "status": "VALID"}
                ],
                "recent_observations": [
                    "Overloading observed at weighbridge exit #2",
                    "Rear tail-lamp broken on tipper WB-38-9921"
                ]
            },
            {
                "id": "CON-004",
                "name": "Bharat Industrial Contractors Pvt Ltd",
                "work_area": "Mechanical & Electrical Maintenance Workshop",
                "compliance_score": 94,
                "documents_status": "All Valid",
                "safety_observations": 1,
                "open_capa": 0,
                "risk": "LOW",
                "contact_person": "K. Venkatesh",
                "phone": "+91 99801 11203",
                "deployment_count": 48,
                "heavy_equipment": 6,
                "documents": [
                    {"name": "ISO 45001 Safety Management Cert", "expiry": "2027-08-14", "status": "VALID"},
                    {"name": "All Worker Biometric Safety Card", "expiry": "2027-01-01", "status": "VALID"}
                ],
                "recent_observations": [
                    "Minor scrap metal unstacked near welding bay"
                ]
            }
        ]

        contractor_names = [
            ("Mahanadi Earthmovers Pvt Ltd", "South Pit Drilling & Blasting", 89, "LOW"),
            ("Chhota Nagpur Logix", "Internal OB Haulage", 71, "HIGH"),
            ("Jharkhand Power & Heavy Electricals", "Underground Substation AMC", 91, "LOW"),
            ("Kalinga Environmental Services", "Dust Suppression & Greenery", 86, "MEDIUM"),
            ("Satpura Mining Equipments AMC", "Dragline Spares Maintenance", 95, "LOW"),
            ("Vidarbha Drilling Corp", "Deep Exploration Boreholes", 78, "MEDIUM"),
            ("Singrauli Fuel Logistics", "CHP Siding Coal Loading", 69, "HIGH"),
            ("Durg Heavy Fabrication", "Structural Chute Maintenance", 84, "MEDIUM"),
            ("Ranchi Tyre & Rubber Co", "OTR Heavy Tyre Recapping", 92, "LOW"),
            ("Bilaspur Industrial Security", "Gate & Perimeter Surveillance", 96, "LOW"),
            ("Raigarh Geological Consultants", "Survey & Drone Photogrammetry", 98, "LOW")
        ]
        for idx, (cname, carea, cscore, crisk) in enumerate(contractor_names):
            self.contractors.append({
                "id": f"CON-{100 + idx}",
                "name": cname,
                "work_area": carea,
                "compliance_score": cscore,
                "documents_status": "Compliant" if cscore > 85 else "1 Pending Review",
                "safety_observations": 12 - int(cscore / 10),
                "open_capa": 1 if crisk == "HIGH" else 0,
                "risk": crisk,
                "contact_person": f"Site Lead {idx+1}",
                "phone": f"+91 98200 {10000 + idx}",
                "deployment_count": 30 + (idx * 5),
                "heavy_equipment": 5 + (idx * 2),
                "documents": [
                    {"name": "Statutory Registration", "expiry": "2027-03-31", "status": "VALID"},
                    {"name": "Safety SOP Compliance", "expiry": "2026-11-30", "status": "VALID"}
                ],
                "recent_observations": [
                    f"Routine scheduled inspection completed with score {cscore}%"
                ]
            })

        # 25+ Alerts
        self.alerts = [
            {
                "id": "ALT-501",
                "category": "CRITICAL",
                "title": "Critical safety observation requires statutory verification",
                "source": "North Pit – Sector B (DGMS Inspection INS-2000)",
                "priority": "CRITICAL",
                "assigned_to": "Vikramaditya Sen (GM Ops)",
                "time": "12 mins ago",
                "status": "UNACKNOWLEDGED",
                "description": "Recurring haul road berm failure and dumper brake retarder telemetry fault."
            },
            {
                "id": "ALT-502",
                "category": "DEADLINE",
                "title": "MoEFCC Compliance deadline is due in 48 hours",
                "source": "Coal Handling Plant (MoEFCC Half-Yearly Return)",
                "priority": "HIGH",
                "assigned_to": "Sunil Kashyap (Env Officer)",
                "time": "45 mins ago",
                "status": "ACKNOWLEDGED",
                "description": "Six-monthly EC compliance report submission window closing on DGMS/PARIVESH."
            },
            {
                "id": "ALT-503",
                "category": "AI RISK",
                "title": "Recurring violation pattern detected by AI Risk Engine",
                "source": "AI Clustering Engine (Pattern PAT-09)",
                "priority": "CRITICAL",
                "assigned_to": "Dr. Rajeshwar Sharma (Safety Directorate)",
                "time": "1 hour ago",
                "status": "UNACKNOWLEDGED",
                "description": "Similar safety observations recorded 4 times in North Pit Sector B within 45 days."
            },
            {
                "id": "ALT-504",
                "category": "DOCUMENT EXPIRY",
                "title": "Contractor ABC Mining VTC driver certification expired",
                "source": "Contractor Governance Portal",
                "priority": "HIGH",
                "assigned_to": "Deepak Rawat (Contract Cell)",
                "time": "2 hours ago",
                "status": "UNACKNOWLEDGED",
                "description": "14 hauler drivers operating without valid annual vocational refresher certificate."
            },
            {
                "id": "ALT-505",
                "category": "INSPECTION",
                "title": "Highwall slope tension crack markers require immediate reassessment",
                "source": "OB Dump #4 Geotechnical Sensor Array",
                "priority": "CRITICAL",
                "assigned_to": "Praveen Nayak (Survey Head)",
                "time": "3 hours ago",
                "status": "ACKNOWLEDGED",
                "description": "Tension crack width widened by 1.8mm following heavy monsoon precipitation."
            },
            {
                "id": "ALT-506",
                "category": "OVERDUE",
                "title": "CAPA-380 contractor corrective action past statutory deadline",
                "source": "CAPA Center",
                "priority": "HIGH",
                "assigned_to": "Deepak Rawat (Contract Cell)",
                "time": "4 hours ago",
                "status": "ESCALATED",
                "description": "Deadline of 2026-09-26 passed without submitted evidence."
            }
        ]

        alert_categories = ["DEADLINE", "AI RISK", "INSPECTION", "DOCUMENT EXPIRY", "CRITICAL", "OVERDUE"]
        for k in range(7, 26):
            self.alerts.append({
                "id": f"ALT-{500 + k}",
                "category": alert_categories[k % len(alert_categories)],
                "title": f"Statutory notice #{k}: {['Sensor calibration', 'Dust suppression check', 'VTC card renewal', 'DGMS Form return', 'Explosive van check'][k % 5]}",
                "source": f"Unit {k % 4 + 1} - Central Zone",
                "priority": ["HIGH", "MEDIUM", "LOW", "MEDIUM"][k % 4],
                "assigned_to": "Duty Safety Officer",
                "time": f"{k + 2} hours ago",
                "status": "ACKNOWLEDGED" if k % 2 == 0 else "UNACKNOWLEDGED",
                "description": "Automated compliance surveillance alert triggered by rule engine."
            })

        # 20+ Audit Records
        self.audit_logs = [
            {
                "id": "AUD-901",
                "timestamp": "2026-09-27 12:40",
                "user": "Dr. Rajeshwar Sharma (Admin)",
                "action": "Verified Closure",
                "record": "CAPA-378",
                "old_value": "PENDING VERIFICATION",
                "new_value": "CLOSED",
                "ip_device": "10.14.82.10 (Secured Intranet Workstation)",
                "status": "VERIFIED & SIGNED",
                "hash": "SHA256:8f2a...c01e"
            },
            {
                "id": "AUD-902",
                "timestamp": "2026-09-27 10:15",
                "user": "Ananya Deshmukh (Sr. EE)",
                "action": "Uploaded Evidence",
                "record": "CAPA-378",
                "old_value": "No Evidence",
                "new_value": "Bentonite_Chemical_Earthing_Test_0.84_Ohm.pdf",
                "ip_device": "10.14.82.44 (Engineering Lap-4)",
                "status": "COMPLETED",
                "hash": "SHA256:7b11...99ef"
            },
            {
                "id": "AUD-903",
                "timestamp": "2026-09-26 14:41",
                "user": "Vikramaditya Sen (Mine Official)",
                "action": "Assigned CAPA",
                "record": "CAPA-382",
                "old_value": "UNASSIGNED",
                "new_value": "ASSIGNED (Safety Dept)",
                "ip_device": "10.14.80.2 (GM Command Terminal)",
                "status": "DISPATCHED",
                "hash": "SHA256:3d4e...a55b"
            },
            {
                "id": "AUD-904",
                "timestamp": "2026-09-26 14:32",
                "user": "Rahul Verma (DGMS Inspector)",
                "action": "Created Safety Observation",
                "record": "OBS-1042 / INS-2000",
                "old_value": "DRAFT",
                "new_value": "STATUTORY OBSERVATION FILED",
                "ip_device": "192.168.1.18 (Rugged Field Tablet)",
                "status": "LOCKED",
                "hash": "SHA256:1a9c...734f"
            },
            {
                "id": "AUD-905",
                "timestamp": "2026-09-25 16:20",
                "user": "Deepak Rawat",
                "action": "Escalated Compliance Breach",
                "record": "CON-001 / ABC Mining",
                "old_value": "NORMAL",
                "new_value": "ESCALATED TO REGULATORY",
                "ip_device": "10.14.82.19 (Contract Cell)",
                "status": "NOTIFIED",
                "hash": "SHA256:4c22...b13a"
            }
        ]

        for m in range(6, 21):
            self.audit_logs.append({
                "id": f"AUD-{900 + m}",
                "timestamp": f"2026-09-{25 - (m % 10):02d} {10 + (m % 8):02d}:{15 + (m * 2) % 45:02d}",
                "user": ["Rahul Verma", "Vikramaditya Sen", "Sunil Kashyap", "Dr. Rajeshwar Sharma"][m % 4],
                "action": ["Inspection Submitted", "Document Uploaded", "Alert Acknowledged", "Risk Recalculated"][m % 4],
                "record": f"SYS-EVT-{100 + m}",
                "old_value": "ACTIVE",
                "new_value": "PROCESSED",
                "ip_device": f"10.14.80.{20 + m} (Authorized Client)",
                "status": "CRYPTOGRAPHICALLY SECURED",
                "hash": f"SHA256:{m}e8a...7f{m*3}"
            })

        # Documents for OCR
        self.documents = [
            {
                "id": "DOC-701",
                "title": "DGMS Form IV - Notice of Dangerous Occurrence & HEMM Brake Incident",
                "file_name": "DGMS_Form_IV_NorthPit_Sep2026.pdf",
                "file_type": "PDF",
                "file_size": "2.4 MB",
                "upload_time": "2026-09-24 11:30",
                "ocr_status": "Completed",
                "ocr_confidence": 98.4,
                "extracted_fields": {
                    "document_type": "DGMS Statutory Form IV (Notice of Occurrence)",
                    "mine": "North Block Open Cast Mine",
                    "department": "Safety & Operations",
                    "compliance_requirement": "Regulation 8 CMR 2017 Notice Filing",
                    "issue_date": "2026-09-24",
                    "expiry_date": "N/A (Statutory Historical Record)",
                    "reference_number": "DGMS/SECL/NB/2026/094"
                },
                "verified": True,
                "linked_compliance_id": "CMP-1049"
            },
            {
                "id": "DOC-702",
                "title": "MoEFCC Half-Yearly Environmental Clearance Compliance Return",
                "file_name": "MoEFCC_HalfYearly_EC_Return_Sep2026.pdf",
                "file_type": "PDF",
                "file_size": "4.8 MB",
                "upload_time": "2026-09-23 15:40",
                "ocr_status": "Completed",
                "ocr_confidence": 97.2,
                "extracted_fields": {
                    "document_type": "MoEFCC Environmental Clearance Compliance Report",
                    "mine": "North Block Open Cast Mine",
                    "department": "Environment",
                    "compliance_requirement": "MoEFCC EC Clearance Condition No. 14",
                    "issue_date": "2026-09-20",
                    "expiry_date": "2027-03-31",
                    "reference_number": "J-11015/342/2014-IA.II(M)"
                },
                "verified": False,
                "linked_compliance_id": "CMP-1003"
            },
            {
                "id": "DOC-703",
                "title": "Contractor Heavy Machinery Safety Fitness Certificate (ABC Mining)",
                "file_name": "ABC_Mining_HEMM_Fitness_Certs_Batch9.pdf",
                "file_type": "PDF",
                "file_size": "1.8 MB",
                "upload_time": "2026-09-21 09:15",
                "ocr_status": "Completed",
                "ocr_confidence": 96.0,
                "extracted_fields": {
                    "document_type": "Contractor Equipment Fitness & Non-Destructive Test Certificate",
                    "mine": "North Block Open Cast Mine",
                    "department": "Contract Management & Safety",
                    "compliance_requirement": "DGMS Circular 02 of 2020",
                    "issue_date": "2026-09-15",
                    "expiry_date": "2026-12-15",
                    "reference_number": "CERT/ABC/HEMM/2026/88"
                },
                "verified": True,
                "linked_compliance_id": "CMP-1007"
            }
        ]

        # GIS Hotspots
        self.gis_hotspots = [
            {
                "id": "HOT-01",
                "name": "North Pit – Sector B (Haul Ramp & Bench 4)",
                "risk": "CRITICAL",
                "category": "Safety",
                "x_percent": 34,
                "y_percent": 42,
                "issue": "Recurring berm collapse & hauler brake retarder faults (4 occurrences)",
                "department": "Safety & Mechanical",
                "status": "Action Mandated",
                "date": "2026-09-24",
                "capa_id": "CAPA-382",
                "elevation": "240m RL",
                "active_fleet": 18
            },
            {
                "id": "HOT-02",
                "name": "Overburden Dump #4 Crest",
                "risk": "CRITICAL",
                "category": "Geotechnical",
                "x_percent": 68,
                "y_percent": 25,
                "issue": "Slope tension crack sensor movement (1.8mm acceleration detected)",
                "department": "Mining",
                "status": "Monitored",
                "date": "2026-09-25",
                "capa_id": "CAPA-379",
                "elevation": "310m RL",
                "active_fleet": 4
            },
            {
                "id": "HOT-03",
                "name": "Coal Handling Plant (CHP) Crusher House",
                "risk": "HIGH",
                "category": "Environment",
                "x_percent": 52,
                "y_percent": 65,
                "issue": "MoEFCC return pending; dust suppression mist nozzle pressure drop",
                "department": "Environment",
                "status": "Under Review",
                "date": "2026-09-23",
                "capa_id": "CAPA-381",
                "elevation": "210m RL",
                "active_fleet": 8
            },
            {
                "id": "HOT-04",
                "name": "Central Pit Shaft 2 (Underground)",
                "risk": "HIGH",
                "category": "Safety",
                "x_percent": 22,
                "y_percent": 75,
                "issue": "Methane telemetry sensor drift; auxiliary duct joint leak",
                "department": "Safety",
                "status": "Maintenance Slated",
                "date": "2026-09-24",
                "capa_id": None,
                "elevation": "-120m RL",
                "active_fleet": 0
            },
            {
                "id": "HOT-05",
                "name": "Heavy Vehicle Maintenance Workshop Bay 3",
                "risk": "MODERATE",
                "category": "Contractor",
                "x_percent": 78,
                "y_percent": 70,
                "issue": "Contractor ABC Mining dumper driver VTC certifications expiring",
                "department": "Contract Management",
                "status": "Notice Issued",
                "date": "2026-09-22",
                "capa_id": "CAPA-380",
                "elevation": "225m RL",
                "active_fleet": 12
            },
            {
                "id": "HOT-06",
                "name": "South Open Cast Boundary & Greenbelt",
                "risk": "COMPLIANT",
                "category": "Environment",
                "x_percent": 82,
                "y_percent": 38,
                "issue": "Topsoil plantation & rainwater settling pond meeting CPCB discharge standard",
                "department": "Environment",
                "status": "Compliant",
                "date": "2026-09-26",
                "capa_id": None,
                "elevation": "230m RL",
                "active_fleet": 6
            }
        ]

        # Recurring Patterns
        self.patterns = [
            {
                "id": "PAT-01",
                "category": "Safety & Haulage Berm Stability",
                "location": "North Pit – Sector B",
                "occurrences": 4,
                "first_detected": "2026-08-12",
                "latest_detected": "2026-09-24",
                "ai_priority": "HIGH",
                "summary": "Similar safety observations have been recorded 4 times in the same operational category during the selected period.",
                "historical_records": [
                    {"date": "2026-08-12", "id": "INS-2014", "inspector": "Rahul Verma", "observation": "Berm height on haul ramp found diminished; dumper wheel marks over crest edge."},
                    {"date": "2026-08-28", "id": "INS-2010", "inspector": "Rahul Verma", "observation": "Loose boulders perched on upper bench face; excavator working in radius."},
                    {"date": "2026-09-18", "id": "INS-2006", "inspector": "Rahul Verma", "observation": "Operator seatbelt sensor bypassed; oil leakage on steering pump line."},
                    {"date": "2026-09-24", "id": "INS-2000", "inspector": "Rahul Verma", "observation": "Recurring failure of brake retarder telemetry on 100T dumpers; berm height substandard (<1.8m)."}
                ],
                "recommended_action": "Review root cause and verify effectiveness of corrective action.",
                "associated_capa_id": "CAPA-382",
                "explainability": {
                    "overdue_actions": "+3 overdue actions",
                    "repeated_observations": "+2 repeated observations in Sector B",
                    "statutory_deadline": "+1 approaching statutory deadline",
                    "contractor_issue": "+1 unresolved contractor issue (ABC Mining)"
                }
            }
        ]

db = DataStore()
