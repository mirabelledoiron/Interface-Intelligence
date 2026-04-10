"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";
import type { DesignTokenGroup } from "@/lib/types";

function TokenSwatch({ value, type }: { value: string; type: string }) {
  if (type === "color") {
    return (
      <span
        className="inline-block h-4 w-4 rounded-sm border border-border"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
    );
  }
  return null;
}

export function TokenPanel({ tokenGroups }: { tokenGroups: DesignTokenGroup[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Palette className="h-4 w-4" aria-hidden="true" />
          System Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tokenGroups.map((group) => {
          const isExpanded = expanded === group.name;
          return (
            <div key={group.name}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(isExpanded ? null : group.name)}
                className="w-full justify-between h-8 text-sm"
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-2">
                  {group.name}
                  <Badge variant="secondary" className="text-sm px-1.5 py-0">
                    {group.tokens.length}
                  </Badge>
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
              {isExpanded && (
                <div className="mt-1 ml-2 space-y-1">
                  {group.tokens.map((token) => (
                    <div
                      key={token.name}
                      className="flex items-center gap-2 py-0.5 text-sm"
                    >
                      <TokenSwatch value={token.value} type={token.type} />
                      <span className="font-mono text-muted-foreground">
                        {token.name}
                      </span>
                      <span className="text-muted-foreground/60">
                        {token.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
