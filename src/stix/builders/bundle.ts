import type { StixBundle, StixObject } from "../types";
import { uuid } from "../utils";

export class BundleBuilder {
  private bundle: StixBundle;

  constructor() {
    this.bundle = {
      type: "bundle",
      id: `bundle--${uuid()}`,
      spec_version: "2.1",
      objects: [],
    };
  }

  objects(...objects: StixObject[]): BundleBuilder {
    this.bundle.objects.push(...objects);
    return this;
  }

  build(): StixBundle {
    return this.bundle;
  }
}

export function Bundle(): BundleBuilder {
  return new BundleBuilder();
}
