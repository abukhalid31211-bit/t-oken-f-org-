import { createFileRoute } from "@tanstack/react-router";
import { Users } from "@/pages/Users";

export const Route = createFileRoute("/_app/users")({
  component: Users,
  head: () => ({ meta: [{ title: "نواة — إدارة المستخدمين" }] }),
});
