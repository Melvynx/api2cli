"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

function tableToMarkdown(table: Element): string {
  const rows: string[] = [];
  const headerCells = table.querySelectorAll("thead th");
  const bodyRows = table.querySelectorAll("tbody tr");

  if (headerCells.length > 0) {
    const headers = Array.from(headerCells).map(
      (th) => th.textContent?.trim() ?? ""
    );
    rows.push(`| ${headers.join(" | ")} |`);
    rows.push(`| ${headers.map(() => "---").join(" | ")} |`);
  }

  for (const row of bodyRows) {
    const cells = Array.from(row.querySelectorAll("td")).map(
      (td) => td.textContent?.trim() ?? ""
    );
    rows.push(`| ${cells.join(" | ")} |`);
  }

  return rows.join("\n");
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (tag === "script" || tag === "style") return "";

  const childMarkdown = () =>
    Array.from(el.childNodes).map(nodeToMarkdown).join("");

  switch (tag) {
    case "h1":
      return `# ${el.textContent?.trim()}\n\n`;
    case "h2":
      return `## ${el.textContent?.trim()}\n\n`;
    case "h3":
      return `### ${el.textContent?.trim()}\n\n`;
    case "p":
      return `${childMarkdown().trim()}\n\n`;
    case "pre": {
      const code = el.querySelector("code");
      const text = code?.textContent?.trim() ?? el.textContent?.trim() ?? "";
      return `\`\`\`\n${text}\n\`\`\`\n\n`;
    }
    case "code":
      return `\`${el.textContent?.trim()}\``;
    case "strong":
    case "b":
      return `**${childMarkdown().trim()}**`;
    case "em":
    case "i":
      return `*${childMarkdown().trim()}*`;
    case "a": {
      const href = el.getAttribute("href") ?? "";
      return `[${childMarkdown().trim()}](${href})`;
    }
    case "ul":
    case "ol":
      return `${childMarkdown()}\n`;
    case "li": {
      const parent = el.parentElement;
      const prefix =
        parent?.tagName === "OL"
          ? `${Array.from(parent.children).indexOf(el) + 1}. `
          : "- ";
      return `${prefix}${childMarkdown().trim()}\n`;
    }
    case "blockquote":
      return `> ${childMarkdown().trim()}\n\n`;
    case "table":
      return `${tableToMarkdown(el)}\n\n`;
    case "thead":
    case "tbody":
    case "tr":
    case "th":
    case "td":
      return "";
    case "br":
      return "\n";
    case "div": {
      if (el.classList.contains("callout")) {
        const title = el.querySelector(".callout-title");
        const titleText = title?.textContent?.trim() ?? "";
        const bodyText = Array.from(el.childNodes)
          .filter((n) => n !== title)
          .map(nodeToMarkdown)
          .join("")
          .trim();
        return `> **${titleText}**\n> ${bodyText}\n\n`;
      }
      return childMarkdown();
    }
    default:
      return childMarkdown();
  }
}

function articleToMarkdown(article: Element): string {
  return Array.from(article.childNodes)
    .map(nodeToMarkdown)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function CopyMarkdownButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const article = document.querySelector(".docs-content");
    if (!article) return;

    const markdown = articleToMarkdown(article);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 text-muted-foreground"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy as Markdown
        </>
      )}
    </Button>
  );
}
