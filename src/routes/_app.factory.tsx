import { createFileRoute } from "@tanstack/react-router";
import { TokenFactory } from "@/pages/TokenFactory";

export const Route = createFileRoute("/_app/factory")({
  component: TokenFactory,
});
