import { PageHeader } from "@/components/Primitives";
import { FileDown, FileText, FileSpreadsheet, BarChart3 } from "lucide-react";

const reports = [
  { title: "ملخص شهري شامل", desc: "إحصائيات النشر، التحويلات، والمحافظ", icon: BarChart3 },
  { title: "تقرير التحويلات", desc: "تفصيل كامل لجميع التحويلات", icon: FileSpreadsheet },
  { title: "سجل الأصول الرقمية", desc: "جميع التوكنات المنشورة وعقودها", icon: FileText },
  { title: "تقرير التدقيق الأمني", desc: "أحداث الأمان والوصول", icon: FileText },
];

export function Reports() {
  return (
    <>
      <PageHeader title="التقارير" subtitle="تصدير تقارير مؤسسية احترافية بصيغة PDF أو Excel." />

      <div className="grid grid-cols-2 gap-6 animate-enter">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="border border-border rounded-sm p-8 flex items-start gap-6 hover:border-foreground/40 transition-colors group"
            >
              <div className="size-12 grid place-items-center bg-muted rounded-sm shrink-0">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{r.desc}</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-xs font-bold bg-foreground text-background rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
                    <FileDown className="size-3.5" />
                    PDF
                  </button>
                  <button className="px-4 py-2 text-xs font-bold border border-border rounded-sm inline-flex items-center gap-2 hover:bg-muted transition-colors">
                    <FileDown className="size-3.5" />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
