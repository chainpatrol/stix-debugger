export interface StixBase {
  type: string;
  spec_version: "2.1";
  id: string;
  created: string;
  modified: string;
  revoked?: boolean;
  labels?: string[];
  confidence?: number;
  lang?: string;
  external_references?: any[];
  object_marking_refs?: any[];
  granular_markings?: any[];
  name?: string;
  description?: string;
}

export interface StixIndicator extends StixBase {
  type: "indicator";
  pattern: string;
  pattern_type: string;
  valid_from: string;
}

export type StixRelationshipType = "indicates" | "mitigates" | "related-to";

export interface StixRelationship extends StixBase {
  type: "relationship";
  source_ref: string;
  target_ref: string;
  relationship_type: StixRelationshipType;
}

export interface StixMalware extends StixBase {
  type: "malware";
  malware_types?: string[];
}

export type StixObject = StixIndicator | StixRelationship | StixMalware;

export interface StixBundle {
  type: "bundle";
  id: string;
  spec_version: "2.1";
  objects: StixObject[];
}
