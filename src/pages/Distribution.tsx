import { PageHeader, StatusPill } from "@/components/Primitives";
import { Upload, Send, FileSpreadsheet } from "lucide-react";

const batches = [
  { id: "BATCH-2026-001", token: "ريال كوين (RC)", count: 250, status: "active" as const, time: "اكتمل منذ ساعة" },
  { id: "BATCH-2025-118", token: "نظام الولاء (LOY)", count: 1200, status: "pending" as const, time: "جارٍ — 78%" },
  { id: "BATCH-2025-117", token: "أصول النمو (GTO)", count: 84, status: "failed" as const, time: "فشل 12 معاملة" },
];

export function Distribution() {
  return (
    <>
      <PageHeader
        title="التوزيع الجماعي"
        subtitle="أرسل توكناتك إلى آلاف العناوين دفعة واحدة بأمان وموثوقية."
      />

      <div className="grid grid-cols-2 gap-6 mb-12 animate-enter">
        <Card title="تحويل فردي" desc="إرسال مبلغ محدد إلى عنوان واحد" icon={Send} />
        <Card title="رفع ملف CSV" desc="استيراد قائمة عناوين ومبالغ من ملف" icon={Upload} accent />
      </div>

      <section className="animate-enter [animation-delay:150ms]">
        <h2 className="text-lg font-bold mb-6">الدفعات الأخيرة</h2>
        <div className="space-y-3">
          {batches.map((b) => (
            <div
              key={b.id}
              className="border border-border rounded-sm p-6 grid grid-cols-12 gap-4 items-center"
            >
              <div className="col-span-3 font-mono text-sm font-bold ltr">{b.id}</div>
              <div className="col-span-3 text-sm">{b.token}</div>
              <div className="col-span-2 ltr font-mono text-sm text-muted-foreground">
                {b.count.toLocaleString("en-US")} معاملة
              </div>
              <div className="col-span-3 text-xs text-muted-foreground">{b.time}</div>
              <div className="col-span-1 text-left">
                <StatusPill variant={b.status}>
                  {b.status === "active" ? "Done" : b.status === "pending" ? "Live" : "Failed"}
                </StatusPill>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Card({
  title,
  desc,
  icon: Icon,
  accent,
}: {
  title: string;
  desc: string;
  icon: typeof Send;
  accent?: boolean;
}) {
  return (
    <button
      className={`text-right p-8 border rounded-sm transition-all hover:-translate-y-0.5 ${
        accent
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground/40"
      }`}
    >
      <Icon className="size-6 mb-6" strokeWidth={1.5} />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`text-sm ${accent ? "text-background/70" : "text-muted-foreground"}`}>{desc}</p>
    </button>
  );
}
