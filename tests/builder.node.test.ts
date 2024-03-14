import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { Bundle, Indicator, Malware, Relationship } from "../src/stix";

describe("Indicator", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("default", () => {
    vi.setSystemTime(new Date(2021, 1, 1, 0, 0, 0, 0));

    const indicator = Indicator().build();

    expect(indicator.spec_version).toBe("2.1");
    expect(indicator.type).toBe("indicator");
    expect(indicator.created).toBe("2021-02-01T00:00:00.000Z");
    expect(indicator.modified).toBe("2021-02-01T00:00:00.000Z");
    expect(indicator.valid_from).toBe("2021-02-01T00:00:00.000Z");
  });

  it("sets id when .id() is called", () => {
    const indicator = Indicator()
      .id("indicator--1234abcd-12ab-34cd-56ef-1234567890ab23")
      .build();

    expect(indicator.id).toBe(
      "indicator--1234abcd-12ab-34cd-56ef-1234567890ab23"
    );
  });

  it("sets pattern when .pattern() is called", () => {
    const indicator = Indicator()
      .pattern("[file:hashes.'SHA-256' = 'abc123...']")
      .build();

    expect(indicator.pattern).toBe("[file:hashes.'SHA-256' = 'abc123...']");
  });

  it("sets pattern_type when .patternType() is called", () => {
    const indicator = Indicator().patternType("stix").build();

    expect(indicator.pattern_type).toBe("stix");
  });
});

describe("Relationship", () => {
  it("connects two indicators", () => {
    const indicator1 = Indicator().build();
    const indicator2 = Indicator().build();

    const relationship = Relationship()
      .relationshipType("indicates")
      .sourceRef(indicator1.id)
      .targetRef(indicator2.id)
      .build();

    expect(relationship.source_ref).toBe(indicator1.id);
    expect(relationship.target_ref).toBe(indicator2.id);
  });
});

describe("Bundle", () => {
  it("creates a bundle with an indicator, malware, and relationship", () => {
    const indicator = Indicator()
      .patternType("stix")
      .pattern("[file:hashes.'SHA-256' = 'abc123']")
      .build();
    const malware = Malware()
      .name("Emotet")
      .description("Banking trojan")
      .malwareTypes(["trojan"])
      .build();
    const relationship = Relationship()
      .relationshipType("indicates")
      .sourceRef(indicator.id)
      .targetRef(malware.id)
      .build();

    const bundle = Bundle().objects(indicator, malware, relationship).build();

    expect(bundle.objects.length).toBe(3);
  });
});
