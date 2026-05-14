import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { Upload, Send, FileSpreadsheet, Loader2, Check, X, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const batches = [
  { id: "BATCH-2026-001", token: "ريال كوين (RC)", count: 250, status: "active" as const, time: "اكتمل منذ ساعة" },
  { id: "BATCH-2025-118", token: "نظام الولاء (LOY)", count: 1200, status: "pending" as const, time: "جارٍ — 78%" },
  { id: "BATCH-2025-117", token: "أصول النمو (GTO)", count: 84, status: "failed" as const, time: "فشل 12 معاملة" },
];

const sampleCsv = [
  { addr: "0x71C4a8d92e1f5b6c8d3a4f2b1c5e7a9b3d4f6c2a", amount: 100 },
  { addr: "0x1a23bc4567890ef12d34a56b78c9d0e1f2345678", amount: 250 },
  { addr: "0xf8e2d104a85b6c7d8e9f0a1b2c3d4e5f6789abcd", amount: 75 },
  { addr: "0x4118e92c1d0a2b3c4d5e6f7a8b9c0d1e2f345678", amount: 500 },
  { addr: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b", amount: 1000 },
];

export function Distribution() {
  return (
    <>
      <PageHeader
        title="التوزيع الجماعي"
        subtitle="أرسل توكناتك إلى آلاف العناوين دفعة واحدة بأمان وموثوقية."
      />

      <Tabs defaultValue="single" className="animate-enter" dir="rtl">
        <TabsList className="mb-8">
          <TabsTrigger value="single" className="gap-2">
            <Send className="size-4" /> تحويل فردي
          </TabsTrigger>
          <TabsTrigger value="bulk" className="gap-2">
            <Upload className="size-4" /> تحويل جماعي (CSV)
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileSpreadsheet className="size-4" /> سجل الدفعات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single"><SingleTransfer /></TabsContent>
        <TabsContent value="bulk"><BulkTransfer /></TabsContent>
        <TabsContent value="history"><BatchHistory /></TabsContent>
      </Tabs>
    </>
  );
}

function SingleTransfer() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("ريال كوين (RC)");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.startsWith("0x") || to.length < 10) {
      toast.error("عنوان غير صالح");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`تم إرسال ${amount} ${token.split(" ")[0]} بنجاح`);
      setLoading(false);
      setTo(""); setAmount(""); setMemo("");
    }, 1200);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      <form onSubmit={submit} className="lg:col-span-2 space-y-6">
        <Field label="التوكن" type="select"
          options={["ريال كوين (RC)", "أصول النمو (GTO)", "نظام الولاء (LOY)"]}
          value={token} onChange={setToken} />
        <Field label="عنوان المستلم" mono required placeholder="0x..."
          value={to} onChange={setTo} />
        <Field label="الكمية" mono required placeholder="100.00"
          value={amount} onChange={setAmount} />
        <Field label="ملاحظة (اختياري)" placeholder="غرض التحويل..."
          value={memo} onChange={setMemo} />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-foreground text-background font-bold rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {loading ? "جارٍ الإرسال..." : "إرسال التحويل"}
        </button>
      </form>

      <aside className="border border-border rounded-sm p-6 h-fit space-y-3 text-sm">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">ملخص المعاملة</p>
        <Row k="من" v="محفظة الخزينة" />
        <Row k="إلى" v={to ? to.slice(0, 10) + "..." : "—"} mono />
        <Row k="الكمية" v={amount || "—"} mono />
        <Row k="الرسوم" v="~0.0008 ETH" mono />
        <div className="pt-3 mt-3 border-t border-border">
          <Row k="الإجمالي التقديري" v={amount ? `${amount} + رسوم` : "—"} bold />
        </div>
      </aside>
    </div>
  );
}

