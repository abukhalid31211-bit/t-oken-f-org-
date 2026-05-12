import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex items-end justify-between gap-6 mb-12 animate-enter">
      <div>
        <h1 className="text-5xl font-bold tracking-tighter mb-2">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground max-w-prose">{subtitle}</p>
        )}
      </div>
      {action}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold mb-6">{children}</h2>;
}

export function StatusPill({
  variant = "active",
  children,
}: {
  variant?: "active" | "pending" | "failed";
  children: ReactNode;
}) {
  const styles =
    variant === "active"
      ? "bg-success/15 text-success"
      : variant === "pending"
        ? "bg-warning/20 text-foreground"
        : "bg-destructive/15 text-destructive";
  return (
    <span
      className={`inline-block px-2 py-1 text-[10px] rounded-full font-mono uppercase tracking-wider ${styles}`}
    >
      {children}
    </span>
  );
}
