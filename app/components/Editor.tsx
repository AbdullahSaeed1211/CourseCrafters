"use client";
import { Button } from "@/components/ui/button";
import { EditorContent, JSONContent, useEditor, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-5">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "secondary"}
        type="button">
        Bold
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "secondary"}
        type="button">
        Italic
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "secondary"}
        type="button">
        Strike
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        variant={editor.isActive("code") ? "default" : "secondary"}
        type="button">
        Code
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "secondary"
        }>
        H1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "secondary"
        }
        type="button">
        H2
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "secondary"
        }
        type="button">
        H3
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        variant={
          editor.isActive("heading", { level: 4 }) ? "default" : "secondary"
        }>
        H4
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        variant={
          editor.isActive("heading", { level: 5 }) ? "default" : "secondary"
        }
        type="button">
        H5
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        variant={
          editor.isActive("heading", { level: 6 }) ? "default" : "secondary"
        }
        type="button">
        H6
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "secondary"}
        type="button">
        Bullet List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "secondary"}
        type="button">
        Ordered List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={editor.isActive("blockquote") ? "default" : "secondary"}
        type="button">
        Blockquote
      </Button>
    </div>
  );
};

export function TipTapEditor({setJson,json}: {setJson: any, json: JSONContent | null}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: json,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose lg:prose-lg xl:prose-xl",
      },
    },
    onUpdate: ({editor}) => {
      setJson(editor.getJSON());
    }
  });
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg border p-2 min-h-[150px] mt-2"
      />
    </div>
  );
}
