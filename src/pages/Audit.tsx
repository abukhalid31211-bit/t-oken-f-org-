import { PageHeader } from "@/components/Primitives";

const events = [
  { action: "نشر عقد ERC-20", entity: "ريال كوين (RC)", user: "أحمد العامودي", ip: "192.168.4.12", time: "2026-05-12 14:32", level: "info" as const },
  { action: "تحويل جماعي", entity: "BATCH-2026-001 (250 معاملة)", user: "سارة المطيري", ip: "10.0.2.41", time: "2026-05-12 13:18", level: "info" as const },
  { action: "محاولة تسجيل دخول فاشلة", entity: "—", user: "غير معروف", ip: "203.0.113.55", time: "2026-05-12 11:04", level: "warn" as const },
  { action: "تدوير مفتاح التشفير", entity: "Vault Key v3 → v4", user: "النظام", ip: "—", time: "2026-05-11 03:00", level: "info" as const },
  { action: "تعديل صلاحيات مستخدم", entity: "محمد الزهراني → مدقق", user: "أحمد العامودي", ip: "192.168.4.12", time: "2026-05-10 16:45", level: "warn" as const },
  { action: "تجميد محفظة", entity: "محفظة احتياطية معطلة", user: "النظام", ip: "—", time: "2026-05-09 22:11", level: "critical" as const },
];

const levelStyles = {
  info: "bg-muted text-muted-foreground",
  warn: "bg-warning/20 text-foreground",
  critical: "bg-destructive/15 text-destructive",
};

const levelLabels = { info: "INFO", warn: "WARN", critical: "CRIT" };

export function Audit() {
  return (
    <>
      <PageHeader
        title="سجلات التدقيق"
        subtitle="سجل غير قابل للتعديل لكل عملية حساسة في المنصة."
      />

      <div className="border border-border rounded-sm overflow-hidden animate-enter">
        <table className="w-full text-right">
          <thead>
            <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/40">
              <th className="p-4 font-semibold text-right w-20">المستوى</th>
              <th className="p-4 font-semibold text-right">العملية</th>
              <th className="p-4 font-semibold text-right">الكيان</th>
              <th className="p-4 font-semibold text-right">المستخدم</th>
              <th className="p-4 font-semibold text-right">IP</th>
              <th className="p-4 font-semibold text-right">الوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-sm text-[10px] font-mono font-bold ${levelStyles[e.level]}`}
                  >
                    {levelLabels[e.level]}
                  </span>
                </td>
                <td className="p-4 font-bold text-sm">{e.action}</td>
                <td className="p-4 text-sm text-muted-foreground">{e.entity}</td>
                <td className="p-4 text-sm">{e.user}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground ltr">{e.ip}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground ltr">{e.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
