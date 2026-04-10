import type { WorkflowRun } from "./types";

const STORAGE_KEY = "interface-intelligence-runs";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getAllRuns(): WorkflowRun[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkflowRun[];
  } catch {
    return [];
  }
}

export function getRun(id: string): WorkflowRun | null {
  const runs = getAllRuns();
  return runs.find((r) => r.id === id) ?? null;
}

export function saveRun(run: WorkflowRun): void {
  if (!isClient()) return;
  const runs = getAllRuns();
  const index = runs.findIndex((r) => r.id === run.id);
  if (index >= 0) {
    runs[index] = run;
  } else {
    runs.unshift(run);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function deleteRun(id: string): void {
  if (!isClient()) return;
  const runs = getAllRuns().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}
