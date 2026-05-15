import { createFileRoute } from "@tanstack/react-router";
import { Networks } from "@/pages/Networks";

export const Route = createFileRoute("/_app/networks")({
  component: Networks,
  head: () => ({ meta: [{ title: "AkramX — إعدادات الشبكات" }] }),
});
