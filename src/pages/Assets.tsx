import { PageHeader, StatusPill } from "@/components/Primitives";
import { Download, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";

const assets = [
  { name: "ريال كوين", symbol: "RC", supply: "1,000,000", network: "Ethereum", addr: "0x71C4...3f2a", deployed: "2026-04-12", status: "active" as const },
  { name: "أصول النمو", symbol: "GTO", supply: "50,000,000", network: "Polygon", addr: "0x1a23...9b01", deployed: "2026-04-08", status: "active" as const },
  { name: "محفظة الأمان", symbol: "SEC", supply: "2,500", network: "Arbitrum", addr: "0xf8e2...1c47", deployed: "2026-04-06", status: "pending" as const },
  { name: "نظام الولاء", symbol: "LOY", supply: "10,000,000", network: "Polygon", addr: "0x102f...99ee", deployed: "2026-03-29", status: "active" as const },
  { name: "توكن الطاقة", symbol: "NRG", supply: "500,000", network: "BNB Chain", addr: "0x4118...a012", deployed: "2026-03-21", status: "failed" as const },
];

export function Assets() {
  return (
    <>
      <PageHeader
        title="سجل الأصول"
        subtitle="جميع التوكنات المنشورة عبر شبكاتك المختلفة."
        action={
          <div className="flex gap-2">
            <button className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold inline-flex items-center gap-2 hover:bg-muted">
              <Filter className="size-4" /> تصفية
            </button>
            <button className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold inline-flex items-center gap-2 hover:bg-muted">
              <Download className="size-4" /> تصدير
            </button>
          </div>
        }
      />

      <div className="overflow-x-auto animate-enter border border-border rounded-sm">
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
            {assets.map((a) => (
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
                    {a.status === "active" ? "Active" : a.status === "pending" ? "Pending" : "Failed"}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
