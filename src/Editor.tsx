import { json, jsonParseLinter } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";
import { jsonSchema } from "codemirror-json-schema";

export function Editor({
  schema,
  value = "",
  onChange,
}: {
  schema: Record<string, any>;
  value?: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView>();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        json(),
        linter(jsonParseLinter(), { delay: 300 }),
        jsonSchema(schema),
      ],
    });

    editorRef.current = new EditorView({
      extensions: [basicSetup, json()],
      parent: containerRef.current,
      state,
      dispatchTransactions(trs, view) {
        view.update(trs);
        onChange(view.state.doc.toString());
      },
    });

    return () => {
      editorRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "contents",
      }}
    />
  );
}
