import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { ArrowRight, Copy, ExternalLink, Pause, Flame, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/assets/$id")({
  component: AssetDetail,
  head: ({ params }) => ({ meta: [{ title: `نواة — ${params.id}` }] }),
});

const dataMap: Record<string, any> = {
  RC: { name: "ريال كوين", symbol: "RC", supply: "1,000,000", network: "Ethereum", addr: "0x71C4a8d92e1f5b6c8d3a4f2b1c5e7a9b3d4f6c2a", deployed: "2026-04-12", holders: 1248, transfers: 8420 },
  GTO: { name: "أصول النمو", symbol: "GTO", supply: "50,000,000", network: "Polygon", addr: "0x1a23bc4567890ef12d34a56b78c9d0e1f2345678", deployed: "2026-04-08", holders: 542, transfers: 1893 },
};

function AssetDetail() {
  const { id } = useParams({ from: "/_app/assets/$id" });
  const a = dataMap[id] ?? { name: id, symbol: id, supply: "—", network: "—", addr: "0x...", deployed: "—", holders: 0, transfers: 0 };

  const transfers = [
    { hash: "0x9f2b...e3d5", from: "0x71C4...3f2a", to: "0x1a23...9b01", amount: "1,000", time: "منذ 3 دقائق" },
    { hash: "0x3a1c...b8d2", from: "0x71C4...3f2a", to: "0xf8e2...1c47", amount: "250", time: "منذ 12 دقيقة" },
    { hash: "0x7e4d...2f9a", from: "0x102f...99ee", to: "0x71C4...3f2a", amount: "5,000", time: "منذ ساعة" },
    { hash: "0xb6c8...4a01", from: "0x71C4...3f2a", to: "0x9a8b...1a0b", amount: "75", time: "منذ ساعتين" },
  ];

  return (
    <>
      <Link to="/assets" className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
        <ArrowRight className="size-3" /> العودة لسجل الأصول
      </Link>

      <PageHeader
        title={a.name}
        subtitle={`عقد ERC-20 على شبكة ${a.network}`}
        action={
          <div className="flex gap-2">
            <button onClick={() => toast.success("تم إيقاف العقد")} className="px-4 py-2 border border-border rounded-sm text-sm font-semibold hover:bg-muted inline-flex items-center gap-2">
              <Pause className="size-3.5" /> إيقاف
            </button>
            <button onClick={() => toast.info("جارٍ سك توكنات إضافية")} className="px-4 py-2 bg-foreground text-background rounded-sm text-sm font-bold inline-flex items-center gap-2">
              <Plus className="size-3.5" /> سك توكنات
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-enter">
        <Stat label="الرمز" value={a.symbol} mono />
        <Stat label="إجمالي المعروض" value={a.supply} mono />
        <Stat label="الحاملون" value={a.holders.toLocaleString()} mono />
        <Stat label="التحويلات" value={a.transfers.toLocaleString()} mono />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-enter [animation-delay:100ms]">
        <div className="lg:col-span-2 border border-border rounded-sm p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">معلومات العقد</p>
          <dl className="space-y-3 text-sm">
            <Row k="عنوان العقد" v={a.addr} mono copy />
            <Row k="الشبكة" v={a.network} />
            <Row k="المعيار" v="ERC-20" />
            <Row k="المنازل العشرية" v="18" mono />
            <Row k="المالك" v="0x71C4...3f2a" mono copy />
            <Row k="تاريخ النشر" v={a.deployed} mono />
            <Row k="الإصدار" v="Solidity 0.8.20" />
          </dl>
          <a href="#" className="mt-6 text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 inline-flex items-center gap-2">
            عرض على Etherscan <ExternalLink className="size-3.5" />
          </a>
        </div>
        <div className="border border-border rounded-sm p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">الخصائص</p>
          <ul className="space-y-3 text-sm">
            <Feature label="Mintable" on />
            <Feature label="Burnable" on />
            <Feature label="Pausable" on={false} />
            <Feature label="Capped Supply" on={false} />
          </ul>
        </div>
      </div>

      <section className="animate-enter [animation-delay:200ms]">
        <h2 className="text-lg font-bold mb-6">آخر التحويلات</h2>
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-right text-sm">
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
                <tr key={t.hash} className="hover:bg-foreground/[0.02]">
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

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border border-border p-5 rounded-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-bold ${mono ? "font-mono ltr" : ""}`}>{value}</p>
    </div>
  );
}

function Row({ k, v, mono, copy }: { k: string; v: string; mono?: boolean; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground text-xs">{k}</dt>
      <dd className={`flex items-center gap-2 truncate ${mono ? "font-mono ltr text-xs" : "font-semibold text-sm"}`}>
        <span className="truncate">{v}</span>
        {copy && (
          <button onClick={() => { navigator.clipboard.writeText(v); toast.success("تم النسخ"); }} className="text-muted-foreground hover:text-foreground shrink-0">
            <Copy className="size-3" />
          </button>
        )}
      </dd>
    </div>
  );
}

function Feature({ label, on }: { label: string; on: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <StatusPill variant={on ? "active" : "failed"}>{on ? "ON" : "OFF"}</StatusPill>
    </li>
  );
}
