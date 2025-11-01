"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

// Consistent execCommand wrapper
function exec(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

// Strip inline attrs that can cause unreadable colors
function stripInlineAttrs(html: string) {
  return html
    .replace(/\sclass=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sstyle=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sdata-[a-z0-9_-]+=(?:"[^"]*"|'[^']*')/gi, "");
}

// Normalize pasted block tags (avoid nested div soup)
function normalizeBlocks(html: string) {
  return html.replace(/<(\/?)div(\s|>)/gi, "<$1p$2>");
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your post here...",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // One-time defaults
  useEffect(() => {
    try {
      exec("defaultParagraphSeparator", "p");
      exec("styleWithCSS", "false");
    } catch {
      // no-op if unsupported
    }
  }, []);

  // Sync external value
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const focusEditor = () => ref.current?.focus();

  const apply = useCallback(
    (cmd: string, val?: string) => {
      focusEditor();
      exec(cmd, val);
      if (ref.current) onChange(ref.current.innerHTML);
    },
    [onChange]
  );

  const onInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      onChange((e.target as HTMLDivElement).innerHTML);
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Formatting shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        apply("bold");
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        apply("italic");
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        apply("underline");
      }
      // Common list shortcuts: Ctrl/Cmd+Shift+7 (ordered), +8 (unordered)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "7") {
        e.preventDefault();
        apply("insertOrderedList");
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "8") {
        e.preventDefault();
        apply("insertUnorderedList");
      }
      // Indent/outdent within lists via Tab/Shift+Tab
      if (e.key === "Tab") {
        e.preventDefault();
        apply(e.shiftKey ? "outdent" : "indent");
      }
    },
    [apply]
  );

  // Block formatting
  const setParagraph = () => apply("formatBlock", "<p>");
  const setH2 = () => apply("formatBlock", "<h2>");
  const setH3 = () => apply("formatBlock", "<h3>");
  const setBlockquote = () => apply("formatBlock", "<blockquote>");
  const setCode = () => apply("formatBlock", "<pre>");

  // Lists
  const ul = () => apply("insertUnorderedList");
  const ol = () => apply("insertOrderedList");

  // Inline
  const bold = () => apply("bold");
  const italic = () => apply("italic");
  const underline = () => apply("underline");
  const strike = () => apply("strikeThrough");

  // Links
  const link = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    apply("createLink", url);
  };

  const clear = () => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    onChange("");
  };

  // Clean paste: keep lists/headings, drop risky inline styles/classes
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    let safe = html || text;
    safe = stripInlineAttrs(safe);
    safe = normalizeBlocks(safe);

    document.execCommand("insertHTML", false, safe);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const Placeholder = useMemo(
    () =>
      !value && !isFocused ? (
        <div className="pointer-events-none text-gray-400 absolute top-3 left-3">{placeholder}</div>
      ) : null,
    [value, isFocused, placeholder]
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap gap-2 text-sm">
        <button onClick={setParagraph} className="rounded border px-2 py-1">
          P
        </button>
        <button onClick={setH2} className="rounded border px-2 py-1">
          H2
        </button>
        <button onClick={setH3} className="rounded border px-2 py-1">
          H3
        </button>
        <button onClick={setBlockquote} className="rounded border px-2 py-1">
          Quote
        </button>
        <button onClick={setCode} className="rounded border px-2 py-1">
          Code
        </button>
        <button onClick={ul} className="rounded border px-2 py-1">
          • List
        </button>
        <button onClick={ol} className="rounded border px-2 py-1">
          1. List
        </button>
        <button onClick={bold} className="rounded border px-2 py-1 font-semibold">
          B
        </button>
        <button onClick={italic} className="rounded border px-2 py-1 italic">
          I
        </button>
        <button onClick={underline} className="rounded border px-2 py-1">
          U
        </button>
        <button onClick={strike} className="rounded border px-2 py-1">
          S
        </button>
        <button onClick={link} className="rounded border px-2 py-1">
          Link
        </button>
        <button onClick={clear} className="rounded border px-2 py-1 text-red-600">
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        {Placeholder}
        <div
          ref={ref}
          // The .rte class is styled in globals.css to force list markers to show
          className="rte min-h-[160px] max-w-none rounded-lg bg-white p-3 text-gray-900 focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={true}
          aria-label="Rich text editor"
          role="textbox"
          aria-multiline="true"
        />
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Shortcuts: Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U, Ctrl/Cmd+Shift+7 (1. list), Ctrl/Cmd+Shift+8 (• list), Tab/Shift+Tab to
        indent/outdent.
      </div>
    </div>
  );
};
