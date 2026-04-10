"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute right-2 top-2 h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        aria-label="Copy code"
      >
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <pre className="overflow-x-auto rounded-md bg-muted/50 p-4 text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
