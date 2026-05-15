import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { Copy, ExternalLink, Pause, Plus, TrendingUp, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/assets/$id")({
  component: AssetDetail,
  head: ({ params }) => ({ meta: [{ title: `نواة — ${params.id}` }] }),
});

const dataMap: Record<string, any> = {
  RC: { name: "ريال كوين", symbol: "RC", supply: "1,000,000", network: "Ethereum", addr: "0x71C4a8d92e1f5b6c8d3a4f2b1c5e7a9b3d4f6c2a", deployed: "2026-04-12", holders: 1248, transfers: 8420, mintable: true, burnable: true, pausable: false, capped: false },
  GTO: { name: "أصول النمو", symbol: "GTO", supply: "50,000,000", network: "Polygon", addr: "0x1a23bc4567890ef12d34a56b78c9d0e1f2345678", deployed: "2026-04-08", holders: 542, transfers: 1893, mintable: false, burnable: true, pausable: true, capped: true },
};

const transfers = [
  { hash: "0x9f2b...e3d5", from: "0x71C4...3f2a", to: "0x1a23...9b01", amount: "1,000", time: "منذ 3 دقائق" },
  { hash: "0x3a1c...b8d2", from: "0x71C4...3f2a", to: "0xf8e2...1c47", amount: "250", time: "منذ 12 دقيقة" },
  { hash: "0x7e4d...2f9a", from: "0x102f...99ee", to: "0x71C4...3f2a", amount: "5,000", time: "منذ ساعة" },
  { hash: "0xb6c8...4a01", from: "0x71C4...3f2a", to: "0x9a8b...1a0b", amount: "75", time: "منذ ساعتين" },
];

