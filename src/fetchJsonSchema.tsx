import { resolveRefs } from "json-refs";
import { schemaPath } from "./App";

export async function fetchJsonSchema(): Promise<Record<string, any>> {
  const res = await fetch(schemaPath);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const schema = await resolveRefs(data, { location: schemaPath });
  return schema.resolved;
}