function BulkTransfer() {
  const [stage, setStage] = useState<"upload" | "preview" | "sending" | "done">("upload");
  const [progress, setProgress] = useState(0);

  const startSend = () => {
    setStage("sending");
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setStage("done"); return 100; }
        return p + 10;
      });
    }, 200);
  };

  if (stage === "upload") {
    return (
      <div
        onClick={() => setStage("preview")}
        className="border-2 border-dashed border-border hover:border-foreground/40 rounded-sm p-16 text-center cursor-pointer transition-colors"
      >
        <Upload className="size-10 mx-auto mb-4 text-muted-foreground" strokeWidth={1.5} />
        <p className="font-bold text-lg mb-2">اسحب ملف CSV هنا أو انقر للتصفح</p>
        <p className="text-sm text-muted-foreground mb-6">
          الصيغة المتوقعة: <code className="font-mono ltr">address, amount</code> — حد أقصى 10,000 سجل
        </p>
        <button className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm">
          اختيار ملف
        </button>
      </div>
    );
  }

  if (stage === "preview") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
              recipients_q4.csv
            </p>
            <h3 className="text-xl font-bold">معاينة الدفعة — {sampleCsv.length} مستلم</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-success/15 text-success text-xs font-mono rounded-sm">{sampleCsv.length} صالح</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-mono rounded-sm">0 خطأ</span>
          </div>
        </div>

        <div className="border border-border rounded-sm overflow-hidden mb-6">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                <th className="p-3 text-right">#</th>
                <th className="p-3 text-right">العنوان</th>
                <th className="p-3 text-right">الكمية</th>
                <th className="p-3 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sampleCsv.map((r, i) => (
                <tr key={i}>
                  <td className="p-3 font-mono text-xs text-muted-foreground ltr">{i + 1}</td>
                  <td className="p-3 font-mono text-xs ltr truncate max-w-xs">{r.addr}</td>
                  <td className="p-3 font-mono ltr">{r.amount.toLocaleString()}</td>
                  <td className="p-3"><Check className="size-4 text-success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat label="إجمالي المستلمين" value={String(sampleCsv.length)} />
          <Stat label="إجمالي الكمية" value={sampleCsv.reduce((a, b) => a + b.amount, 0).toLocaleString()} />
          <Stat label="الرسوم التقديرية" value="~0.04 ETH" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStage("upload")}
            className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            onClick={startSend}
            className="flex-1 py-3 bg-accent text-accent-foreground font-bold rounded-sm hover:brightness-110 inline-flex items-center justify-center gap-2"
          >
            <Send className="size-4" />
            بدء الإرسال
          </button>
        </div>
      </div>
    );
  }

  if (stage === "sending") {
    return (
      <div className="border border-border rounded-sm p-12 text-center">
        <Loader2 className="size-12 animate-spin mx-auto mb-6 text-accent" />
        <h3 className="text-xl font-bold mb-2">جارٍ معالجة الدفعة...</h3>
        <p className="text-sm text-muted-foreground mb-8">
          {Math.floor((progress / 100) * sampleCsv.length)} من {sampleCsv.length} معاملة مكتملة
        </p>
        <div className="max-w-md mx-auto h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-3 ltr">{progress}%</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-sm p-12 text-center">
      <div className="size-14 grid place-items-center mx-auto bg-success/15 rounded-full mb-6">
        <Check className="size-7 text-success" strokeWidth={3} />
      </div>
      <h3 className="text-2xl font-bold mb-2">اكتمل التوزيع بنجاح</h3>
      <p className="text-muted-foreground mb-8">تمت معالجة {sampleCsv.length} معاملة بدون أخطاء.</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setStage("upload")}
          className="px-6 py-3 border border-border rounded-sm font-semibold hover:bg-muted"
        >
          دفعة جديدة
        </button>
        <button className="px-6 py-3 bg-foreground text-background font-bold rounded-sm">
          عرض التقرير
        </button>
      </div>
    </div>
  );
}

function BatchHistory() {
  return (
    <div className="space-y-3">
      {batches.map((b) => (
        <div
          key={b.id}
          className="border border-border rounded-sm p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-12 gap-4 items-center"
        >
          <div className="sm:col-span-3 font-mono text-sm font-bold ltr">{b.id}</div>
          <div className="sm:col-span-3 text-sm">{b.token}</div>
          <div className="sm:col-span-2 ltr font-mono text-sm text-muted-foreground">
            {b.count.toLocaleString("en-US")} معاملة
          </div>
          <div className="sm:col-span-3 text-xs text-muted-foreground">{b.time}</div>
          <div className="sm:col-span-1 text-left">
            <StatusPill variant={b.status}>
              {b.status === "active" ? "Done" : b.status === "pending" ? "Live" : "Failed"}
            </StatusPill>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({
  label, type = "text", mono, required, placeholder, value, onChange, options,
}: {
  label: string; type?: string; mono?: boolean; required?: boolean;
  placeholder?: string; value?: string; onChange?: (v: string) => void; options?: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      {type === "select" ? (
        <select
          value={value} onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground"
        >
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type} required={required} placeholder={placeholder}
          value={value} onChange={(e) => onChange?.(e.target.value)}
          dir={mono ? "ltr" : "rtl"}
          className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground ${mono ? "font-mono text-sm" : ""}`}
        />
      )}
    </label>
  );
}

function Row({ k, v, mono, bold }: { k: string; v: string; mono?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground text-xs">{k}</dt>
      <dd className={`truncate ${bold ? "font-bold" : ""} ${mono ? "font-mono ltr text-xs" : "text-sm"}`}>{v}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-4 rounded-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold font-mono ltr">{value}</p>
    </div>
  );
}
