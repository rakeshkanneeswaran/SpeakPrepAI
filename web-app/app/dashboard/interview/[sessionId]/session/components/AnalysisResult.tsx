"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import platformColors from "@/app/utils/colors";

interface AnalysisResultProps {
  text: string;
  typingSpeed?: number;
}

export default function AnalysisResult({
  text,
  typingSpeed = 15,
}: AnalysisResultProps) {
  const [isTyping, setIsTyping] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    autofocus: false,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !text) return;

    let i = 0;
    setIsTyping(true);
    editor.commands.clearContent();

    // ✅ FIX: First decode escape sequences and remove surrounding quotes
    const processedText = text
      .replace(/^"|"$/g, "") // Remove quotes from start and end
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\\\/g, "\\");

    const typeChar = () => {
      if (i < processedText.length) {
        const char = processedText[i];

        if (char === "\n") {
          if (i + 1 < processedText.length && processedText[i + 1] === "\n") {
            editor.chain().focus().insertContent("<br><br>").run();
            i++;
          } else {
            editor.chain().focus().insertContent("<br>").run();
          }
        } else if (
          char === "-" &&
          (i === 0 ||
            processedText[i - 1] === "\n" ||
            processedText[i - 1] === "<")
        ) {
          if (i + 1 < processedText.length && processedText[i + 1] === " ") {
            editor.chain().focus().insertContent("• ").run();
            i++;
          } else {
            editor.chain().focus().insertContent("•").run();
          }
        } else if (
          /[0-9]/.test(char) &&
          (i === 0 ||
            processedText[i - 1] === "\n" ||
            processedText[i - 1] === "<")
        ) {
          let number = char;
          let j = i + 1;

          while (j < processedText.length && /[0-9]/.test(processedText[j])) {
            number += processedText[j];
            j++;
          }

          if (
            j + 1 < processedText.length &&
            processedText[j] === "." &&
            processedText[j + 1] === " "
          ) {
            editor
              .chain()
              .focus()
              .insertContent(`<strong>${number}.</strong> `)
              .run();
            i = j + 1;
          } else {
            editor.chain().focus().insertContent(char).run();
          }
        } else if (char === "*" && processedText[i + 1] === "*") {
          const boldEnd = processedText.indexOf("**", i + 2);
          if (boldEnd !== -1) {
            const boldText = processedText.substring(i + 2, boldEnd);
            editor
              .chain()
              .focus()
              .insertContent(`<strong>${boldText}</strong>`)
              .run();
            i = boldEnd + 1;
          } else {
            editor.chain().focus().insertContent(char).run();
          }
        } else if (char === '"') {
          editor.chain().focus().insertContent('"').run();
        } else {
          editor.chain().focus().insertContent(char).run();
        }

        i++;
        setTimeout(typeChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeChar();

    return () => {
      setIsTyping(false);
    };
  }, [editor, text, typingSpeed]);

  // Prevent any user interaction
  const handleUserInteraction = (
    e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto  rounded-xl p-6 "
      onClick={handleUserInteraction}
      onContextMenu={handleUserInteraction}
      onMouseDown={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      {/* Title - Left Aligned */}
      <h3 className="text-3xl font-semibold text-black mb-6 text-left cursor-default select-none">
        Your Interview Analysis
      </h3>

      {/* Typing effect editor - Completely non-interactive */}
      <div
        className="relative rounded-2xl p-4 transition-all duration-300 min-h-[200px] text-left cursor-default select-text"
        style={{
          backgroundColor: platformColors.mainBackground,
          borderColor: platformColors.borderColor,
        }}
        onClick={handleUserInteraction}
        onMouseDown={handleUserInteraction}
      >
        <EditorContent
          editor={editor}
          className="tiptap prose prose-sm sm:prose-base max-w-none leading-relaxed tracking-wide focus:outline-none focus:ring-0 cursor-default select-text text-left"
          style={{
            cursor: "default",
            textAlign: "left",
            color: "black",
          }}
          onClick={handleUserInteraction}
          onMouseDown={handleUserInteraction}
        />

        {isTyping && (
          <span
            className="absolute bottom-3 right-6 animate-pulse text-lg cursor-default select-none"
            style={{ color: platformColors.borderColor }}
          >
            ▋
          </span>
        )}
      </div>

      {/* Footer - Left Aligned */}
      <p
        className="text-sm text-left mt-6 cursor-default select-none"
        style={{ color: platformColors.borderColor }}
      >
        AI feedback generated from your responses
      </p>
    </div>
  );
}
