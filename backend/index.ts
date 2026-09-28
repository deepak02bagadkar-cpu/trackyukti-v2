export type Role = "ADMIN" | "MINE_OFFICIAL" | "INSPECTOR" | "CORPORATE_MANAGER" | "REGULATORY_VIEWER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  mine: string;
  subsidiary: string;
  avatar: string;
}

export interface ComplianceItem {
  id: string;
  category: "Safety" | "Environment" | "Labour" | "Production" | "Statutory" | "Contractor" | "Electrical" | "Mechanical";
  requirement: string;
  mine_area: string;
  responsible_dept: string;
  due_date: string;
  status: "COMPLIANT" | "UPCOMING" | "AT RISK" | "OVERDUE" | "CRITICAL";
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  last_updated: string;
  statutory_ref?: string;
}

export interface Inspection {
  id: string;
  inspector: string;
  area: string;
  date: string;
  type: string;
  observations: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "Action Required" | "Under Review" | "Completed";
  severity: string;
  mine: string;
  location_coords?: string;
  timestamp?: string;
}

export interface TimelineMilestone {
  step: string;
  date: string | null;
  done: boolean;
  by: string;
}

export interface CAPA {
  id: string;
  issue: string;
  department: string;
  owner: string;
  created: string;
  due_date: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN PROGRESS" | "PENDING VERIFICATION" | "CLOSED" | "OVERDUE";
  source: string;
  timeline: TimelineMilestone[];
  evidence: string[];
  impact_risk_reduction: number;
}

export interface ContractorDoc {
  name: string;
  expiry: string;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED";
}

export interface Contractor {
  id: string;
  name: string;
  work_area: string;
  compliance_score: number;
  documents_status: string;
  safety_observations: number;
  open_capa: number;
  risk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  contact_person: string;
  phone: string;
  deployment_count: number;
  heavy_equipment: number;
  documents: ContractorDoc[];
  recent_observations: string[];
}

export interface ExtractedFields {
  document_type: string;
  mine: string;
  department: string;
  compliance_requirement: string;
  issue_date: string;
  expiry_date: string;
  reference_number: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_size: string;
  upload_time: string;
  ocr_status: "Processing" | "Completed" | "Failed";
  ocr_confidence: number;
  extracted_fields: ExtractedFields;
  verified: boolean;
  linked_compliance_id: string;
}

export interface AlertItem {
  id: string;
  category: "CRITICAL" | "DEADLINE" | "OVERDUE" | "AI RISK" | "INSPECTION" | "DOCUMENT EXPIRY";
  title: string;
  source: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assigned_to: string;
  time: string;
  status: "UNACKNOWLEDGED" | "ACKNOWLEDGED" | "ESCALATED";
  description: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  record: string;
  old_value: string;
  new_value: string;
  ip_device: string;
  status: string;
  hash: string;
}

export interface RiskFactor {
  indicator: string;
  impact: string;
  detail: string;
}

export interface RiskComponent {
  name: string;
  weight: number;
  score: number;
  max: number;
  description: string;
}

export interface RiskScoreData {
  score: number;
  max_score: number;
  level: string;
  badge: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  is_capa_closed: boolean;
  change_note: string;
  components: RiskComponent[];
  explainability: {
    summary: string;
    factors: RiskFactor[];
    disclaimer: string;
  };
  trend_history: { period: string; score: number; benchmark: number }[];
}

export interface GISHotspot {
  id: string;
  name: string;
  risk: "CRITICAL" | "HIGH" | "MODERATE" | "COMPLIANT";
  category: string;
  x_percent: number;
  y_percent: number;
  issue: string;
  department: string;
  status: string;
  date: string;
  capa_id: string | null;
  elevation: string;
  active_fleet: number;
}

export interface RecurringPattern {
  id: string;
  category: string;
  location: string;
  occurrences: number;
  first_detected: string;
  latest_detected: string;
  ai_priority: string;
  summary: string;
  historical_records: {
    date: string;
    id: string;
    inspector: string;
    observation: string;
  }[];
  recommended_action: string;
  associated_capa_id: string;
  explainability: Record<string, string>;
}
