/** Blocks staffFetch until StaffAuthProvider finishes bootstrap (panel routes only). */

let gate: Promise<void> | null = null;
let resolveGate: (() => void) | null = null;

export function resetStaffSessionGate(): void {
  gate = new Promise<void>((resolve) => {
    resolveGate = resolve;
  });
}

export function openStaffSessionGate(): void {
  resolveGate?.();
  resolveGate = null;
}

export function waitForStaffSessionGate(): Promise<void> {
  if (!gate) return Promise.resolve();
  return gate;
}
