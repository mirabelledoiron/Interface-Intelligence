"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  reasoning?: string;
  copyContent?: string;
  defaultOpen?: boolean;
}

export function SectionCard({
  title,
  icon,
  children,
  reasoning,
  copyContent,
  defaultOpen = true,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showReasoning, setShowReasoning] = useState(false);

  function handleCopy() {
    if (!copyContent) return;
    navigator.clipboard.writeText(copyContent);
    toast.success("Copied to clipboard");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-expanded={isOpen}
          >
            <CardTitle className="flex items-center gap-2 text-base">
              {icon}
              {title}
            </CardTitle>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <div className="flex items-center gap-1">
            {reasoning && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReasoning(!showReasoning)}
                className="h-8 gap-1.5 text-sm text-muted-foreground"
                aria-expanded={showReasoning}
                aria-label="Show reasoning"
              >
                <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Why</span>
              </Button>
            )}
            {copyContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 text-sm text-muted-foreground"
                aria-label={`Copy ${title} content`}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          {showReasoning && reasoning && (
            <div className="mb-4 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Lightbulb
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <Badge variant="secondary" className="mb-1.5 text-sm">
                    System reasoning
                  </Badge>
                  <p>{reasoning}</p>
                </div>
              </div>
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}
