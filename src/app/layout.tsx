import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { DemoBanner } from "@/components/demo-banner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interface Intelligence",
  description:
    "AI-powered design system co-pilot. Build components, validate consistency, and generate documentation grounded in your actual design system.",
  authors: [{ name: "Mirabelle Doiron" }],
  metadataBase: new URL("https://interface-intelligence.ai"),
  openGraph: {
    title: "Interface Intelligence",
    description:
      "AI-powered design system co-pilot. Build, validate, and document with system awareness.",
    type: "website",
    url: "https://interface-intelligence.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <DemoBanner />
            <AppShell>{children}</AppShell>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
