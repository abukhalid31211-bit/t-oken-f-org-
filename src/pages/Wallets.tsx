import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { Plus, Copy, MoreHorizontal, Loader2, Wallet } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const initial = [
  { name: "محفظة الخزينة الأساسية", network: "Ethereum", addr: "0x71C4a8d92e1f...3f2a", balance: "12.482 ETH", status: "active" as const },
  { name: "محفظة العمليات اليومية", network: "Polygon", addr: "0x1a23bc4567...9b01", balance: "8,420 MATIC", status: "active" as const },
  { name: "محفظة التوزيع - حملة Q4", network: "Arbitrum", addr: "0xf8e2d104a8...1c47", balance: "0.84 ETH", status: "active" as const },
  { name: "محفظة احتياطية معطلة", network: "BNB Chain", addr: "0x4118e92c1d...a012", balance: "0.00 BNB", status: "failed" as const },
];

export function Wallets() {
  const [wallets, setWallets] = useState(initial);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [network, setNetwork] = useState("Ethereum");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setTimeout(() => {
      const addr = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
      setWallets((w) => [{ name, network, addr, balance: "0.00 ETH", status: "active" as const }, ...w]);
      toast.success(`تم إنشاء "${name}" بأمان`);
      setOpen(false);
      setCreating(false);
      setName("");
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="إدارة المحافظ"
        subtitle="محافظ مؤسسية مشفرة بـ Fernet مع تدوير دوري للمفاتيح."
        action={
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            إضافة محفظة
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-enter">
        {[
          { l: "إجمالي المحافظ", v: String(wallets.length) },
          { l: "محافظ نشطة", v: String(wallets.filter((w) => w.status === "active").length) },
          { l: "آخر تدوير للمفاتيح", v: "منذ 14 يوم" },
        ].map((s) => (
          <div key={s.l} className="border border-border p-6 rounded-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{s.l}</p>
            <p className="text-3xl font-bold ltr font-mono">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 animate-enter [animation-delay:150ms]">
        {wallets.map((w) => (
          <div
            key={w.addr}
            className="border border-border rounded-sm p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-12 gap-4 items-center hover:border-foreground/30 transition-colors"
          >
            <div className="col-span-2 sm:col-span-4">
              <p className="font-bold mb-1">{w.name}</p>
              <p className="text-xs font-mono text-muted-foreground ltr">{w.network}</p>
            </div>
            <div className="col-span-2 sm:col-span-4 flex items-center gap-2 min-w-0">
              <code className="text-sm font-mono text-muted-foreground ltr truncate">{w.addr}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(w.addr); toast.success("تم نسخ العنوان"); }}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
            <div className="sm:col-span-2 font-mono ltr font-bold text-sm">{w.balance}</div>
            <div className="sm:col-span-1">
              <StatusPill variant={w.status}>
                {w.status === "active" ? "Active" : "Disabled"}
              </StatusPill>
            </div>
            <div className="sm:col-span-1 text-left">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-8 grid place-items-center text-muted-foreground hover:text-foreground transition-colors mr-auto">
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info("جارٍ تحميل التفاصيل")}>عرض التفاصيل</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("تم تدوير المفتاح")}>تدوير المفتاح</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("تم تصدير المفتاح المشفر")}>تصدير المفتاح المشفر</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => { setWallets((all) => all.filter((x) => x.addr !== w.addr)); toast.success("تم تجميد المحفظة"); }}
                  >
                    تجميد المحفظة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight flex items-center gap-3">
              <Wallet className="size-5" />
              إنشاء محفظة جديدة
            </DialogTitle>
            <DialogDescription>
              سيتم توليد زوج مفاتيح آمن وتشفيره فوراً قبل الحفظ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={create} className="space-y-5 mt-2">
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">اسم المحفظة</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="مثال: محفظة الخزينة الرئيسية"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">الشبكة الافتراضية</span>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground"
              >
                {["Ethereum", "Polygon", "BNB Chain", "Arbitrum", "Optimism", "Base"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="p-4 border border-border bg-muted/40 rounded-sm text-xs leading-relaxed">
              🔒 سيتم تشفير المفتاح الخاص فوراً باستخدام Fernet ولن يُكشف لأحد، حتى لمسؤولي النظام.
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-3 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {creating && <Loader2 className="size-4 animate-spin" />}
                {creating ? "جارٍ الإنشاء..." : "إنشاء وحفظ"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
