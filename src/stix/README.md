# `@chainpatrol/stix`

Lightweight, zero-dependency JavasScript library for working with STIX 2.1 data.

## Installation

```bash
npm install @chainpatrol/stix
```

## Usage

```javascript
import { Bundle, Indicator, Malware, Relationship } from "@chainpatrol/stix";

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

console.log(JSON.stringify(bundle, null, 2));

// {
//   "type": "bundle",
//   "id": "bundle--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e",
//   "objects": [
//     {
//       "type": "indicator",
//       "id": "indicator--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e",
//       "pattern": "[file:hashes.'SHA-256' = 'abc123']",
//       "pattern_type": "stix"
//     },
//     {
//       "type": "malware",
//       "id": "malware--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e",
//       "name": "Emotet",
//       "description": "Banking trojan",
//       "malware_types": ["trojan"]
//     },
//     {
//       "type": "relationship",
//       "id": "relationship--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e",
//       "relationship_type": "indicates",
//       "source_ref": "indicator--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e",
//       "target_ref": "malware--f3b3d9d3-7b5c-4a4b-8b3e-3e2f0f5e3f3e"
//     }
//   ]
// }
```
