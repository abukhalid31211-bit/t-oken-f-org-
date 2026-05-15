import { PageHeader, SectionTitle, StatusPill } from "@/components/Primitives";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Activity, Layers, Wallet, CheckCircle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const kpis = [
  { label: "التوكنات المنشورة", value: "124", trend: "+12 هذا الشهر", up: true, icon: Layers },
  { label: "إجمالي التحويلات", value: "1.2M", trend: "+8% عن الشهر السابق", up: true, icon: Activity },
  { label: "المحافظ النشطة", value: "42.8k", trend: "+340 جديدة", up: true, icon: Wallet },
  { label: "نسبة النجاح", value: "99.8%", trend: "معدل المعالجة", up: true, icon: CheckCircle },
];

const tokens = [
  { name: "ريال كوين", symbol: "RC", addr: "0x71C4...3f2a", network: "Ethereum", status: "active" as const },
  { name: "أصول النمو", symbol: "GTO", addr: "0x1a23...9b01", network: "Polygon", status: "active" as const },
  { name: "محفظة الأمان", symbol: "SEC", addr: "0xf8e2...1c47", network: "Arbitrum", status: "pending" as const },
  { name: "نظام الولاء", symbol: "LOY", addr: "0x102f...99ee", network: "Polygon", status: "active" as const },
  { name: "توكن الطاقة", symbol: "NRG", addr: "0x4118...a012", network: "BNB Chain", status: "failed" as const },
];

const alerts = [
  { title: "تم تأكيد عقد ذكي جديد", body: "ريال كوين (RC) — Ethereum", time: "منذ دقيقتين", accent: true },
  { title: "تحديث بروتوكول السيولة", body: "Uniswap V4 Upgrade", time: "منذ ساعة", accent: false },
  { title: "اكتمال دفعة توزيع #BATCH-204", body: "١٢٠٠ معاملة", time: "منذ 3 ساعات", accent: false },
  { title: "تحذير: محاولة دخول مشبوهة", body: "IP 203.0.113.55", time: "منذ 5 ساعات", accent: false },
];

const chartData = [
  { d: "01", v: 12 }, { d: "02", v: 19 }, { d: "03", v: 15 }, { d: "04", v: 28 },
  { d: "05", v: 24 }, { d: "06", v: 32 }, { d: "07", v: 30 }, { d: "08", v: 38 },
  { d: "09", v: 42 }, { d: "10", v: 36 }, { d: "11", v: 48 }, { d: "12", v: 52 },
  { d: "13", v: 46 }, { d: "14", v: 58 }, { d: "15", v: 62 }, { d: "16", v: 56 },
  { d: "17", v: 68 }, { d: "18", v: 64 }, { d: "19", v: 72 }, { d: "20", v: 78 },
  { d: "21", v: 70 }, { d: "22", v: 82 }, { d: "23", v: 88 }, { d: "24", v: 84 },
  { d: "25", v: 92 }, { d: "26", v: 86 }, { d: "27", v: 94 }, { d: "28", v: 98 },
  { d: "29", v: 102 }, { d: "30", v: 108 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      dir="rtl"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 4,
        padding: "8px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--color-muted-foreground)", marginBottom: 4 }}>يوم {label}</p>
      <p style={{ fontWeight: 700, color: "oklch(0.68 0.22 38)" }}>{payload[0].value} تحويل</p>
    </div>
  );
}

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="نظرة عامة"
        subtitle="إدارة أصول المؤسسة الرقمية عبر سلاسل الكتل المتعددة."
        action={
          <Link
            to="/factory"
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">إنشاء توكن جديد</span>
            <span className="sm:hidden">جديد</span>
          </Link>
        }
      />

      {/* KPI Grid — 2 cols on mobile, 4 on desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 animate-enter [animation-delay:80ms]">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="border border-border rounded-sm p-4 sm:p-6 hover:border-foreground/20 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-4">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-tight">
                  {k.label}
                </p>
                <Icon className="size-3.5 sm:size-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
              </div>
              <div className="text-2xl sm:text-3xl xl:text-4xl font-bold ltr font-mono mb-1 sm:mb-2">
                {k.value}
              </div>
              <span className={`text-[10px] sm:text-xs font-mono inline-flex items-center gap-1 ${k.up ? "text-success" : "text-destructive"}`}>
                {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {k.trend}
              </span>
            </div>
          );
        })}
      </section>

      {/* Chart + Alerts — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 animate-enter [animation-delay:160ms]">
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle>نشاط التحويلات — آخر ٣٠ يوماً</SectionTitle>
          <div className="border border-border rounded-sm p-4 sm:p-6 bg-card">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 38)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="oklch(0.68 0.22 38)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="oklch(0.68 0.22 38)"
                  strokeWidth={2}
                  fill="url(#accentGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "oklch(0.68 0.22 38)", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle>تنبيهات النظام</SectionTitle>
          <div className="space-y-2 sm:space-y-3">
            {alerts.map((a) => (
              <div
                key={a.title}
                className={`p-3 sm:p-4 border-r-2 rounded-sm transition-colors hover:bg-foreground/[0.02] ${
                  a.accent ? "border-accent bg-foreground/[0.02]" : "border-border"
                }`}
              >
                <p className="text-sm font-semibold mb-0.5 leading-snug">{a.title}</p>
                <p className="text-xs text-muted-foreground mb-1">{a.body}</p>
                <span className="text-[10px] text-muted-foreground font-mono ltr block">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tokens Table */}
      <section className="space-y-4 animate-enter [animation-delay:240ms]">
        <SectionTitle
          action={
            <Link
              to="/assets"
              className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 inline-flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft className="size-3.5" />
            </Link>
          }
        >
          آخر التوكنات المنشورة
        </SectionTitle>

        {/* Mobile: card list */}
        <div className="sm:hidden space-y-2">
          {tokens.map((t) => (
            <Link
              key={t.symbol}
              to="/assets/$id"
              params={{ id: t.symbol }}
              className="flex items-center justify-between p-4 border border-border rounded-sm hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 bg-muted rounded-sm grid place-items-center text-xs font-bold font-mono shrink-0 ltr">
                  {t.symbol}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground ltr font-mono">{t.network}</p>
                </div>
              </div>
              <StatusPill variant={t.status}>
                {t.status === "active" ? "نشط" : t.status === "pending" ? "انتظار" : "فشل"}
              </StatusPill>
            </Link>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block table-scroll border border-border rounded-sm">
          <table className="w-full text-right" style={{ minWidth: 560 }}>
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/40">
                <th className="p-4 font-semibold text-right">التوكن</th>
                <th className="p-4 font-semibold text-right">الرمز</th>
                <th className="p-4 font-semibold text-right hidden md:table-cell">العنوان</th>
                <th className="p-4 font-semibold text-right">الشبكة</th>
                <th className="p-4 font-semibold text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tokens.map((t) => (
                <tr key={t.symbol} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="p-4 font-bold">
                    <Link
                      to="/assets/$id"
                      params={{ id: t.symbol }}
                      className="hover:underline decoration-accent decoration-2 underline-offset-4"
                    >
                      {t.name}
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-sm text-muted-foreground ltr">{t.symbol}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground ltr hidden md:table-cell">{t.addr}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground ltr">{t.network}</td>
                  <td className="p-4 text-left">
                    <StatusPill variant={t.status}>
                      {t.status === "active" ? "نشط" : t.status === "pending" ? "انتظار" : "فشل"}
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
