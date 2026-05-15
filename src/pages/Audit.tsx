import { useState, useMemo } from "react";
import { PageHeader, EmptyState } from "@/components/Primitives";
import { Search, X, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type Level = "info" | "warn" | "critical";

const allEvents = [
  { action: "نشر عقد ERC-20", entity: "ريال كوين (RC)", user: "أحمد العامودي", ip: "192.168.4.12", time: "2026-05-12 14:32", level: "info" as Level },
  { action: "تحويل جماعي", entity: "BATCH-2026-001 (250 معاملة)", user: "سارة المطيري", ip: "10.0.2.41", time: "2026-05-12 13:18", level: "info" as Level },
  { action: "محاولة تسجيل دخول فاشلة", entity: "—", user: "غير معروف", ip: "203.0.113.55", time: "2026-05-12 11:04", level: "warn" as Level },
  { action: "تدوير مفتاح التشفير", entity: "Vault Key v3 → v4", user: "النظام", ip: "—", time: "2026-05-11 03:00", level: "info" as Level },
  { action: "تعديل صلاحيات مستخدم", entity: "محمد الزهراني → مدقق", user: "أحمد العامودي", ip: "192.168.4.12", time: "2026-05-10 16:45", level: "warn" as Level },
  { action: "تجميد محفظة", entity: "محفظة احتياطية معطلة", user: "النظام", ip: "—", time: "2026-05-09 22:11", level: "critical" as Level },
  { action: "تسجيل دخول ناجح", entity: "—", user: "نورة الحارثي", ip: "10.0.1.22", time: "2026-05-09 09:30", level: "info" as Level },
  { action: "تصدير تقرير PDF", entity: "ملخص شهري أبريل", user: "محمد الزهراني", ip: "192.168.4.15", time: "2026-05-08 14:00", level: "info" as Level },
  { action: "محاولة الوصول غير مصرح", entity: "API /wallets", user: "غير معروف", ip: "185.220.101.50", time: "2026-05-08 02:44", level: "critical" as Level },
  { action: "نشر عقد ERC-20", entity: "نظام الولاء (LOY)", user: "سارة المطيري", ip: "10.0.2.41", time: "2026-05-07 11:22", level: "info" as Level },
  { action: "تغيير كلمة المرور", entity: "account#1", user: "أحمد العامودي", ip: "192.168.4.12", time: "2026-05-06 19:05", level: "warn" as Level },
  { action: "إضافة شبكة RPC", entity: "Base Mainnet", user: "سارة المطيري", ip: "10.0.2.41", time: "2026-05-05 10:33", level: "info" as Level },
];

const levelStyles: Record<Level, { row: string; pill: string; stat: string }> = {
  info: { row: "", pill: "bg-muted text-muted-foreground", stat: "text-foreground" },
  warn: { row: "bg-warning/[0.04]", pill: "bg-warning/20 text-foreground", stat: "text-warning" },
  critical: { row: "bg-destructive/[0.04]", pill: "bg-destructive/15 text-destructive", stat: "text-destructive" },
};
const levelLabels: Record<Level, string> = { info: "INFO", warn: "WARN", critical: "CRIT" };
const levelFilters: (Level | "الكل")[] = ["الكل", "info", "warn", "critical"];
const levelDisplayName: Record<string, string> = { الكل: "الكل", info: "معلومات", warn: "تحذير", critical: "حرج" };

export function Audit() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<Level | "الكل">("الكل");
  const [userFilter, setUserFilter] = useState("");

  const users = useMemo(() => ["الكل", ...Array.from(new Set(allEvents.map((e) => e.user)))], []);

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      const q = query.toLowerCase();
      const matchQ = !q || e.action.includes(q) || e.entity.includes(q) || e.user.includes(q) || e.ip.includes(q);
      const matchL = levelFilter === "الكل" || e.level === levelFilter;
      const matchU = !userFilter || userFilter === "الكل" || e.user === userFilter;
      return matchQ && matchL && matchU;
    });
  }, [query, levelFilter, userFilter]);

  const clear = () => { setQuery(""); setLevelFilter("الكل"); setUserFilter(""); };
  const hasFilter = query || levelFilter !== "الكل" || (userFilter && userFilter !== "الكل");

  return (
    <>
      <PageHeader
        title="سجلات التدقيق"
        subtitle="سجل غير قابل للتعديل لكل عملية حساسة في المنصة."
        action={
          <button
            onClick={() => toast.success("جارٍ تصدير سجلات التدقيق...")}
            className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold inline-flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Download className="size-4" /> تصدير
          </button>
        }
      />

      {/* Summary stats — 1 col on very small, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 animate-enter">
        {(["info", "warn", "critical"] as Level[]).map((l) => {
          const count = allEvents.filter((e) => e.level === l).length;
          return (
            <button
              key={l}
              onClick={() => setLevelFilter(levelFilter === l ? "الكل" : l)}
              className={`border rounded-sm p-4 sm:p-5 text-right transition-all hover:border-foreground/40 ${
                levelFilter === l ? "border-foreground bg-foreground/[0.03]" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{levelDisplayName[l]}</p>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded-sm font-bold ${levelStyles[l].pill}`}>
                  {levelLabels[l]}
                </span>
              </div>
              <p className={`text-3xl font-bold font-mono ltr ${levelStyles[l].stat}`}>{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="border border-border rounded-sm p-3 sm:p-4 mb-4 sm:mb-6 animate-enter [animation-delay:80ms] space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1" style={{ minWidth: 180 }}>
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث في العمليات، المستخدمين، IP..."
              className="w-full bg-transparent border border-border rounded-sm py-2 pr-10 pl-4 text-sm outline-none focus:border-foreground transition-colors"
            />
          </div>
          {hasFilter && (
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0">
              <X className="size-3" /> مسح
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-1">
            {levelFilters.map((l) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-3 py-1.5 text-xs rounded-sm font-semibold transition-colors ${
                  levelFilter === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {levelDisplayName[l]}
              </button>
            ))}
          </div>
          <select
            value={userFilter || "الكل"}
            onChange={(e) => setUserFilter(e.target.value === "الكل" ? "" : e.target.value)}
            className="bg-transparent border border-border rounded-sm px-3 py-1.5 text-xs outline-none focus:border-foreground"
          >
            {users.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-mono">
        {filtered.length} من {allEvents.length} سجل
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2 animate-enter [animation-delay:100ms]">
        {filtered.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="لا توجد سجلات" description="لا توجد سجلات تطابق معايير البحث." action={<button onClick={clear} className="text-sm font-semibold underline underline-offset-4">مسح الفلاتر</button>} />
        ) : filtered.map((e, i) => (
          <div key={i} className={`border border-border rounded-sm p-4 ${levelStyles[e.level].row}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-bold text-sm">{e.action}</p>
              <span className={`inline-block px-2 py-1 text-[10px] font-mono font-bold rounded-sm shrink-0 ${levelStyles[e.level].pill}`}>
                {levelLabels[e.level]}
              </span>
            </div>
            {e.entity !== "—" && <p className="text-xs text-muted-foreground mb-1">{e.entity}</p>}
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-2">
              <span>{e.user}</span>
              <span className="ltr">{e.time.split(" ")[1]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block animate-enter [animation-delay:100ms]">
        <div className="table-scroll border border-border rounded-sm">
          {filtered.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="لا توجد سجلات" description="لا توجد سجلات تطابق معايير البحث." action={<button onClick={clear} className="text-sm font-semibold underline underline-offset-4">مسح الفلاتر</button>} />
          ) : (
            <table className="w-full text-right" style={{ minWidth: 700 }}>
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/40">
                  <th className="p-4 font-semibold text-right w-20">المستوى</th>
                  <th className="p-4 font-semibold text-right">العملية</th>
                  <th className="p-4 font-semibold text-right">الكيان</th>
                  <th className="p-4 font-semibold text-right">المستخدم</th>
                  <th className="p-4 font-semibold text-right hidden lg:table-cell">IP</th>
                  <th className="p-4 font-semibold text-right">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((e, i) => (
                  <tr key={i} className={`hover:bg-foreground/[0.02] transition-colors ${levelStyles[e.level].row}`}>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-sm text-[10px] font-mono font-bold ${levelStyles[e.level].pill}`}>
                        {levelLabels[e.level]}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm">{e.action}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{e.entity}</td>
                    <td className="p-4 text-sm">{e.user}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground ltr hidden lg:table-cell">{e.ip}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground ltr">{e.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
