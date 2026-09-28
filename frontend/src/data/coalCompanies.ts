/**
 * KHAN DRISHTI (खान दृष्टि) Organization & Mine Hierarchy Master Seed File
 * SIH 2026 - Problem Statement 26024
 * 
 * Strict Structure:
 * Organization (Company/Subsidiary) -> Mines -> Areas/Projects -> Departments
 * 
 * Note: Clearly classified:
 * - CMPDI: Coal India Technical/Planning Institute
 * - SCCL: Independent State/Central PSU separate from Coal India Limited subsidiaries
 * - Records marked as DEMO DATA for prototype navigation
 */

export interface DepartmentNode {
  id: string;
  name: string;
  code: string;
}

export interface AreaNode {
  id: string;
  name: string;
  code: string;
  type: "Opencast Pit" | "Underground Section" | "Coal Handling Plant" | "Workshop & Yard" | "Exploration Project" | "Environmental Zone";
  departments: DepartmentNode[];
}

export interface MineNode {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  mine_type: "Opencast" | "Underground" | "Mixed (OC+UG)" | "Planning & Survey Institute";
  status: "Operational" | "High Attention" | "Surveillance Mandated" | "Planning Active";
  baseline_risk: number; // Deterministic risk score per mine
  risk_level: "HIGH ATTENTION" | "MODERATE ATTENTION" | "ELEVATED VULNERABILITY" | "CONTROLLED SURVEILLANCE";
  primary_issue: string;
  areas: AreaNode[];
  coordinates?: { lat: number; lng: number };
}

// Backward compatibility alias
export type CoalMine = MineNode;

export const MINE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "secl-gevra": { lat: 22.348, lng: 82.592 },
  "secl-kusmunda": { lat: 22.336, lng: 82.684 },
  "secl-dipka": { lat: 22.318, lng: 82.564 },
  "ncl-jayant": { lat: 24.120, lng: 82.634 },
  "ncl-dudhichua": { lat: 24.135, lng: 82.695 },
  "ncl-nigahi": { lat: 24.155, lng: 82.620 },
  "bccl-jharia": { lat: 23.742, lng: 86.415 },
  "bccl-kusunda": { lat: 23.785, lng: 86.398 },
  "bccl-katras": { lat: 23.805, lng: 86.290 },
  "mcl-talcher": { lat: 20.950, lng: 85.215 },
  "mcl-lakhanpur": { lat: 21.750, lng: 83.820 },
  "wcl-nagpur": { lat: 20.850, lng: 79.320 },
  "ecl-raniganj": { lat: 23.620, lng: 87.130 },
  "ccl-bokaro": { lat: 23.780, lng: 85.030 },
  "sccl-kothagudem": { lat: 17.550, lng: 80.620 },
  "cmpdi-hq": { lat: 23.360, lng: 85.320 },
  "cil-consolidated": { lat: 23.200, lng: 82.800 },
};

export const getMineCoordinates = (mineId?: string | null): { lat: number; lng: number } => {
  if (!mineId || mineId === "ALL_MINES") return { lat: 22.800, lng: 82.600 };
  return MINE_COORDINATES[mineId] || { lat: 22.348, lng: 82.592 };
};

export interface CoalCompany {
  id: string;
  name: string;
  code: string;
  full_name: string;
  headquarters: string;
  type: "CIL_HOLDING" | "CIL_OPERATING_SUBSIDIARY" | "CIL_TECHNICAL_INSTITUTE" | "NON_CIL_PUBLIC_SECTOR";
  is_mine_owning: boolean;
  notes?: string;
  mines: MineNode[];
}

