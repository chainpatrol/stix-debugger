import type { StixRelationship, StixRelationshipType } from "../types";
import { uuid } from "../utils";

export class RelationshipBuilder {
  private relationship: StixRelationship;

  constructor() {
    this.relationship = {
      spec_version: "2.1",
      type: "relationship",
      id: `relationship--${uuid()}`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      source_ref: "",
      target_ref: "",
      relationship_type: "indicates",
    };
  }

  sourceRef(sourceRef: string): RelationshipBuilder {
    this.relationship.source_ref = sourceRef;
    return this;
  }

  targetRef(targetRef: string): RelationshipBuilder {
    this.relationship.target_ref = targetRef;
    return this;
  }

  relationshipType(relationshipType: StixRelationshipType): RelationshipBuilder {
    this.relationship.relationship_type = relationshipType;
    return this;
  }

  build(): StixRelationship {
    return this.relationship;
  }
}

export function Relationship(): RelationshipBuilder {
  return new RelationshipBuilder();
}
