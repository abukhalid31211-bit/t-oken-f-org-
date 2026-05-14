import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { Check, Rocket, Loader2, ExternalLink, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

const features = [
  { id: "mintable", label: "قابل للسك (Mintable)", desc: "السماح للمالك بإصدار المزيد من التوكنات لاحقاً" },
  { id: "burnable", label: "قابل للحرق (Burnable)", desc: "السماح بحرق التوكنات لتقليل المعروض" },
  { id: "pausable", label: "قابل للإيقاف (Pausable)", desc: "إيقاف التحويلات مؤقتاً في حالات الطوارئ" },
  { id: "capped", label: "حد أقصى للمعروض", desc: "تحديد سقف صارم لإجمالي العرض" },
];

type Step = "form" | "review" | "deploying" | "success";

export function TokenFactory() {
  const [active, setActive] = useState<Record<string, boolean>>({
    mintable: true, burnable: true, pausable: false, capped: false,
  });
  const [form, setForm] = useState({
    name: "", symbol: "", decimals: "18", supply: "1000000",
    network: "Ethereum Mainnet", wallet: "محفظة الخزينة الأساسية",
  });
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("review");
  const [txHash] = useState("0x9f2b8c1a4d7e35f6b09c2e8a1d4f5b3c7e9a02d1f4b6c8e0a3d5f7b9c1e3d5f7");

  const startDeploy = () => {
    if (!form.name || !form.symbol) {
      toast.error("الرجاء تعبئة الاسم والرمز");
      return;
    }
    setStep("review");
    setOpen(true);
  };

  const confirmDeploy = () => {
    setStep("deploying");
    setTimeout(() => {
      setStep("success");
      toast.success(`تم نشر ${form.symbol} بنجاح على ${form.network}`);
    }, 2200);
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => setStep("form"), 200);
  };

  return (
    <>
      <PageHeader
        title="مصنع التوكنات"
        subtitle="صمم وانشر عقد ERC-20 خلال دقائق دون كتابة سطر برمجي واحد."
      />

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 animate-enter">
        <div className="lg:col-span-2 space-y-10">
          <Section title="١. المعلومات الأساسية">
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="اسم التوكن" placeholder="مثال: ريال رقمي"
                value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="الرمز (Symbol)" placeholder="RIY" mono
                value={form.symbol} onChange={(v) => setForm({ ...form, symbol: v.toUpperCase() })} />
              <Field label="المنازل العشرية" placeholder="18" mono
                value={form.decimals} onChange={(v) => setForm({ ...form, decimals: v })} />
              <Field label="المعروض الأولي" placeholder="1,000,000" mono
                value={form.supply} onChange={(v) => setForm({ ...form, supply: v })} />
            </div>
          </Section>

          <Section title="٢. الشبكة والمحفظة">
            <div className="grid sm:grid-cols-2 gap-6">
              <Select label="الشبكة" value={form.network}
                onChange={(v) => setForm({ ...form, network: v })}
                options={["Ethereum Mainnet", "Polygon", "BNB Chain", "Arbitrum", "Optimism", "Base"]} />
              <Select label="محفظة النشر" value={form.wallet}
                onChange={(v) => setForm({ ...form, wallet: v })}
                options={["محفظة الخزينة الأساسية", "محفظة العمليات", "محفظة التوزيع"]} />
            </div>
          </Section>

          <Section title="٣. الخصائص الاختيارية">
            <div className="space-y-3">
              {features.map((f) => {
                const on = active[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActive((s) => ({ ...s, [f.id]: !on }))}
                    className={`w-full text-right p-5 border rounded-sm flex items-start gap-4 transition-all ${
                      on ? "border-foreground bg-foreground/[0.03]" : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className={`size-5 shrink-0 rounded-sm border-2 grid place-items-center mt-0.5 transition-colors ${
                      on ? "bg-foreground border-foreground" : "border-border"
                    }`}>
                      {on && <Check className="size-3 text-background" strokeWidth={3} />}
                    </div>
                    <div>
                      <p className="font-bold mb-1">{f.label}</p>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="border border-border rounded-sm p-6 bg-card">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                ملخص العقد
              </p>
              <dl className="space-y-3 text-sm">
                <Row k="الاسم" v={form.name || "—"} />
                <Row k="الرمز" v={form.symbol || "—"} mono />
                <Row k="المعيار" v="ERC-20" />
                <Row k="الترجمة" v="Solidity 0.8.20" />
                <Row k="الغاز التقديري" v="~0.012 ETH" />
                <Row k="الخصائص" v={Object.values(active).filter(Boolean).length + " مفعّلة"} />
              </dl>

              <button
                onClick={startDeploy}
                className="mt-6 w-full py-3 px-4 bg-accent text-accent-foreground font-bold rounded-sm inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                <Rocket className="size-4" strokeWidth={2.5} />
                مراجعة ونشر
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              سيتم تشفير المفتاح الخاص للمحفظة باستخدام Fernet ولن يُكشف
              بعد التوقيع. يمكنك تتبع حالة النشر من سجل الأصول.
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={(o) => { if (step !== "deploying") setOpen(o); }}>
        <DialogContent className="max-w-lg" dir="rtl">
          {step === "review" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl tracking-tight">تأكيد نشر العقد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="p-4 bg-muted/50 rounded-sm">
                  <dl className="space-y-2 text-sm">
                    <Row k="الاسم" v={form.name || "—"} />
                    <Row k="الرمز" v={form.symbol || "—"} mono />
                    <Row k="المعروض" v={Number(form.supply || 0).toLocaleString("en-US")} mono />
                    <Row k="الشبكة" v={form.network} />
                    <Row k="المحفظة" v={form.wallet} />
                    <Row k="الغاز" v="~0.012 ETH" mono />
                  </dl>
                </div>
                <div className="p-4 border border-warning/40 bg-warning/10 rounded-sm text-xs leading-relaxed">
                  ⚠ بمجرد النشر، لا يمكن تعديل الكود الأساسي للعقد. تأكد من جميع البيانات قبل التأكيد.
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={confirmDeploy}
                    className="flex-1 py-3 bg-accent text-accent-foreground font-bold rounded-sm hover:brightness-110 inline-flex items-center justify-center gap-2"
                  >
                    <Rocket className="size-4" strokeWidth={2.5} />
                    تأكيد ونشر العقد الآن
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "deploying" && (
            <div className="text-center py-8">
              <Loader2 className="size-12 animate-spin mx-auto mb-6 text-accent" />
              <DialogTitle className="text-xl mb-2">جارٍ نشر العقد...</DialogTitle>
              <p className="text-sm text-muted-foreground">
                ترجمة الكود → تقدير الغاز → التوقيع → النشر على {form.network}
              </p>
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent animate-pulse" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <>
              <div className="text-center mb-6">
                <div className="size-14 grid place-items-center mx-auto bg-success/15 rounded-full mb-4">
                  <Check className="size-7 text-success" strokeWidth={3} />
                </div>
                <DialogTitle className="text-2xl mb-2">تم النشر بنجاح</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  عقد {form.symbol || "TKN"} نشط الآن على {form.network}.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-sm">
                <p className="text-xs text-muted-foreground mb-2">عنوان العقد</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono ltr truncate flex-1">{txHash.slice(0, 42)}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(txHash); toast.success("تم النسخ"); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted"
                >
                  نشر آخر
                </button>
                <Link
                  to="/assets"
                  onClick={reset}
                  className="flex-1 py-3 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 inline-flex items-center justify-center gap-2"
                >
                  عرض في سجل الأصول
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 pb-3 border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label, placeholder, mono, value, onChange,
}: { label: string; placeholder?: string; mono?: boolean; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        dir={mono ? "ltr" : "rtl"}
        className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}

function Select({
  label, options, value, onChange,
}: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground text-xs">{k}</dt>
      <dd className={`font-bold text-sm truncate ${mono ? "font-mono ltr" : ""}`}>{v}</dd>
    </div>
  );
}