export const COMMON_DEPARTMENTS: DepartmentNode[] = [
  { id: "dept-mine", name: "Mining Operations", code: "MINING" },
  { id: "dept-safe", name: "Safety & DGMS Liaison", code: "SAFETY" },
  { id: "dept-mech", name: "Mechanical & HEMM", code: "MECH" },
  { id: "dept-elec", name: "Electrical & Substation", code: "ELEC" },
  { id: "dept-env", name: "Environment & Forest Compliance", code: "ENV" },
  { id: "dept-hr", name: "HR & Labour Compliance", code: "HR" },
  { id: "dept-cont", name: "Contract Management & Logistics", code: "CONTRACT" },
];

export const CMPDI_DEPARTMENTS: DepartmentNode[] = [
  { id: "dept-survey", name: "Drone & Geological Survey", code: "SURVEY" },
  { id: "dept-drill", name: "Exploratory Drilling", code: "DRILLING" },
  { id: "dept-plan", name: "Mine Planning & Design", code: "PLANNING" },
  { id: "dept-geotech", name: "Geotechnical & Hydrogeology", code: "GEOTECH" },
  { id: "dept-eis", name: "Environmental Clearance EIA/EMP", code: "EIA" },
];

export const COAL_COMPANIES: CoalCompany[] = [
  {
    id: "cil",
    name: "Coal India Limited",
    code: "CIL",
    full_name: "Coal India Limited (Apex Maharatna Holding)",
    headquarters: "Newtown, Rajarhat, Kolkata, West Bengal",
    type: "CIL_HOLDING",
    is_mine_owning: false,
    notes: "Apex holding enterprise overseeing 7 mining subsidiaries & 1 technical planning institute.",
    mines: [
      {
        id: "cil-consolidated",
        name: "CIL Consolidated Multi-Mine View",
        code: "CIL-ALL",
        state: "Multi-State (India)",
        district: "All Coal Belts",
        mine_type: "Mixed (OC+UG)",
        status: "Operational",
        baseline_risk: 69,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Consolidated national compliance surveillance across 350+ operational units.",
        areas: [
          {
            id: "cil-all-areas",
            name: "National Coal Basin Grid",
            code: "BASIN-ALL",
            type: "Opencast Pit",
            departments: COMMON_DEPARTMENTS,
          },
        ],
      },
    ],
  },
  {
    id: "secl",
    name: "South Eastern Coalfields Limited",
    code: "SECL",
    full_name: "South Eastern Coalfields Limited",
    headquarters: "Seepat Road, Bilaspur, Chhattisgarh",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "secl-gevra",
        name: "Gevra Opencast Project",
        code: "GEVRA",
        state: "Chhattisgarh",
        district: "Korba",
        mine_type: "Opencast",
        status: "High Attention",
        baseline_risk: 72,
        risk_level: "HIGH ATTENTION",
        primary_issue: "North Pit Sector B haul ramp berm degradation & hauler brake retarder faults (4 occurrences).",
        areas: [
          { id: "gevra-north-pit", name: "North Pit – Sector B", code: "NP-SEC-B", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "gevra-south-bench", name: "South Deep Benches (RL 210m)", code: "SP-BENCH", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "gevra-chp", name: "Coal Handling Plant & Silo Loading", code: "CHP-SILO", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
          { id: "gevra-workshop", name: "Heavy Earth Moving Machinery Bay 3", code: "HEMM-WS", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
          { id: "gevra-ob-dump", name: "Overburden Dump #4 Crest", code: "OB-DUMP4", type: "Environmental Zone", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-kusmunda",
        name: "Kusmunda Opencast Mine",
        code: "KUSMUNDA",
        state: "Chhattisgarh",
        district: "Korba",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 64,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Overburden dump runoff after monsoon precipitation; dust suppression nozzle pressure fluctuations.",
        areas: [
          { id: "kusmunda-east-cut", name: "East Cut Quarry Face", code: "EC-QUARRY", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "kusmunda-central-ramp", name: "Central Haul Ramp 2", code: "CR-RAMP2", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "kusmunda-in-pit-chp", name: "In-Pit Crusher & Overland Conveyor", code: "CRUSH-CONV", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
          { id: "kusmunda-yard", name: "Dispatch Weighbridge Complex", code: "WB-DISP", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-dipka",
        name: "Dipka Opencast Project",
        code: "DIPKA",
        state: "Chhattisgarh",
        district: "Korba",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 58,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Piezometer water table baseline monitoring compliance; tipper vehicle tail-lamp audits.",
        areas: [
          { id: "dipka-deep-pit", name: "Deep Sump Cut Quarry", code: "DEEP-SUMP", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "dipka-siding", name: "Rail Siding Loading Wharf", code: "RL-SIDING", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
          { id: "dipka-maintenance", name: "Dozer & Grader Service Yard", code: "SVC-YARD", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-bhatgaon",
        name: "Bhatgaon Colliery",
        code: "BHATGAON",
        state: "Chhattisgarh",
        district: "Surajpur",
        mine_type: "Underground",
        status: "Operational",
        baseline_risk: 61,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Continuous gas chromatography check in Seam 2 heading; auxiliary fan ducting joint inspections.",
        areas: [
          { id: "bhatgaon-seam2", name: "Seam 2 East Development Heading", code: "SEAM2-EAST", type: "Underground Section", departments: COMMON_DEPARTMENTS },
          { id: "bhatgaon-shaft", name: "Main Winding Shaft 1", code: "SHAFT-1", type: "Underground Section", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-bishrampur",
        name: "Bishrampur Opencast Mine",
        code: "BISHRAMPUR",
        state: "Chhattisgarh",
        district: "Surguja",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 52,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Topsoil plantation density audit on external decoaled void slopes.",
        areas: [
          { id: "bishrampur-face", name: "Quarry 3 Active Highwall", code: "Q3-HIGHWALL", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "bishrampur-green", name: "Eco-Restoration Greenbelt Park", code: "ECO-PARK", type: "Environmental Zone", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-chirimiri",
        name: "Chirimiri Underground Colliery",
        code: "CHIRIMIRI",
        state: "Chhattisgarh",
        district: "Koriya",
        mine_type: "Underground",
        status: "Operational",
        baseline_risk: 67,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Depillaring roof strata convergence telemetry; self-rescuer SCSR batch verification.",
        areas: [
          { id: "chirimiri-panel-d", name: "Panel D Depillaring Section", code: "PANEL-D", type: "Underground Section", departments: COMMON_DEPARTMENTS },
          { id: "chirimiri-lamp", name: "Safety Lamp Room & Self-Rescuer Depot", code: "LAMP-ROOM", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-hasdeo",
        name: "Hasdeo Coal Complex",
        code: "HASDEO",
        state: "Chhattisgarh",
        district: "Korba",
        mine_type: "Mixed (OC+UG)",
        status: "Operational",
        baseline_risk: 63,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Effluent treatment plant TSS level monitoring during peak discharge.",
        areas: [
          { id: "hasdeo-incline", name: "No. 4 Incline Main Drift", code: "INC-4", type: "Underground Section", departments: COMMON_DEPARTMENTS },
          { id: "hasdeo-surface", name: "Surface Washery & Water Treatment", code: "ETP-SURF", type: "Environmental Zone", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "secl-korba",
        name: "Korba West Opencast",
        code: "KORBA-WEST",
        state: "Chhattisgarh",
        district: "Korba",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 59,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Electrical switchyard 33kV earth pit resistance testing within statutory 1.0 Ohm limits.",
        areas: [
          { id: "korba-bench", name: "Bench 5 Overburden Cut", code: "B5-OB", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "korba-sub", name: "Switchyard Substation 2", code: "SUB-2", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "ncl",
    name: "Northern Coalfields Limited",
    code: "NCL",
    full_name: "Northern Coalfields Limited",
    headquarters: "Singrauli, Madhya Pradesh",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "ncl-jayant",
        name: "Jayant Opencast Project",
        code: "JAYANT",
        state: "Madhya Pradesh",
        district: "Singrauli",
        mine_type: "Opencast",
        status: "High Attention",
        baseline_risk: 76,
        risk_level: "HIGH ATTENTION",
        primary_issue: "Deep hole blasting ground vibration PPV seismograph alerts near boundary village zone.",
        areas: [
          { id: "jayant-dragline", name: "Dragline Bench #6 Cut", code: "DL-B6", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "jayant-chp", name: "Rapid Loading System (RLS) Silo", code: "RLS-SILO", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
          { id: "jayant-workshop", name: "Heavy Workshop Bay 4 (240T Dumpers)", code: "WS-BAY4", type: "Workshop & Yard", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-nigahi",
        name: "Nigahi Opencast Project",
        code: "NIGAHI",
        state: "Madhya Pradesh",
        district: "Singrauli",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 61,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Slope stability radar alert threshold calibration on highwall East crest.",
        areas: [
          { id: "nigahi-highwall", name: "East Crest Highwall Face", code: "HW-EAST", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "nigahi-chp", name: "Overland Conveyor Corridor to NTPC", code: "NTPC-CONV", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-dudhichua",
        name: "Dudhichua Opencast Project",
        code: "DUDHICHUA",
        state: "Madhya Pradesh / Uttar Pradesh",
        district: "Singrauli / Sonbhadra",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 65,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Interstate boundary environmental dust monitoring station sensor synchronization.",
        areas: [
          { id: "dudhichua-bench-up", name: "UP Sector Bench 3", code: "BENCH-UP", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "dudhichua-bench-mp", name: "MP Sector Haul Road", code: "HR-MP", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-khadia",
        name: "Khadia Opencast Project",
        code: "KHADIA",
        state: "Uttar Pradesh",
        district: "Sonbhadra",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 57,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Contractor tipper speed governor and AVAS reverse alarm compliance checks.",
        areas: [
          { id: "khadia-pit", name: "Main Quarry Pit 2", code: "Q-PIT2", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "khadia-crusher", name: "Crusher Feeder Hoppers", code: "FEED-HOPP", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-bina",
        name: "Bina Opencast Project",
        code: "BINA",
        state: "Uttar Pradesh",
        district: "Sonbhadra",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 54,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Overburden dump bio-engineering topsoil stability verification.",
        areas: [
          { id: "bina-face", name: "South Face Excavation", code: "SF-EXCAV", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-amlohri",
        name: "Amlohri Opencast Project",
        code: "AMLOHRI",
        state: "Madhya Pradesh",
        district: "Singrauli",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 62,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Shovel hydraulic line high-pressure relief valve statutory annual recertification.",
        areas: [
          { id: "amlohri-bench", name: "Bench 4 Shovel Strip", code: "B4-SHOVEL", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ncl-block-b",
        name: "Block-B Opencast Project",
        code: "BLOCK-B",
        state: "Madhya Pradesh",
        district: "Singrauli",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 56,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Haul road water sprinkling frequency log validation (4-hour cycle).",
        areas: [
          { id: "blockb-quarry", name: "Main Quarry Basin", code: "MAIN-BASIN", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "mcl",
    name: "Mahanadi Coalfields Limited",
    code: "MCL",
    full_name: "Mahanadi Coalfields Limited",
    headquarters: "Jagriti Vihar, Burla, Sambalpur, Odisha",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "mcl-bhubaneswari",
        name: "Bhubaneswari Opencast Project",
        code: "BHUBANESWARI",
        state: "Odisha",
        district: "Angul",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 63,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Surface miner telematics dust suppression interlock verification.",
        areas: [
          { id: "bhub-face", name: "Surface Miner Extraction Cut", code: "SM-CUT", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "bhub-siding", name: "Talcher Rail Siding #3", code: "SIDING-3", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "mcl-lakhanpur",
        name: "Lakhanpur Opencast Mine",
        code: "LAKHANPUR",
        state: "Odisha",
        district: "Jharsuguda",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 58,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Ambient PM10 real-time continuous station calibration under SPCB norms.",
        areas: [
          { id: "lakhan-bench", name: "Bench 2 Opencast Cut", code: "OC-CUT2", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "mcl-belpahar",
        name: "Belpahar Opencast Mine",
        code: "BELPAHAR",
        state: "Odisha",
        district: "Jharsuguda",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 55,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Contract labour VTC induction card biometric reconciliation.",
        areas: [
          { id: "belpahar-quarry", name: "Quarry Cut #1", code: "Q-CUT1", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "mcl-bharatpur",
        name: "Bharatpur Opencast Project",
        code: "BHARATPUR",
        state: "Odisha",
        district: "Angul",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 68,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Overburden slope stability radar tension prism calibration post monsoon.",
        areas: [
          { id: "bharatpur-bench", name: "South Pit Highwall", code: "SP-HW", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "bccl",
    name: "Bharat Coking Coal Limited",
    code: "BCCL",
    full_name: "Bharat Coking Coal Limited",
    headquarters: "Koyla Bhawan, Koyla Nagar, Dhanbad, Jharkhand",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "bccl-moonidih",
        name: "Moonidih Underground Project",
        code: "MOONIDIH",
        state: "Jharkhand",
        district: "Dhanbad",
        mine_type: "Underground",
        status: "High Attention",
        baseline_risk: 78,
        risk_level: "HIGH ATTENTION",
        primary_issue: "Longwall shearer gas telemetry methane sensor drift & degasification drainage monitoring.",
        areas: [
          { id: "moonidih-longwall", name: "Longwall Face Panel 3", code: "LW-PANEL3", type: "Underground Section", departments: COMMON_DEPARTMENTS },
          { id: "moonidih-shaft", name: "Shaft #2 Cage Hoist System", code: "SHAFT-2", type: "Underground Section", departments: COMMON_DEPARTMENTS },
          { id: "moonidih-washery", name: "Moonidih Coal Washery", code: "WASH-PLANT", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "bccl-kusunda",
        name: "Kusunda Opencast Patch",
        code: "KUSUNDA-BCCL",
        state: "Jharkhand",
        district: "Dhanbad",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 73,
        risk_level: "HIGH ATTENTION",
        primary_issue: "Jharia fire area thermal drone monitoring and blanketing with inert material.",
        areas: [
          { id: "kusunda-fire-patch", name: "GOCP Fire Area Patch", code: "FIRE-PATCH", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "bccl-katras",
        name: "Katras Colliery Complex",
        code: "KATRAS",
        state: "Jharkhand",
        district: "Dhanbad",
        mine_type: "Mixed (OC+UG)",
        status: "Operational",
        baseline_risk: 66,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Flameproof electrical FLP enclosure testing in gaseous Seam VIII.",
        areas: [
          { id: "katras-heading", name: "Seam VIII Undergound Incline", code: "SEAM-VIII", type: "Underground Section", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "ccl",
    name: "Central Coalfields Limited",
    code: "CCL",
    full_name: "Central Coalfields Limited",
    headquarters: "Darbhanga House, Ranchi, Jharkhand",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "ccl-piparwar",
        name: "Piparwar Opencast Project",
        code: "PIPARWAR",
        state: "Jharkhand",
        district: "Chatra",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 62,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "In-pit mobile crusher conveyor pull wire trip safety switches routine test.",
        areas: [
          { id: "piparwar-pit", name: "Main Quarry In-Pit Crusher", code: "INPIT-CRUSH", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "piparwar-chp", name: "Overland Coal Conveyor Line", code: "OVERLAND-CV", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ccl-rajrappa",
        name: "Rajrappa Opencast Project",
        code: "RAJRAPPA",
        state: "Jharkhand",
        district: "Ramgarh",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 59,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Damodar river buffer zone environmental effluent discharge monitoring.",
        areas: [
          { id: "rajrappa-face", name: "Section 3 Quarry Face", code: "SEC3-FACE", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ccl-ashoka",
        name: "Ashoka Opencast Mine",
        code: "ASHOKA",
        state: "Jharkhand",
        district: "Chatra",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 60,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Heavy hauler speed telemetry monitoring on long North ramp.",
        areas: [
          { id: "ashoka-pit", name: "North Quarry Bench", code: "NQ-BENCH", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "ecl",
    name: "Eastern Coalfields Limited",
    code: "ECL",
    full_name: "Eastern Coalfields Limited",
    headquarters: "Sanctoria, Dishergarh, West Bengal",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "ecl-rajmahal",
        name: "Rajmahal Opencast Project",
        code: "RAJMAHAL",
        state: "Jharkhand",
        district: "Godda",
        mine_type: "Opencast",
        status: "High Attention",
        baseline_risk: 75,
        risk_level: "HIGH ATTENTION",
        primary_issue: "Geotechnical pit slope monitoring along deep sliding fault plane zone.",
        areas: [
          { id: "rajmahal-cut", name: "Main Open Pit Cut #3", code: "CUT-3", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "rajmahal-silo", name: "MGR Silo Loading Station (Farakka Link)", code: "MGR-SILO", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ecl-sonepur-bazari",
        name: "Sonepur Bazari Opencast Project",
        code: "SONEPUR-BAZARI",
        state: "West Bengal",
        district: "Paschim Bardhaman",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 63,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Dragline walking mechanism lubrication and ultrasonic crack detection audit.",
        areas: [
          { id: "sonepur-dragline", name: "Dragline Strip 2", code: "DL-STRIP2", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "ecl-jhanjra",
        name: "Jhanjra Underground Project",
        code: "JHANJRA",
        state: "West Bengal",
        district: "Paschim Bardhaman",
        mine_type: "Underground",
        status: "Operational",
        baseline_risk: 67,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Continuous Miner section dust suppression spray pressure compliance.",
        areas: [
          { id: "jhanjra-cm", name: "Continuous Miner Panel 1", code: "CM-PANEL1", type: "Underground Section", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "wcl",
    name: "Western Coalfields Limited",
    code: "WCL",
    full_name: "Western Coalfields Limited",
    headquarters: "Coal Estate, Civil Lines, Nagpur, Maharashtra",
    type: "CIL_OPERATING_SUBSIDIARY",
    is_mine_owning: true,
    mines: [
      {
        id: "wcl-umrer",
        name: "Umrer Opencast Mine",
        code: "UMRER",
        state: "Maharashtra",
        district: "Nagpur",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 60,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Ambient noise dosimetry survey near primary screening circuit.",
        areas: [
          { id: "umrer-pit", name: "Main Quarry Pit A", code: "PIT-A", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "umrer-chp", name: "Coal Dispatch Hopper", code: "DISP-HOPP", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "wcl-chandrapur",
        name: "Chandrapur Opencast Complex",
        code: "CHANDRAPUR",
        state: "Maharashtra",
        district: "Chandrapur",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 65,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Overburden dump summer dust control water cannon telemetry validation.",
        areas: [
          { id: "chandrapur-bench", name: "North Bench Strip", code: "NB-STRIP", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "cmpdi",
    name: "Central Mine Planning & Design Institute",
    code: "CMPDI",
    full_name: "Central Mine Planning & Design Institute (CIL Technical Institute)",
    headquarters: "Gondwana Place, Kanke Road, Ranchi, Jharkhand",
    type: "CIL_TECHNICAL_INSTITUTE",
    is_mine_owning: false,
    notes: "Technical research, exploration, mine planning, and statutory EIA preparation institution for Coal India.",
    mines: [
      {
        id: "cmpdi-ri3-ranchi",
        name: "CMPDI HQ & Regional Institute-III",
        code: "CMPDI-RI3",
        state: "Jharkhand",
        district: "Ranchi",
        mine_type: "Planning & Survey Institute",
        status: "Planning Active",
        baseline_risk: 32,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Satellite photogrammetry & slope stability modeling for highwall risk simulations.",
        areas: [
          { id: "cmpdi-geotech-lab", name: "Rock Mechanics & Geotech Laboratory", code: "GEOTECH-LAB", type: "Exploration Project", departments: CMPDI_DEPARTMENTS },
          { id: "cmpdi-drill-div", name: "Exploratory Deep Drilling Cell", code: "DRILL-CELL", type: "Exploration Project", departments: CMPDI_DEPARTMENTS },
        ],
      },
      {
        id: "cmpdi-ri5-bilaspur",
        name: "Regional Institute-V (SECL Domain)",
        code: "CMPDI-RI5",
        state: "Chhattisgarh",
        district: "Bilaspur",
        mine_type: "Planning & Survey Institute",
        status: "Planning Active",
        baseline_risk: 34,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "Pre-mining hydrogeological EIA modelling for Gevra mega-expansion.",
        areas: [
          { id: "cmpdi-ri5-survey", name: "Drone GIS Mapping Unit", code: "DRONE-GIS", type: "Exploration Project", departments: CMPDI_DEPARTMENTS },
        ],
      },
    ],
  },
  {
    id: "sccl",
    name: "The Singareni Collieries Company Limited",
    code: "SCCL",
    full_name: "The Singareni Collieries Company Limited (Joint PSU)",
    headquarters: "Kothagudem, Bhadradri Kothagudem, Telangana",
    type: "NON_CIL_PUBLIC_SECTOR",
    is_mine_owning: true,
    notes: "Independent Joint State/Central Government undertaking (51% Telangana Govt, 49% Ministry of Coal). Kept separate from CIL.",
    mines: [
      {
        id: "sccl-kothagudem",
        name: "Kothagudem Opencast Mine",
        code: "SCCL-KGM",
        state: "Telangana",
        district: "Bhadradri Kothagudem",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 63,
        risk_level: "MODERATE ATTENTION",
        primary_issue: "Highwall slope stability radar surveillance; blast vibration monitoring near railway line.",
        areas: [
          { id: "sccl-kgm-quarry", name: "Main Quarry Pit Section", code: "KGM-QP", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
          { id: "sccl-kgm-chp", name: "Silo & Rail Dispatch Siding", code: "KGM-SILO", type: "Coal Handling Plant", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "sccl-ramagundam",
        name: "Ramagundam Opencast Project-II",
        code: "SCCL-RG2",
        state: "Telangana",
        district: "Peddapalli",
        mine_type: "Opencast",
        status: "Operational",
        baseline_risk: 59,
        risk_level: "CONTROLLED SURVEILLANCE",
        primary_issue: "HEMM fleet collision avoidance sensor retrofitting and driver DFMS telemetry.",
        areas: [
          { id: "sccl-rg2-bench", name: "Bench 3 Extraction Face", code: "RG2-B3", type: "Opencast Pit", departments: COMMON_DEPARTMENTS },
        ],
      },
      {
        id: "sccl-srirampur",
        name: "Srirampur Underground Mine",
        code: "SCCL-SRP",
        state: "Telangana",
        district: "Mancherial",
        mine_type: "Underground",
        status: "Operational",
        baseline_risk: 71,
        risk_level: "HIGH ATTENTION",
        primary_issue: "Continuous environmental monitoring of carbon monoxide (CO) in sealed goaf zones.",
        areas: [
          { id: "sccl-srp-goaf", name: "Sealed Goaf Isolation Panel 2", code: "GOAF-P2", type: "Underground Section", departments: COMMON_DEPARTMENTS },
        ],
      },
    ],
  },
];
