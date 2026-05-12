import { PageHeader, StatusPill } from "@/components/Primitives";
import { Plus, Copy, MoreHorizontal } from "lucide-react";

const wallets = [
  { name: "محفظة الخزينة الأساسية", network: "Ethereum", addr: "0x71C4a8d92e1f...3f2a", balance: "12.482 ETH", status: "active" as const },
  { name: "محفظة العمليات اليومية", network: "Polygon", addr: "0x1a23bc4567...9b01", balance: "8,420 MATIC", status: "active" as const },
  { name: "محفظة التوزيع - حملة Q4", network: "Arbitrum", addr: "0xf8e2d104a8...1c47", balance: "0.84 ETH", status: "active" as const },
  { name: "محفظة احتياطية معطلة", network: "BNB Chain", addr: "0x4118e92c1d...a012", balance: "0.00 BNB", status: "failed" as const },
];

export function Wallets() {
  return (
    <>
      <PageHeader
        title="إدارة المحافظ"
        subtitle="محافظ مؤسسية مشفرة بـ Fernet مع تدوير دوري للمفاتيح."
        action={
          <button className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
            <Plus className="size-4" strokeWidth={2.5} />
            إضافة محفظة
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-6 mb-10 animate-enter">
        {[
          { l: "إجمالي المحافظ", v: "12" },
          { l: "محافظ نشطة", v: "9" },
          { l: "آخر تدوير للمفاتيح", v: "منذ 14 يوم" },
        ].map((s) => (
          <div key={s.l} className="border border-border p-6 rounded-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              {s.l}
            </p>
            <p className="text-3xl font-bold ltr font-mono">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 animate-enter [animation-delay:150ms]">
        {wallets.map((w) => (
          <div
            key={w.addr}
            className="border border-border rounded-sm p-6 grid grid-cols-12 gap-4 items-center hover:border-foreground/30 transition-colors"
          >
            <div className="col-span-4">
              <p className="font-bold mb-1">{w.name}</p>
              <p className="text-xs font-mono text-muted-foreground ltr">{w.network}</p>
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <code className="text-sm font-mono text-muted-foreground ltr truncate">{w.addr}</code>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="size-3.5" />
              </button>
            </div>
            <div className="col-span-2 font-mono ltr font-bold text-sm">{w.balance}</div>
            <div className="col-span-1">
              <StatusPill variant={w.status}>
                {w.status === "active" ? "Active" : "Disabled"}
              </StatusPill>
            </div>
            <div className="col-span-1 text-left">
              <button className="size-8 grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
