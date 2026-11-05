import { createFileRoute, redirect } from "@tanstack/react-router";

// The Research page was removed. This keeps old links and QR codes working by sending them to About.
export const Route = createFileRoute("/research")({
  beforeLoad: () => {
    throw redirect({ to: "/about" });
  },
});
