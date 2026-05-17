import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/playbook")({
  component: () => (
    <AuthGate
      title="Sign in to open the Playbook."
      description="Phase guides, strategy notes, and letter walkthroughs are reserved for members. Sign in or create a free account to keep reading."
    >
      <Outlet />
    </AuthGate>
  ),
});
