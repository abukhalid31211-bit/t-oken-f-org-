import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { FileDown, FileText, FileSpreadsheet, BarChart3, Loader2, Calendar, TrendingUp, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { id: "monthly", title: "ملخص شهري شامل", desc: "إحصائيات النشر، التحويلات، والمحافظ لكامل الشهر", icon: BarChart3, color: "bg-accent/10 text-accent" },
  { id: "transfers", title: "تقرير التحويلات", desc: "تفصيل كامل لجميع التحويلات مع تحليل أنماط الإرسال", icon: TrendingUp, color: "bg-success/10 text-success" },
  { id: "assets", title: "سجل الأصول الرقمية", desc: "جميع التوكنات المنشورة وعقودها وبياناتها التشغيلية", icon: FileText, color: "bg-warning/10 text-foreground" },
  { id: "audit", title: "تقرير التدقيق الأمني", desc: "أحداث الأمان، محاولات الوصول، والعمليات الحساسة", icon: ShieldCheck, color: "bg-destructive/10 text-destructive" },
];

const periods = ["اليوم", "الأسبوع", "الشهر الحالي", "الربع", "السنة"];

export function Reports() {
  const [busy, setBusy] = useState<string | null>(null);
  const [period, setPeriod] = useState("الشهر الحالي");

  const generate = (id: string, fmt: "PDF" | "Excel") => {
    setBusy(`${id}-${fmt}`);
    setTimeout(() => {
      setBusy(null);
      toast.success(`تم إنشاء التقرير بصيغة ${fmt}`);
    }, 1100);
  };

  return (
    <>
      <PageHeader title="التقارير" subtitle="تصدير تقارير مؤسسية احترافية بصيغة PDF أو Excel." />

      {/* Period selector */}
      <div className="border border-border rounded-sm p-3 sm:p-5 mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3 animate-enter">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0">
          <Calendar className="size-4" /> الفترة:
        </div>
        <div className="flex gap-1 flex-wrap">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-sm transition-colors font-medium ${
                p === period ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 animate-enter [animation-delay:80ms]">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="border border-border rounded-sm p-5 sm:p-6 lg:p-8 flex items-start gap-4 sm:gap-6 hover:border-foreground/30 transition-colors group"
            >
              <div className={`size-11 sm:size-12 grid place-items-center rounded-sm shrink-0 ${r.color}`}>
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{r.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">{r.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    disabled={busy === `${r.id}-PDF`}
                    onClick={() => generate(r.id, "PDF")}
                    className="px-3 sm:px-4 py-2 text-xs font-bold bg-foreground text-background rounded-sm inline-flex items-center gap-1.5 hover:bg-foreground/90 disabled:opacity-60 transition-colors"
                  >
                    {busy === `${r.id}-PDF` ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                    PDF
                  </button>
                  <button
                    disabled={busy === `${r.id}-Excel`}
                    onClick={() => generate(r.id, "Excel")}
                    className="px-3 sm:px-4 py-2 text-xs font-bold border border-border rounded-sm inline-flex items-center gap-1.5 hover:bg-muted disabled:opacity-60 transition-colors"
                  >
                    {busy === `${r.id}-Excel` ? <Loader2 className="size-3.5 animate-spin" /> : <FileSpreadsheet className="size-3.5" />}
                    Excel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent reports */}
      <section className="mt-8 sm:mt-12 animate-enter [animation-delay:160ms]">
        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">تقارير منشأة مؤخراً</h2>
        <div className="space-y-2">
          {[
            { name: "ملخص شهري شامل", date: "2026-05-10 14:32", size: "2.4 MB", fmt: "PDF" },
            { name: "تقرير التحويلات Q2", date: "2026-05-01 09:15", size: "8.1 MB", fmt: "Excel" },
            { name: "تقرير التدقيق الأمني", date: "2026-04-28 21:00", size: "1.7 MB", fmt: "PDF" },
          ].map((r) => (
            <div
              key={r.date}
              className="border border-border rounded-sm p-4 flex items-center justify-between gap-4 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 bg-muted rounded-sm grid place-items-center shrink-0">
                  {r.fmt === "PDF" ? <FileText className="size-4 text-muted-foreground" /> : <FileSpreadsheet className="size-4 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground font-mono ltr mt-0.5 truncate">{r.date} · {r.size} · {r.fmt}</p>
                </div>
              </div>
              <button
                onClick={() => toast.success("جارٍ التنزيل...")}
                className="text-sm font-semibold underline underline-offset-4 shrink-0 hover:text-accent transition-colors"
              >
                تنزيل
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
