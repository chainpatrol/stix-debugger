import { Suspense, useEffect, useState } from "react";
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
import { cn } from "./utils";
import { useMediaQuery } from "./hooks/use-media-query";

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

// eslint-disable-next-line @typescript-eslint/ban-types
type Tab = "editor" | "json" | "preview" | (string & {});

export default function App() {
  const [value, setValue] = useState(() => JSON.stringify(bundle, null, 2));

  const [tab, setTab] = useState<Tab>("editor");
  const shouldRenderPreviewPanel = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!shouldRenderPreviewPanel) {
      return;
    }
    setTab("editor");
  }, [shouldRenderPreviewPanel]);

  return (
    <main className="flex flex-col h-full">
      <header className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
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
        className="flex-1 overflow-hidden min-h-0"
      >
        <Panel
          order={1}
          defaultSize={40}
          minSize={20}
          collapsible
          className="h-full"
        >
          <Tabs.Root
            value={tab}
            onValueChange={setTab}
            className="h-full flex flex-col"
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
                {
                  value: "preview",
                  label: "Preview",
                },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "py-3 border-b-2 border-transparent tracking-wide text-xs font-medium text-gray-600 uppercase data-[state=active]:border-orange-500 data-[state=active]:text-orange-500",
                    shouldRenderPreviewPanel &&
                      tab.value === "preview" &&
                      "hidden"
                  )}
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="editor" className="flex-1 overflow-y-auto">
              <RichTextEditor />
            </Tabs.Content>
            <Tabs.Content value="json" className="flex-1">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<Loading />}>
                  <SuspenseJSONEditor value={value} setValue={setValue} />
                </Suspense>
              </ErrorBoundary>
            </Tabs.Content>
            {!shouldRenderPreviewPanel && (
              <Tabs.Content value="preview" className="flex-1">
                <ErrorBoundary
                  resetKeys={[value]}
                  FallbackComponent={ErrorFallback}
                >
                  <Suspense fallback={<Loading />}>
                    <SuspenseGraph value={value} />
                  </Suspense>
                </ErrorBoundary>
              </Tabs.Content>
            )}
          </Tabs.Root>
        </Panel>
        {shouldRenderPreviewPanel && (
          <>
            <PanelResizeHandle className="w-[6px] bg-gray-200 transition-colors duration-200 hover:bg-blue-500" />
            <Panel
              order={2}
              defaultSize={60}
              minSize={30}
              collapsible
              className="h-full"
            >
              <ErrorBoundary
                resetKeys={[value]}
                FallbackComponent={ErrorFallback}
              >
                <Suspense fallback={<Loading />}>
                  <SuspenseGraph value={value} />
                </Suspense>
              </ErrorBoundary>
            </Panel>
          </>
        )}
      </PanelGroup>
    </main>
  );
}

function Loading() {
  return <div className="h-full grid place-items-center p-1">Loading...</div>;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="h-full grid place-items-center p-1">
      <div>
        <h1>Something went wrong</h1>
        <pre className="whitespace-pre-wrap">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <button onClick={resetErrorBoundary}>Refresh</button>
      </div>
    </div>
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
