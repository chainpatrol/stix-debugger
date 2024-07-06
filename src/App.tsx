import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { preload, suspend } from "suspend-react";
import * as Tabs from "@radix-ui/react-tabs";

import { Bundle, Indicator, Malware, Relationship, StixBundle } from "./stix";

import { JSONEditor } from "./JSONEditor";
import { Graph } from "./Graph";
import { convertBundleToGraph } from "./convertBundleToGraph";
import { RichTextEditor } from "./RichTextEditor";
import { fetchJsonSchema } from "./fetchJsonSchema";

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

export default function App() {
  const [value, setValue] = useState(() => JSON.stringify(bundle, null, 2));

  return (
    <main className="flex flex-col h-full">
      <header className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl tracking-tight text-gray-700">STIX Studio</h1>
          <span className="text-xs font-semibold text-gray-400 px-2 py-0.5 bg-gray-100 rounded-md">
            v0.1.0
          </span>
        </div>
        <button className="px-4 py-2.5 bg-orange-500 text-white rounded-lg font-semibold text-sm border border-orange-600/20">
          Share
        </button>
      </header>
      <PanelGroup
        direction="horizontal"
        className="flex-1 overflow-hidden"
        style={{ width: "100%", height: "100%", minHeight: 0 }}
      >
        <Panel
          defaultSize={40}
          minSize={10}
          collapsible
          style={{ height: "100%" }}
        >
          <Tabs.Root
            defaultValue="editor"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Tabs.List className="flex gap-4 px-4 border-b border-gray-200 shadow-sm">
              {[
                {
                  value: "editor",
                  label: "Editor",
                },
                {
                  value: "json",
                  label: "JSON",
                },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="py-3 border-b-2 border-transparent tracking-wide text-xs font-medium text-gray-600 uppercase data-[state=active]:border-orange-500 data-[state=active]:text-orange-500"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="editor" className="flex-1 overflow-y-auto">
              <RichTextEditor />
            </Tabs.Content>
            <Tabs.Content value="json" className="flex-1">
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    Loading...
                  </div>
                }
              >
                <SuspenseJSONEditor value={value} setValue={setValue} />
              </Suspense>
            </Tabs.Content>
          </Tabs.Root>
        </Panel>
        <PanelResizeHandle style={{ width: 6, background: "#ddd" }} />
        <Panel defaultSize={60} minSize={40}>
          <ErrorBoundary
            resetKeys={[value]}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "1rem",
                }}
              >
                <div>
                  <h1>Something went wrong</h1>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {error instanceof Error ? error.message : String(error)}
                  </pre>
                  <button onClick={resetErrorBoundary}>Refresh</button>
                </div>
              </div>
            )}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  Loading...
                </div>
              }
            >
              <SuspenseGraph value={value} />
            </Suspense>
          </ErrorBoundary>
        </Panel>
      </PanelGroup>
    </main>
  );
}

function SuspenseGraph({ value }: { value: string }) {
  const graph = suspend(
    () => convertBundleToGraph(JSON.parse(value) as StixBundle),
    [value]
  );
  return <Graph nodes={graph.nodes} edges={graph.edges} />;
}

export const schemaPath =
  "https://raw.githubusercontent.com/oasis-open/cti-stix2-json-schemas/stix2.1/schemas/common/bundle.json";

// Preload the JSON schema
preload(fetchJsonSchema, ["schema"]);

function SuspenseJSONEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const schema = suspend(() => fetchJsonSchema(), ["schema"]);

  return <JSONEditor value={value} onChange={setValue} schema={schema} />;
}
