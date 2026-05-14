import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Factory, Wallet, Send, Coins, BarChart3, ShieldCheck,
  Settings, Plus, Bell, Search, Menu, LogOut, User, ChevronDown,
  Network, Users, Sun, Moon, X, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/factory", label: "مصنع التوكنات", icon: Factory },
  { to: "/wallets", label: "المحافظ", icon: Wallet },
  { to: "/distribution", label: "التوزيع الجماعي", icon: Send },
  { to: "/assets", label: "سجل الأصول", icon: Coins },
  { to: "/networks", label: "إعدادات الشبكات", icon: Network },
  { to: "/reports", label: "التقارير", icon: BarChart3 },
  { to: "/users", label: "المستخدمون", icon: Users },
  { to: "/audit", label: "سجلات التدقيق", icon: ShieldCheck },
] as const;

const notifications = [
  { title: "تم تأكيد عقد ذكي جديد", body: "ريال كوين (RC) — Ethereum", time: "منذ دقيقتين", unread: true },
  { title: "اكتمال دفعة توزيع #BATCH-204", body: "1,200 معاملة بنجاح", time: "منذ ساعة", unread: true },
  { title: "تحذير: محاولة دخول غير معتادة", body: "IP 203.0.113.55", time: "منذ 3 ساعات", unread: false },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [dark]);
  return [dark, setDark] as const;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [dark, setDark] = useDarkMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(userRef, () => setUserOpen(false));
  useClickOutside(searchRef, () => { setSearchOpen(false); setSearchQ(""); });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setUserOpen(false);
        setMobileNav(false);
        setSearchQ("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNav || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNav, searchOpen]);

  const closeMobileNav = () => setMobileNav(false);

  const filteredNav = nav.filter((n) =>
    !searchQ || n.label.includes(searchQ)
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-l border-border flex-col p-6 sticky top-0 h-screen shrink-0 overflow-y-auto">
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileNav && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)" }}
          onClick={closeMobileNav}
        />
      )}

      {/* Mobile sidebar panel */}
      <div
        style={{ position: "fixed", top: 0, right: 0, zIndex: 50, height: "100%", width: "288px" }}
        className={`bg-background border-l border-border p-6 overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${mobileNav ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-accent rounded-sm" />
            <span className="font-bold text-xl tracking-tight">نواة</span>
          </div>
          <button
            type="button"
            onClick={closeMobileNav}
            className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <SidebarBody pathname={pathname} onNavigate={closeMobileNav} hideLogo />
      </div>

      <main className="flex-1 min-w-0">
        <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-10 bg-background sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-3 lg:gap-6 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="lg:hidden size-10 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span className="ltr font-mono">Ethereum Mainnet</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
            <div className="hidden md:block text-xs text-muted-foreground">
              الكتلة: <span className="ltr font-mono">#18,432,109</span>
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            {/* Search button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Search className="size-4" strokeWidth={1.75} />
            </button>

            {/* Dark mode */}
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {dark ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
                className="size-9 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted relative"
              >
                <Bell className="size-4" strokeWidth={1.75} />
                <span
                  style={{ position: "absolute", top: 8, left: 8, width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)" }}
                />
              </button>
              {notifOpen && (
                <div
                  style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, width: 320 }}
                  className="bg-popover border border-border rounded-sm shadow-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-sm">الإشعارات</span>
                    <button
                      onClick={() => { toast.success("تم تحديد الكل كمقروء"); setNotifOpen(false); }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      تحديد الكل كمقروء
                    </button>
                  </div>
                  <div className="divide-y divide-border max-h-80 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="p-4 hover:bg-muted/50 flex gap-3">
                        <span
                          style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: n.unread ? "var(--color-accent)" : "var(--color-border)" }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold mb-0.5">{n.title}</p>
                          <p className="text-xs text-muted-foreground mb-1">{n.body}</p>
                          <span className="text-[10px] font-mono text-muted-foreground ltr block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* New token button */}
            <Link
              to="/factory"
              className="hidden sm:inline-flex px-4 lg:px-5 py-2 lg:py-2.5 bg-accent text-accent-foreground font-bold text-xs lg:text-sm rounded-sm hover:brightness-110 transition-all items-center gap-2"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              <span className="hidden md:inline">إنشاء توكن</span>
              <span className="md:hidden">جديد</span>
            </Link>

            {/* User menu */}
            <div ref={userRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 hover:bg-muted rounded p-1 transition-colors"
              >
                <div className="size-9 bg-foreground/5 rounded-full outline outline-1 outline-offset-2 outline-border grid place-items-center text-xs font-bold">
                  أع
                </div>
                <ChevronDown className="size-3 text-muted-foreground hidden lg:block" />
              </button>
              {userOpen && (
                <div
                  style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, width: 224 }}
                  className="bg-popover border border-border rounded-sm shadow-xl overflow-hidden py-1"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-bold">أحمد العامودي</p>
                    <p className="text-xs text-muted-foreground">admin@nawah.io</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="size-4" /> الملف الشخصي
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="size-4" /> الإعدادات
                    </Link>
                    <div className="my-1 border-t border-border" />
                    <Link
                      to="/auth/login"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="size-4" /> تسجيل الخروج
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Search modal — pure CSS, no Radix */}
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }} dir="rtl">
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
            onClick={() => { setSearchOpen(false); setSearchQ(""); }}
          />
          <div
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "10vh" }}
          >
            <div
              ref={searchRef}
              className="w-full max-w-lg bg-background border border-border rounded-sm shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="ابحث عن صفحة أو إجراء..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <kbd className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">Esc</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredNav.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">لا توجد نتائج.</p>
                ) : (
                  <>
                    <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">الصفحات</p>
                    {filteredNav.map((n) => {
                      const Icon = n.icon;
                      return (
                        <button
                          key={n.to}
                          type="button"
                          onClick={() => { navigate({ to: n.to }); setSearchOpen(false); setSearchQ(""); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-right"
                        >
                          <Icon className="size-4 text-muted-foreground shrink-0" />
                          {n.label}
                        </button>
                      );
                    })}
                    <div className="border-t border-border">
                      <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">إجراءات سريعة</p>
                      <button
                        type="button"
                        onClick={() => { navigate({ to: "/factory" }); setSearchOpen(false); setSearchQ(""); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-right"
                      >
                        <Plus className="size-4 text-muted-foreground" /> إنشاء توكن جديد
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSearchOpen(false); setSearchQ(""); toast.success("تم تأكيد التحقق"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-right"
                      >
                        <CheckCircle2 className="size-4 text-muted-foreground" /> فحص أمني سريع
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarBody({ pathname, onNavigate, hideLogo }: {
  pathname: string; onNavigate?: () => void; hideLogo?: boolean;
}) {
  return (
    <>
      {!hideLogo && (
        <Link to="/" onClick={onNavigate} className="mb-10 flex items-center gap-3 shrink-0">
          <div className="size-8 bg-accent rounded-sm" />
          <span className="font-bold text-xl tracking-tight">نواة</span>
        </Link>
      )}
      <nav className="space-y-0.5 flex-1">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 py-2.5 px-3 rounded transition-colors ${active ? "bg-foreground/5 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 pt-6 border-t border-border">
        <Link
          to="/settings"
          onClick={onNavigate}
          className={`flex items-center gap-3 py-2.5 px-3 rounded transition-colors ${pathname === "/settings" ? "bg-foreground/5 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
        >
          <Settings className="size-4" strokeWidth={1.75} />
          <span className="text-sm">الإعدادات</span>
        </Link>
        <Link
          to="/auth/login"
          onClick={onNavigate}
          className="flex items-center gap-3 py-2.5 px-3 rounded text-muted-foreground hover:text-destructive hover:bg-muted/60 transition-colors"
        >
          <LogOut className="size-4" strokeWidth={1.75} />
          <span className="text-sm">تسجيل الخروج</span>
        </Link>
      </div>
    </>
  );
}
