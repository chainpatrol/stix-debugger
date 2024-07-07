import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";

const extensions = [
  Document.extend({
    content: "heading block+",
  }),
  StarterKit.configure({
    document: false,
  }),
  Link,
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
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
  <h2>Example: Emotet Distribution via Phishing</h2>

  <p>
    Emotet is a banking trojan that can steal financial information, such as 
    online banking credentials. It is also a malware downloader, meaning it can 
    download other malware onto infected systems. Emotet is known for its
    polymorphic nature, which helps it evade detection by antivirus software.
  </p>

  <h3>Indicators of Compromise</h3>

  <p>
    Here are some indicators of compromise (IOCs) associated with Emotet:
  </p>

  <ul>
    <li><span data-type="mention" data-id="google.com">google.com</span></li>
    <li><span data-type="mention" data-id="1.1.1.1">1.1.1.1</span></li>
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
