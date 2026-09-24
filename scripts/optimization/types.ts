import type { Catalog } from "../../types/content";
import type { EditorialGuide } from "../../content/seo-guides";

export const REPORT_VERSION = "1.0.0";
export type Source = { file: string; line?: number; recordId?: string };
export type Finding = {
  id: string;
  rule: string;
  ruleVersion: number;
  priority: "P0" | "P1" | "P2" | "P3";
  areas: ("SEO" | "AEO" | "GEO" | "images" | "links" | "measurement")[];
  urls: string[];
  sources: Source[];
  issue: string;
  evidence: { source: string; observedAt: string; detail: string }[];
  action: string;
  benefit: string;
  confidence: "high" | "medium" | "low";
  uncertainty: string;
  complexity: "low" | "medium" | "high";
  detectionSafe: true;
  approval: "editorial" | "technical" | "production";
  status: "new" | "persistent" | "resolved" | "suppressed";
  suppressionReason?: string;
};
export type AuditCatalog = Catalog & {
  sources: Record<string, Source>;
  promptGuides: Record<string, EditorialGuide>;
  hubGuides: Record<string, EditorialGuide>;
};
export type GraphNode = {
  id: string;
  kind: "page" | "prompt" | "category" | "collection" | "image" | "term";
  url?: string;
  published?: boolean;
  eligible?: boolean;
  label?: string;
};
export type GraphEdge = {
  from: string;
  to: string;
  kind:
    | "category"
    | "membership"
    | "image"
    | "term"
    | "related"
    | "counterpart"
    | "catalogue"
    | "collection-link"
    | "hub";
  // Membership/entity relationships are not necessarily rendered hyperlinks.
  link: boolean;
};
export type Report = {
  version: string;
  mode: "recommendation-only";
  observedAt: string;
  fingerprint: string;
  inventory: Record<string, number>;
  coverage: Record<string, "observed" | "unknown" | "stale" | "partial">;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  findings: Finding[];
  changes: {
    new: string[];
    persistent: string[];
    changed: string[];
    resolved: string[];
  };
  limitations: string[];
};
export type FindingInput = Omit<
  Finding,
  "id" | "ruleVersion" | "status" | "detectionSafe" | "evidence"
> & {
  key: string;
  evidence: string;
  evidenceSource?: string;
};
