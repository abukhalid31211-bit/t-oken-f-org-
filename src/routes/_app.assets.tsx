import { createFileRoute } from "@tanstack/react-router";
import { Assets } from "@/pages/Assets";

export const Route = createFileRoute("/_app/assets")({
  component: Assets,
  head: () => ({ meta: [{ title: "AkramX — سجل الأصول" }] }),
});
