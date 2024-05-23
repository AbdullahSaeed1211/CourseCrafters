"use client";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function CourseDescription({ content }: { content: JSONContent }) {
  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base",
      },
    },
  });
  if (!editor) {
    return null;
  }
  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