function AssetDetail() {
  const { id } = useParams({ from: "/_app/assets/$id" });
  const a = dataMap[id] ?? {
    name: id, symbol: id, supply: "—", network: "—", addr: "0x...", deployed: "—",
    holders: 0, transfers: 0, mintable: false, burnable: false, pausable: false, capped: false,
  };

  return (
    <>
      <Link
        to="/assets"
        className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowRight className="size-3" /> العودة لسجل الأصول
      </Link>

      <PageHeader
        title={a.name}
        subtitle={`عقد ERC-20 على شبكة ${a.network}`}
        breadcrumbs={[
          { label: "سجل الأصول", to: "/assets" },
          { label: a.name },
        ]}
        action={
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toast.success("تم إيقاف العقد مؤقتاً")}
              className="px-3 sm:px-4 py-2 border border-border rounded-sm text-sm font-semibold hover:bg-muted inline-flex items-center gap-2 transition-colors"
            >
              <Pause className="size-3.5" />
              <span className="hidden sm:inline">إيقاف</span>
            </button>
            <button
              onClick={() => toast.info("جارٍ سك توكنات إضافية")}
              className="px-3 sm:px-4 py-2 bg-foreground text-background rounded-sm text-sm font-bold inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">سك توكنات</span>
            </button>
          </div>
        }
      />

      {/* Stats — 2x2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 animate-enter">
        <StatCard label="الرمز" value={a.symbol} mono icon={null} />
        <StatCard label="إجمالي المعروض" value={a.supply} mono />
        <StatCard label="الحاملون" value={a.holders.toLocaleString()} mono icon={Users} />
        <StatCard label="التحويلات" value={a.transfers.toLocaleString()} mono icon={TrendingUp} />
      </div>

      {/* Contract info + Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 animate-enter [animation-delay:80ms]">
        <div className="lg:col-span-2 border border-border rounded-sm p-5 sm:p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">معلومات العقد</p>
          <dl className="space-y-3 text-sm">
            <InfoRow k="عنوان العقد" v={a.addr} mono copy />
            <InfoRow k="الشبكة" v={a.network} />
            <InfoRow k="المعيار" v="ERC-20" />
            <InfoRow k="المنازل العشرية" v="18" mono />
            <InfoRow k="المالك" v="0x71C4...3f2a" mono copy />
            <InfoRow k="تاريخ النشر" v={a.deployed} mono />
            <InfoRow k="الإصدار" v="Solidity 0.8.20" />
          </dl>
          <a
            href="#"
            className="mt-5 sm:mt-6 text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 inline-flex items-center gap-2 hover:text-accent transition-colors"
          >
            عرض على Etherscan <ExternalLink className="size-3.5" />
          </a>
        </div>

        <div className="border border-border rounded-sm p-5 sm:p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">الخصائص</p>
          <ul className="space-y-3">
            {[
              { label: "Mintable", on: a.mintable },
              { label: "Burnable", on: a.burnable },
              { label: "Pausable", on: a.pausable },
              { label: "Capped Supply", on: a.capped },
            ].map((f) => (
              <li key={f.label} className="flex items-center justify-between text-sm">
                <span className="font-mono text-sm">{f.label}</span>
                <StatusPill variant={f.on ? "active" : "failed"}>{f.on ? "ON" : "OFF"}</StatusPill>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">إجراءات سريعة</p>
            <button
              onClick={() => toast.success("تم حرق 1000 توكن")}
              className="w-full py-2.5 text-sm font-semibold border border-destructive/40 text-destructive rounded-sm hover:bg-destructive/5 transition-colors"
            >
              حرق توكنات
            </button>
            <button
              onClick={() => toast.success("تم نقل الملكية")}
              className="w-full py-2.5 text-sm font-semibold border border-border rounded-sm hover:bg-muted transition-colors"
            >
              نقل الملكية
            </button>
          </div>
        </div>
      </div>

      {/* Transfers table */}
      <section className="animate-enter [animation-delay:160ms]">
        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">آخر التحويلات</h2>

        {/* Mobile: cards */}
        <div className="sm:hidden space-y-2">
          {transfers.map((t) => (
            <div key={t.hash} className="border border-border rounded-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-muted-foreground ltr">{t.hash}</span>
                <span className="font-bold font-mono text-sm ltr">{t.amount}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p className="ltr font-mono">من: {t.from}</p>
                <p className="ltr font-mono">إلى: {t.to}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t.time}</p>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block table-scroll border border-border rounded-sm">
          <table className="w-full text-right text-sm" style={{ minWidth: 600 }}>
            <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4 text-right font-semibold">Hash</th>
                <th className="p-4 text-right font-semibold">من</th>
                <th className="p-4 text-right font-semibold">إلى</th>
                <th className="p-4 text-right font-semibold">الكمية</th>
                <th className="p-4 text-right font-semibold">الوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transfers.map((t) => (
                <tr key={t.hash} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs ltr text-muted-foreground">{t.hash}</td>
                  <td className="p-4 font-mono text-xs ltr">{t.from}</td>
                  <td className="p-4 font-mono text-xs ltr">{t.to}</td>
                  <td className="p-4 font-mono text-sm font-bold ltr">{t.amount}</td>
                  <td className="p-4 text-xs text-muted-foreground">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value, mono, icon: Icon }: { label: string; value: string; mono?: boolean; icon?: any }) {
  return (
    <div className="border border-border p-4 sm:p-5 rounded-sm hover:border-foreground/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
        {Icon && <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />}
      </div>
      <p className={`text-xl sm:text-2xl font-bold ${mono ? "font-mono ltr" : ""}`}>{value}</p>
    </div>
  );
}

function InfoRow({ k, v, mono, copy }: { k: string; v: string; mono?: boolean; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground text-xs shrink-0">{k}</dt>
      <dd className={`flex items-center gap-2 min-w-0 ${mono ? "font-mono ltr text-xs" : "font-semibold text-sm"}`}>
        <span className="truncate">{v}</span>
        {copy && (
          <button
            onClick={() => { navigator.clipboard.writeText(v); toast.success("تم النسخ"); }}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            <Copy className="size-3" />
          </button>
        )}
      </dd>
    </div>
  );
}
