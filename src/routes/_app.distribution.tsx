import { createFileRoute } from "@tanstack/react-router";
import { Distribution } from "@/pages/Distribution";

export const Route = createFileRoute("/_app/distribution")({
  component: Distribution,
  head: () => ({ meta: [{ title: "نواة — التوزيع الجماعي" }] }),
});
