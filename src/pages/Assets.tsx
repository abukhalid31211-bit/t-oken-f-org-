import { useState, useMemo } from "react";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { Download, Search, X } from "lucide-react";
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

const statusLabel: Record<string, string> = { active: "نشط", pending: "قيد الانتظار", failed: "فشل", الكل: "الكل" };

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
            className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold inline-flex items-center gap-2 hover:bg-muted"
          >
            <Download className="size-4" /> تصدير
          </button>
        }
      />

      {/* Filters */}
      <div className="border border-border rounded-sm p-4 mb-6 animate-enter flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث باسم التوكن أو الرمز أو العنوان..."
            className="w-full bg-transparent border border-border rounded-sm py-2 pr-10 pl-4 text-sm outline-none focus:border-foreground transition-colors"
          />
        </div>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="bg-transparent border border-border rounded-sm px-3 py-2 text-sm outline-none focus:border-foreground"
        >
          {networks.map((n) => <option key={n}>{n}</option>)}
        </select>
        <div className="flex gap-1">
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
        {hasFilter && (
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="size-3" /> مسح
          </button>
        )}
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-mono">
        {filtered.length} من {allAssets.length} توكن
      </div>

      <div className="overflow-x-auto animate-enter [animation-delay:100ms] border border-border rounded-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-muted-foreground text-sm">لا توجد توكنات تطابق معايير البحث.</p>
            <button onClick={clear} className="mt-3 text-sm font-semibold underline underline-offset-4">مسح الفلاتر</button>
          </div>
        ) : (
          <table className="w-full text-right">
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
                  <td className="p-4 font-mono text-xs ltr text-muted-foreground">{a.network}</td>
                  <td className="p-4 font-mono text-xs ltr text-muted-foreground">{a.addr}</td>
                  <td className="p-4 font-mono text-xs ltr text-muted-foreground">{a.deployed}</td>
                  <td className="p-4 text-left">
                    <StatusPill variant={a.status}>
                      {a.status === "active" ? "نشط" : a.status === "pending" ? "قيد الانتظار" : "فشل"}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
