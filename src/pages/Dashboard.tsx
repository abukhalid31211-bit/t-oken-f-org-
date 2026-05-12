import { PageHeader, SectionTitle, StatusPill } from "@/components/Primitives";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
  { label: "التوكنات المنشورة", value: "124", trend: "+12", up: true },
  { label: "إجمالي التحويلات", value: "1.2M", trend: "+8%", up: true },
  { label: "المحافظ النشطة", value: "42.8k", trend: "+340", up: true },
  { label: "العمليات المعالجة", value: "100%", trend: "—", up: true },
];

const tokens = [
  { name: "ريال كوين", symbol: "RC", addr: "0x71C4...3f2a", type: "ERC-20", status: "active" as const },
  { name: "أصول النمو", symbol: "GTO", addr: "0x1a23...9b01", type: "ERC-20", status: "active" as const },
  { name: "محفظة الأمان", symbol: "SEC", addr: "0xf8e2...1c47", type: "ERC-20", status: "pending" as const },
  { name: "نظام الولاء", symbol: "LOY", addr: "0x102f...99ee", type: "ERC-20", status: "active" as const },
  { name: "توكن الطاقة", symbol: "NRG", addr: "0x4118...a012", type: "ERC-20", status: "failed" as const },
];

const alerts = [
  { title: "تم تأكيد عقد ذكي جديد", time: "منذ دقيقتين", accent: true },
  { title: "تحديث بروتوكول السيولة", time: "منذ ساعة", accent: false },
  { title: "اكتمال دفعة توزيع #BATCH-204", time: "منذ 3 ساعات", accent: false },
];

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="نظرة عامة"
        subtitle="إدارة أصول المؤسسة الرقمية عبر سلاسل الكتل المتعددة."
        action={
          <Link
            to="/factory"
            className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            إنشاء توكن جديد
          </Link>
        }
      />

      {/* KPI Grid */}
      <section className="grid grid-cols-4 border border-border rounded-sm overflow-hidden mb-12 animate-enter [animation-delay:100ms]">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className={`p-8 ${i < kpis.length - 1 ? "border-l border-border" : ""}`}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              {k.label}
            </p>
            <div className="flex items-baseline justify-between">
              <div className="text-4xl font-bold ltr font-mono">{k.value}</div>
              <span
                className={`text-xs font-mono inline-flex items-center gap-1 ${
                  k.up ? "text-success" : "text-destructive"
                }`}
              >
                {k.trend !== "—" && (k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />)}
                {k.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-3 gap-12 mb-12 animate-enter [animation-delay:200ms]">
        <div className="col-span-2 space-y-6">
          <SectionTitle>نشاط التحويلات (٣٠ يوم)</SectionTitle>
          <FakeChart />
        </div>
        <div className="space-y-6">
          <SectionTitle>تنبيهات النظام</SectionTitle>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.title}
                className={`p-4 border-r-2 ${a.accent ? "border-accent bg-foreground/[0.03]" : "border-border"}`}
              >
                <p className="text-sm font-semibold mb-1">{a.title}</p>
                <span className="text-xs text-muted-foreground font-mono ltr block">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tokens */}
      <section className="space-y-6 animate-enter [animation-delay:300ms]">
        <div className="flex items-center justify-between">
          <SectionTitle>آخر التوكنات المنشورة</SectionTitle>
          <Link
            to="/assets"
            className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 inline-flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border">
                <th className="pb-4 font-semibold text-right">التوكن</th>
                <th className="pb-4 font-semibold text-right">الرمز</th>
                <th className="pb-4 font-semibold text-right">العنوان</th>
                <th className="pb-4 font-semibold text-right">النوع</th>
                <th className="pb-4 font-semibold text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tokens.map((t) => (
                <tr key={t.symbol} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="py-5 font-bold">{t.name}</td>
                  <td className="py-5 font-mono text-sm text-muted-foreground ltr">{t.symbol}</td>
                  <td className="py-5 font-mono text-sm text-muted-foreground ltr">{t.addr}</td>
                  <td className="py-5 font-mono text-sm text-muted-foreground ltr">{t.type}</td>
                  <td className="py-5 text-left">
                    <StatusPill variant={t.status}>
                      {t.status === "active" ? "Active" : t.status === "pending" ? "Pending" : "Failed"}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function FakeChart() {
  // Generate a deterministic SVG line chart
  const points = [12, 18, 14, 22, 28, 24, 32, 30, 38, 42, 36, 48, 52, 46, 58, 62, 56, 68, 64, 72, 78, 70, 82, 88, 84, 92, 86, 94, 98, 95];
  const max = 100;
  const w = 800;
  const h = 240;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <div className="border border-border rounded-sm p-6 bg-card">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.22 38)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.68 0.22 38)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#g)" />
        <path d={path} fill="none" stroke="oklch(0.68 0.22 38)" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-4 ltr">
        <span>OCT 01</span><span>OCT 08</span><span>OCT 15</span><span>OCT 22</span><span>OCT 30</span>
      </div>
    </div>
  );
}
