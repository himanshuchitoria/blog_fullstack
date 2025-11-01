// Isomorphic sanitizer: DOM-based in the browser, regex-based fallback on the server.
// Preserves headings, lists (incl. start/value/type), quotes, code, links, and basic inline emphasis.
// Strips script/style, event handlers, inline styles, and unsafe protocols.

type AttrMap = Record<string, string[]>;

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "blockquote", "pre", "code",
  "ul", "ol", "li",
  "a",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "img",
  // keep span/div only if you actually rely on them in content; otherwise remove to reduce styling side-effects
  "span", "div"
]);

// Allow ordered-list controls and per-item value to ensure numbers render as authored.
const ALLOWED_ATTRS: AttrMap = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  ol: ["start", "type", "reversed"],  // HTML5 supports these on <ol>
  li: ["value"],                      // HTML5 supports value on <li>
  // Avoid keeping arbitrary classes that might hide bullets (e.g., list-none); whitelist only if needed.
  // "*": ["class"],
};

function isSafeUrl(attr: string, value: string, tag: string): boolean {
  // Accept absolute http/https, root-relative (/...), same-page (#...), and for images data:image/*
  try {
    if (!value) return false;
    if (value.startsWith("#")) return true;
    if (value.startsWith("/")) return true;
    if (tag === "img" && value.startsWith("data:image/")) return true;
    const u = new URL(value, "http://localhost");
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function stripEventAndStyleAttrs(tagHtml: string): string {
  return tagHtml
    .replace(/\s+on[a-z]+=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\s+style=(?:"[^"]*"|'[^']*')/gi, "");
}

// Remove comments and script/style blocks
function stripDangerousBlocks(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
}

// Server-side conservative sanitizer (regex-based)
function sanitizeOnServer(dirty: string): string {
  if (!dirty) return "";
  let input = stripDangerousBlocks(dirty);

  return input.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) return ""; // drop unknown tags

    if (isClosing) return `</${tag}>`;

    const allowedForTag = new Set([...(ALLOWED_ATTRS[tag] || [])]);

    const safeAttrs: string[] = [];
    rawAttrs.replace(
      /\s+([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>/]+)))?/gi,
      (_m, name: string, v1?: string, v2?: string, v3?: string) => {
        const attr = name.toLowerCase();
        const val = (v1 ?? v2 ?? v3 ?? "").trim();

        if (!allowedForTag.has(attr)) return "";

        if ((attr === "href" || attr === "src") && !isSafeUrl(attr, val, tag)) return "";

        if (attr === "target") {
          safeAttrs.push(`target="_blank"`);
          safeAttrs.push(`rel="noopener noreferrer"`);
          return "";
        }

        if (attr.startsWith("on")) return "";

        const escaped = val.replace(/"/g, "&quot;");
        safeAttrs.push(`${attr}="${escaped}"`);
        return "";
      }
    );

    let openTag = `<${tag}${safeAttrs.length ? " " + safeAttrs.join(" ") : ""}>`;
    openTag = stripEventAndStyleAttrs(openTag);
    return openTag;
  });
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  // Server or no DOMParser: use regex fallback
  if (typeof window === "undefined" || typeof (globalThis as any).DOMParser === "undefined") {
    return sanitizeOnServer(dirty);
  }

  // Browser path: DOM-based sanitizer
  const parser = new DOMParser();
  const doc = parser.parseFromString(stripDangerousBlocks(dirty), "text/html");

  // Remove any script/style elements that might still exist
  doc.querySelectorAll("script, style").forEach((el) => el.remove());

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
  const toRemove: Element[] = [];

  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    const tag = el.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      toRemove.push(el);
      continue;
    }

    // Clean attributes
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      const allowedForTag = new Set([...(ALLOWED_ATTRS[tag] || [])]);

      if (!allowedForTag.has(name)) {
        el.removeAttribute(name);
        continue;
      }

      if (name.startsWith("on")) el.removeAttribute(name);
      if (name === "style") el.removeAttribute(name);

      if ((name === "href" || name === "src") && !isSafeUrl(name, value, tag)) {
        el.removeAttribute(name);
      }

      if (tag === "a" && name === "target") {
        el.setAttribute("rel", "noopener noreferrer");
      }
    }
  }

  // Replace disallowed nodes with their text to avoid content loss
  for (const el of toRemove) {
    const parent = el.parentNode;
    if (!parent) continue;
    const text = doc.createTextNode(el.textContent || "");
    parent.replaceChild(text, el);
  }

  return doc.body.innerHTML.trim();
}
