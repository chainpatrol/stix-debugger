import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";

const extensions = [
  Document.extend({
    content: "heading block+",
  }),
  StarterKit.configure({
    document: false,
  }),
  Placeholder.configure({
    considerAnyAsEmpty: false,
    showOnlyCurrent: true,
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "Untitled";
      }
      return "Write something...";
    },
  }),
];

const defaultContent = `
  <h1>Welcome to stix.ai!</h1>
  
  <p>
    This is a <strong>rich text editor</strong> with <em>SUPERPOWERS</em>!
  </p>
  
  <p>
    Writing STIX files by hand is a terrible user experience. stix.ai
    helps you craft STIX 2.1-compatible JSON documents by authoring them
    in a Notion-like editor.
  </p>
  
  <p>
    Draft your incident reports on the <strong>Content</strong>, and then 
    stix.ai will detect domains, IP addresses, and other indicators of 
    compromise (IOCs) in your text and automatically generate the JSON
    for you!
  </p>

  <h2>Features</h2>

  <ul>
    <li>10+ asset types
      <ul>
        <li><strong>Internet:</strong> Domains, IP Address (v4 and v6), URLs</li>
        <li><strong>Blockchain:</strong> Smart Contracts, Transactions, Wallets</li>
        <li><strong>Social Media:</strong> Twitter, LinkedIn, Facebook, YouTube, etc.</li>
        <li><strong>Cloud:</strong> AWS, GCP, Azure</li>
        <li><strong>File:</strong> Hashes, Files, Certificates</li>
      </ul>
    </li>
    <li>Incident report templates</li>
    <li>Import/Export to JSON</li>
    <li>Keyboard shortcuts</li>
    <li>Markdown support</li>
  </ul>
`;

export function RichTextEditor() {
  const editor = useEditor({
    extensions,
    content: defaultContent,
    autofocus: "start",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-headings:tracking-tight prose-headings:font-bold focus:outline-none m-5",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
