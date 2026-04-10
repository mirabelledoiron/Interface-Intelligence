import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const config = {
  error: {
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  info: {
    icon: Info,
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
} as const;

export function SeverityBadge({
  severity,
}: {
  severity: "error" | "warning" | "info";
}) {
  const { icon: Icon, className } = config[severity];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 text-sm font-medium capitalize", className)}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {severity}
    </Badge>
  );
}
