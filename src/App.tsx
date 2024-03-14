import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { suspend } from "suspend-react";

import { Bundle, Indicator, Malware, Relationship, StixBundle } from "./stix";

import { Editor } from "./Editor";
import { Graph } from "./Graph";
import { convertBundleToGraph } from "./convertBundleToGraph";

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
    <PanelGroup
      direction="horizontal"
      style={{ width: "100%", height: "100%", minHeight: 0 }}
    >
      <Panel defaultSize={40} minSize={10} collapsible>
        <Editor value={value} onChange={setValue} />
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
  );
}

function SuspenseGraph({ value }: { value: string }) {
  const graph = suspend(
    () => convertBundleToGraph(JSON.parse(value) as StixBundle),
    [value]
  );
  return <Graph nodes={graph.nodes} edges={graph.edges} />;
}
