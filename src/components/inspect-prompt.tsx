"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface InspectPromptProps {
  renderedPrompt?: {
    system: string;
    user: string;
  };
}

export function InspectPrompt({ renderedPrompt }: InspectPromptProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!renderedPrompt) return null;

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          aria-expanded={isOpen}
        >
          <CardTitle className="flex items-center gap-2 text-sm">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            Inspect Prompt
            <Badge variant="outline" className="font-normal">
              Output.ai
            </Badge>
          </CardTitle>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {!isOpen && (
          <p className="text-sm text-muted-foreground mt-1">
            See the exact prompt sent to Claude, with your design tokens injected via the .prompt template.
          </p>
        )}
      </CardHeader>
      {isOpen && (
        <CardContent>
          <Tabs defaultValue="system">
            <TabsList>
              <TabsTrigger value="system">System Prompt</TabsTrigger>
              <TabsTrigger value="user">User Prompt</TabsTrigger>
            </TabsList>
            <TabsContent value="system" className="mt-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Loaded from the .prompt file. Your mirabelle-ds-* tokens are injected here via Liquid templating.
                </p>
                <CodeBlock
                  code={renderedPrompt.system}
                  language="markdown"
                />
              </div>
            </TabsContent>
            <TabsContent value="user" className="mt-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Built from your form inputs. Combined with the system prompt and sent to Claude.
                </p>
                <CodeBlock
                  code={renderedPrompt.user}
                  language="markdown"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
