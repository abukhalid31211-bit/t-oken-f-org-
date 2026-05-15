import { useState, useMemo } from "react";
import { PageHeader, StatusPill, EmptyState } from "@/components/Primitives";
import { Download, Search, X, Coins } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

const allAssets = [
  { name: "ريال كوين", symbol: "RC", supply: "1,000,000", network: "Ethereum", addr: "0x71C4...3f2a", deployed: "2026-04-12", status: "active" as const },
  { name: "أصول النمو", symbol: "GTO", supply: "50,000,000", network: "Polygon", addr: "0x1a23...9b01", deployed: "2026-04-08", status: "active" as const },
  { name: "محفظة الأمان", symbol: "SEC", supply: "2,500", network: "Arbitrum", addr: "0xf8e2...1c47", deployed: "2026-04-06", status: "pending" as const },
  { name: "نظام الولاء", symbol: "LOY", supply: "10,000,000", network: "Polygon", addr: "0x102f...99ee", deployed: "2026-03-29", status: "active" as const },
  { name: "توكن الطاقة", symbol: "NRG", supply: "500,000", network: "BNB Chain", addr: "0x4118...a012", deployed: "2026-03-21", status: "failed" as const },
  { name: "توكن الابتكار", symbol: "INV", supply: "5,000,000", network: "Base", addr: "0x8b3a...f091", deployed: "2026-03-15", status: "active" as const },
  { name: "درهم ذكي", symbol: "SDH", supply: "100,000,000", network: "Ethereum", addr: "0x3c5e...8d22", deployed: "2026-03-10", status: "active" as const },
];

const networks = ["الكل", "Ethereum", "Polygon", "Arbitrum", "BNB Chain", "Base", "Optimism"];
const statuses = ["الكل", "active", "pending", "failed"] as const;
const statusLabel: Record<string, string> = { active: "نشط", pending: "انتظار", failed: "فشل", الكل: "الكل" };
const networkBadge: Record<string, string> = {
  Ethereum: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Polygon: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Arbitrum: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "BNB Chain": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  Base: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Optimism: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Assets() {
  const [query, setQuery] = useState("");
  const [network, setNetwork] = useState("الكل");
  const [status, setStatus] = useState<typeof statuses[number]>("الكل");

  const filtered = useMemo(() => {
    return allAssets.filter((a) => {
      const q = query.toLowerCase();
      const matchQ = !q || a.name.includes(q) || a.symbol.toLowerCase().includes(q) || a.addr.toLowerCase().includes(q);
      const matchN = network === "الكل" || a.network === network;
      const matchS = status === "الكل" || a.status === status;
      return matchQ && matchN && matchS;
    });
  }, [query, network, status]);

  const clear = () => { setQuery(""); setNetwork("الكل"); setStatus("الكل"); };
  const hasFilter = query || network !== "الكل" || status !== "الكل";

  return (
    <>
      <PageHeader
        title="سجل الأصول"
        subtitle="جميع التوكنات المنشورة عبر شبكاتك المختلفة."
        action={
          <button
            onClick={() => toast.success("جارٍ تصدير البيانات...")}
            className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold inline-flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Download className="size-4" /> تصدير
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-enter">
        {[
          { l: "إجمالي التوكنات", v: String(allAssets.length) },
          { l: "نشط", v: String(allAssets.filter((a) => a.status === "active").length) },
          { l: "قيد الانتظار", v: String(allAssets.filter((a) => a.status === "pending").length) },
          { l: "فشل", v: String(allAssets.filter((a) => a.status === "failed").length) },
        ].map((s) => (
          <div key={s.l} className="border border-border rounded-sm p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{s.l}</p>
            <p className="text-2xl font-bold font-mono ltr">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="border border-border rounded-sm p-3 sm:p-4 mb-4 sm:mb-6 animate-enter [animation-delay:80ms] space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-0" style={{ minWidth: 180 }}>
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث بالاسم أو الرمز..."
              className="w-full bg-transparent border border-border rounded-sm py-2 pr-10 pl-4 text-sm outline-none focus:border-foreground transition-colors"
            />
          </div>
          {hasFilter && (
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0">
              <X className="size-3" /> مسح
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="bg-transparent border border-border rounded-sm px-3 py-1.5 text-xs outline-none focus:border-foreground"
          >
            {networks.map((n) => <option key={n}>{n}</option>)}
          </select>
          <div className="flex gap-1 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 text-xs rounded-sm font-semibold transition-colors ${
                  status === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-mono">
        {filtered.length} من {allAssets.length} توكن
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2 animate-enter [animation-delay:100ms]">
        {filtered.length === 0 ? (
          <EmptyState icon={Coins} title="لا توجد توكنات" description="لا توجد توكنات تطابق معايير البحث." action={<button onClick={clear} className="text-sm font-semibold underline underline-offset-4">مسح الفلاتر</button>} />
        ) : filtered.map((a) => (
          <Link
            key={a.symbol}
            to="/assets/$id"
            params={{ id: a.symbol }}
            className="block border border-border rounded-sm p-4 hover:border-foreground/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-muted rounded-sm grid place-items-center text-xs font-bold font-mono ltr shrink-0">{a.symbol}</div>
                <div>
                  <p className="font-bold text-sm">{a.name}</p>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ltr ${networkBadge[a.network] ?? "bg-muted text-muted-foreground"}`}>{a.network}</span>
                </div>
              </div>
              <StatusPill variant={a.status}>{statusLabel[a.status]}</StatusPill>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono ltr mt-1">
              <span>{a.addr}</span>
              <span>{a.supply}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block animate-enter [animation-delay:100ms]">
        <div className="table-scroll border border-border rounded-sm">
          {filtered.length === 0 ? (
            <EmptyState icon={Coins} title="لا توجد توكنات" description="لا توجد توكنات تطابق معايير البحث." action={<button onClick={clear} className="text-sm font-semibold underline underline-offset-4">مسح الفلاتر</button>} />
          ) : (
            <table className="w-full text-right" style={{ minWidth: 720 }}>
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/40">
                  <th className="p-4 font-semibold text-right">التوكن</th>
                  <th className="p-4 font-semibold text-right">الرمز</th>
                  <th className="p-4 font-semibold text-right">المعروض</th>
                  <th className="p-4 font-semibold text-right">الشبكة</th>
                  <th className="p-4 font-semibold text-right">عنوان العقد</th>
                  <th className="p-4 font-semibold text-right">تاريخ النشر</th>
                  <th className="p-4 font-semibold text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((a) => (
                  <tr key={a.symbol} className="hover:bg-foreground/[0.02] cursor-pointer transition-colors">
                    <td className="p-4 font-bold">
                      <Link to="/assets/$id" params={{ id: a.symbol }} className="hover:underline decoration-accent decoration-2 underline-offset-4">
                        {a.name}
                      </Link>
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground ltr">{a.symbol}</td>
                    <td className="p-4 font-mono text-sm ltr">{a.supply}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-mono px-2 py-1 rounded-sm ltr ${networkBadge[a.network] ?? "bg-muted text-muted-foreground"}`}>{a.network}</span>
                    </td>
                    <td className="p-4 font-mono text-xs ltr text-muted-foreground">{a.addr}</td>
                    <td className="p-4 font-mono text-xs ltr text-muted-foreground">{a.deployed}</td>
                    <td className="p-4 text-left">
                      <StatusPill variant={a.status}>{statusLabel[a.status]}</StatusPill>
                    </td>
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
