"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

// Copies the essay's address. The label reads "Copied" for two seconds; both labels take the
// same space so the button never changes width.
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (for example on an insecure page): the address bar still works.
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={copy}>
      <span className="grid">
        <span className={`col-start-1 row-start-1 ${copied ? "invisible" : ""}`}>Copy link</span>
        <span aria-hidden className={`col-start-1 row-start-1 ${copied ? "" : "invisible"}`}>
          Copied
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </Button>
  );
}
