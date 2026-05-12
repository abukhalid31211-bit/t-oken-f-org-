import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Factory,
  Wallet,
  Send,
  Coins,
  BarChart3,
  ShieldCheck,
  Settings,
  Plus,
  Bell,
  Search,
} from "lucide-react";

const nav = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/factory", label: "مصنع التوكنات", icon: Factory },
  { to: "/wallets", label: "المحافظ", icon: Wallet },
  { to: "/distribution", label: "التوزيع الجماعي", icon: Send },
  { to: "/assets", label: "سجل الأصول", icon: Coins },
  { to: "/reports", label: "التقارير", icon: BarChart3 },
  { to: "/audit", label: "سجلات التدقيق", icon: ShieldCheck },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-l border-border flex flex-col p-6 sticky top-0 h-screen shrink-0">
        <Link to="/" className="mb-12 flex items-center gap-3">
          <div className="size-8 bg-accent rounded-sm" />
          <span className="font-bold text-xl tracking-tight">نواة</span>
        </Link>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 py-2 px-3 rounded transition-colors ${
                  active
                    ? "bg-foreground/5 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Link
            to="/settings"
            className={`flex items-center gap-3 py-2 px-3 rounded transition-colors ${
              pathname === "/settings"
                ? "bg-foreground/5 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="size-4" strokeWidth={1.75} />
            <span className="text-sm">الإعدادات</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="h-20 border-b border-border flex items-center justify-between px-10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <span className="size-2 rounded-full bg-success animate-pulse-slow" />
              <span className="ltr font-mono">Ethereum Mainnet</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-xs text-muted-foreground">
              الكتلة: <span className="ltr font-mono">#18,432,109</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="size-4" strokeWidth={1.75} />
            </button>
            <button className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
              <Bell className="size-4" strokeWidth={1.75} />
              <span className="absolute top-2 left-2 size-1.5 rounded-full bg-accent" />
            </button>
            <Link
              to="/factory"
              className="px-5 py-2.5 bg-accent text-accent-foreground font-bold text-sm rounded-sm hover:brightness-110 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              إنشاء توكن جديد
            </Link>
            <div className="size-10 bg-foreground/5 rounded-full outline outline-1 outline-offset-2 outline-border grid place-items-center text-xs font-bold">
              أع
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
