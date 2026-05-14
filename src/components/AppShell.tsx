import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Factory, Wallet, Send, Coins, BarChart3, ShieldCheck,
  Settings, Plus, Bell, Search, Menu, X, LogOut, User, ChevronDown, CheckCircle2,
} from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet, SheetContent, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/factory", label: "مصنع التوكنات", icon: Factory },
  { to: "/wallets", label: "المحافظ", icon: Wallet },
  { to: "/distribution", label: "التوزيع الجماعي", icon: Send },
  { to: "/assets", label: "سجل الأصول", icon: Coins },
  { to: "/reports", label: "التقارير", icon: BarChart3 },
  { to: "/audit", label: "سجلات التدقيق", icon: ShieldCheck },
] as const;

const notifications = [
  { title: "تم تأكيد عقد ذكي جديد", body: "ريال كوين (RC) — Ethereum", time: "منذ دقيقتين", unread: true },
  { title: "اكتمال دفعة توزيع #BATCH-204", body: "1,200 معاملة بنجاح", time: "منذ ساعة", unread: true },
  { title: "تحذير: محاولة دخول غير معتادة", body: "IP 203.0.113.55", time: "منذ 3 ساعات", unread: false },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-l border-border flex-col p-6 sticky top-0 h-screen shrink-0">
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent side="right" className="w-72 p-6">
          <SidebarBody pathname={pathname} onNavigate={() => setMobileNav(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 min-w-0">
        <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-10 gap-3">
          <div className="flex items-center gap-3 lg:gap-6 min-w-0">
            <button
              onClick={() => setMobileNav(true)}
              className="lg:hidden size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <span className="size-2 rounded-full bg-success animate-pulse-slow" />
              <span className="ltr font-mono">Ethereum Mainnet</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
            <div className="hidden md:block text-xs text-muted-foreground">
              الكتلة: <span className="ltr font-mono">#18,432,109</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setCmdOpen(true)}
              className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="بحث"
            >
              <Search className="size-4" strokeWidth={1.75} />
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted relative">
                  <Bell className="size-4" strokeWidth={1.75} />
                  <span className="absolute top-2 left-2 size-1.5 rounded-full bg-accent" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0" dir="rtl">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-sm">الإشعارات</span>
                  <button
                    onClick={() => toast.success("تم تحديد الكل كمقروء")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    تحديد الكل كمقروء
                  </button>
                </div>
                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors flex gap-3">
                      <span className={`size-2 rounded-full mt-2 shrink-0 ${n.unread ? "bg-accent" : "bg-border"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold mb-0.5">{n.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">{n.body}</p>
                        <span className="text-[10px] font-mono text-muted-foreground ltr block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Link
              to="/factory"
              className="hidden sm:inline-flex px-4 lg:px-5 py-2 lg:py-2.5 bg-accent text-accent-foreground font-bold text-xs lg:text-sm rounded-sm hover:brightness-110 transition-all active:scale-95 items-center gap-2"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              <span className="hidden md:inline">إنشاء توكن جديد</span>
              <span className="md:hidden">جديد</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-muted rounded p-1 transition-colors">
                  <div className="size-9 bg-foreground/5 rounded-full outline outline-1 outline-offset-2 outline-border grid place-items-center text-xs font-bold">
                    أع
                  </div>
                  <ChevronDown className="size-3 text-muted-foreground hidden lg:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56" dir="rtl">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">أحمد العامودي</span>
                    <span className="text-xs text-muted-foreground font-normal">admin@nawah.io</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings"><User className="size-4 ml-2" /> الملف الشخصي</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings"><Settings className="size-4 ml-2" /> الإعدادات</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                  <Link to="/auth/login"><LogOut className="size-4 ml-2" /> تسجيل الخروج</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="ابحث عن صفحة، توكن، أو محفظة..." />
        <CommandList>
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          <CommandGroup heading="الصفحات">
            {nav.map((n) => (
              <CommandItem key={n.to} onSelect={() => { setCmdOpen(false); window.location.href = n.to; }}>
                <n.icon className="size-4 ml-2" />
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="إجراءات سريعة">
            <CommandItem onSelect={() => { setCmdOpen(false); window.location.href = "/factory"; }}>
              <Plus className="size-4 ml-2" /> إنشاء توكن جديد
            </CommandItem>
            <CommandItem onSelect={() => { setCmdOpen(false); window.location.href = "/distribution/single"; }}>
              <Send className="size-4 ml-2" /> تحويل فردي
            </CommandItem>
            <CommandItem onSelect={() => { setCmdOpen(false); toast.success("تم تأكيد التحقق", { icon: <CheckCircle2 className="size-4" /> }); }}>
              <ShieldCheck className="size-4 ml-2" /> فحص أمني سريع
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function SidebarBody({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <Link to="/" onClick={onNavigate} className="mb-12 flex items-center gap-3">
        <div className="size-8 bg-accent rounded-sm" />
        <span className="font-bold text-xl tracking-tight">نواة</span>
      </Link>

      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
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

      <div className="mt-auto pt-6">
        <Link
          to="/settings"
          onClick={onNavigate}
          className={`flex items-center gap-3 py-2 px-3 rounded transition-colors ${
            pathname === "/settings"
              ? "bg-foreground/5 text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="size-4" strokeWidth={1.75} />
          <span className="text-sm">الإعدادات</span>
        </Link>
        <button
          onClick={() => { onNavigate?.(); setTimeout(() => { window.location.href = "/auth/login"; }, 50); }}
          className="w-full flex items-center gap-3 py-2 px-3 rounded text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="size-4" strokeWidth={1.75} />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </>
  );
}
