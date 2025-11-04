"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface AIEditorPlainProps {
  text: string;
  typingSpeed?: number;
  onContentChange?: (html: string) => void;
}

export default function AIEditorPlain({
  text,
  typingSpeed = 15,
  onContentChange,
}: AIEditorPlainProps) {
  const [isTyping, setIsTyping] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    autofocus: false,
    editable: false,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (!editor || !text) return;

    let i = 0;
    setIsTyping(true);
    editor.commands.clearContent();

    // 🔹 Convert Markdown to simple HTML before typing
    let formattedText = text
      .replace(/\r\n/g, "\n") // normalize newlines
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
      .replace(/\n{2,}/g, "<br/><br/>") // paragraph breaks
      .replace(/\n/g, "<br/>"); // single line breaks

    // Break into characters for typing animation
    const chars = Array.from(formattedText);

    const typeChar = () => {
      if (i < chars.length) {
        const char = chars[i];

        // Handle HTML tags more gracefully — insert whole tags at once
        if (char === "<") {
          const endIndex = formattedText.indexOf(">", i);
          const tag = formattedText.slice(i, endIndex + 1);
          editor.chain().focus().insertContent(tag).run();
          i = endIndex + 1;
        } else {
          editor.chain().focus().insertContent(char).run();
          i++;
        }

        setTimeout(typeChar, typingSpeed);
      } else {
        setIsTyping(false);
        editor.setEditable(true);
      }
    };

    typeChar();
  }, [editor, text, typingSpeed]);

  return (
    <div className="relative rounded-2xl bg-[#fffeff] transition-all duration-300">
      <EditorContent
        editor={editor}
        className="tiptap prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed tracking-wide focus:outline-none focus:ring-0"
      />

      {isTyping && (
        <span className="absolute bottom-3 left-6 text-gray-400 animate-pulse"></span>
      )}
    </div>
  );
}
