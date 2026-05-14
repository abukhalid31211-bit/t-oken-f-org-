import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { FileDown, FileText, FileSpreadsheet, BarChart3, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { id: "monthly", title: "ملخص شهري شامل", desc: "إحصائيات النشر، التحويلات، والمحافظ", icon: BarChart3 },
  { id: "transfers", title: "تقرير التحويلات", desc: "تفصيل كامل لجميع التحويلات", icon: FileSpreadsheet },
  { id: "assets", title: "سجل الأصول الرقمية", desc: "جميع التوكنات المنشورة وعقودها", icon: FileText },
  { id: "audit", title: "تقرير التدقيق الأمني", desc: "أحداث الأمان والوصول", icon: FileText },
];

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

      <div className="border border-border rounded-sm p-5 mb-8 flex flex-wrap items-center gap-4 animate-enter">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Calendar className="size-4" /> الفترة:
        </div>
        {["اليوم", "الأسبوع", "الشهر الحالي", "الربع", "السنة", "مخصص"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${
              p === period ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 animate-enter [animation-delay:100ms]">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="border border-border rounded-sm p-6 lg:p-8 flex items-start gap-6 hover:border-foreground/40 transition-colors">
              <div className="size-12 grid place-items-center bg-muted rounded-sm shrink-0">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{r.desc}</p>
                <div className="flex gap-2">
                  <button
                    disabled={busy === `${r.id}-PDF`}
                    onClick={() => generate(r.id, "PDF")}
                    className="px-4 py-2 text-xs font-bold bg-foreground text-background rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 disabled:opacity-60"
                  >
                    {busy === `${r.id}-PDF` ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                    PDF
                  </button>
                  <button
                    disabled={busy === `${r.id}-Excel`}
                    onClick={() => generate(r.id, "Excel")}
                    className="px-4 py-2 text-xs font-bold border border-border rounded-sm inline-flex items-center gap-2 hover:bg-muted disabled:opacity-60"
                  >
                    {busy === `${r.id}-Excel` ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                    Excel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-12 animate-enter [animation-delay:200ms]">
        <h2 className="text-lg font-bold mb-6">تقارير منشأة مؤخراً</h2>
        <div className="space-y-2">
          {[
            { name: "ملخص شهري شامل", date: "2026-05-10 14:32", size: "2.4 MB", fmt: "PDF" },
            { name: "تقرير التحويلات Q2", date: "2026-05-01 09:15", size: "8.1 MB", fmt: "Excel" },
            { name: "تقرير التدقيق الأمني", date: "2026-04-28 21:00", size: "1.7 MB", fmt: "PDF" },
          ].map((r) => (
            <div key={r.date} className="border border-border rounded-sm p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground font-mono ltr mt-0.5">{r.date} • {r.size} • {r.fmt}</p>
              </div>
              <button onClick={() => toast.success("جارٍ التنزيل...")} className="text-sm font-semibold underline underline-offset-4">تنزيل</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
