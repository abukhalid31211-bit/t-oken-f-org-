import { createFileRoute } from "@tanstack/react-router";
import { Audit } from "@/pages/Audit";

export const Route = createFileRoute("/_app/audit")({
  component: Audit,
});
