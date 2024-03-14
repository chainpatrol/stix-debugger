import type { StixIndicator } from "../types";
import { uuid } from "../utils";

export class IndicatorBuilder {
  private indicator: StixIndicator;

  constructor() {
    this.indicator = {
      spec_version: "2.1",
      type: "indicator",
      id: `indicator--${uuid()}`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      pattern: "",
      pattern_type: "stix",
      valid_from: new Date().toISOString(),
    };
  }

  id(id: string): IndicatorBuilder {
    this.indicator.id = id;
    return this;
  }

  name(name: string): IndicatorBuilder {
    this.indicator.name = name;
    return this;
  }

  pattern(pattern: string): IndicatorBuilder {
    this.indicator.pattern = pattern;
    return this;
  }

  patternType(patternType: string): IndicatorBuilder {
    this.indicator.pattern_type = patternType;
    return this;
  }

  build(): StixIndicator {
    return this.indicator;
  }
}

export function Indicator(): IndicatorBuilder {
  return new IndicatorBuilder();
}
