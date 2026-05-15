import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="mb-8 sm:mb-12 animate-enter">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-3 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronLeft className="size-3 shrink-0" />}
              {b.to ? (
                <Link to={b.to} className="hover:text-foreground transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mb-1.5 sm:mb-2 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-prose leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 mt-1">{action}</div>}
      </div>
    </section>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-bold">{children}</h2>
      {action}
    </div>
  );
}

export function StatusPill({
  variant = "active",
  children,
}: {
  variant?: "active" | "pending" | "failed" | "inactive";
  children: ReactNode;
}) {
  const styles =
    variant === "active"
      ? "bg-success/15 text-success"
      : variant === "pending"
        ? "bg-warning/20 text-foreground"
        : variant === "inactive"
          ? "bg-muted text-muted-foreground"
          : "bg-destructive/15 text-destructive";
  return (
    <span
      className={`inline-block px-2 py-1 text-[10px] rounded-full font-mono uppercase tracking-wider whitespace-nowrap ${styles}`}
    >
      {children}
    </span>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} />;
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <SkeletonBlock className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-16 px-8 text-center animate-fade">
      {Icon && (
        <div className="size-16 grid place-items-center mx-auto bg-muted rounded-full mb-4">
          <Icon className="size-7 text-muted-foreground" />
        </div>
      )}
      <p className="font-bold text-base mb-1">{title}</p>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  trend,
  up,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  up?: boolean;
}) {
  return (
    <div className="border border-border rounded-sm p-4 sm:p-6 hover:border-foreground/20 transition-colors">
      <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
        {label}
      </p>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold ltr font-mono">{value}</div>
        {trend && (
          <span
            className={`text-xs font-mono ${up ? "text-success" : "text-destructive"}`}
          >
            {trend}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
