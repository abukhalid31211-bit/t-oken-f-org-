import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { Check, Rocket } from "lucide-react";

const features = [
  { id: "mintable", label: "قابل للسك (Mintable)", desc: "السماح للمالك بإصدار المزيد من التوكنات لاحقاً" },
  { id: "burnable", label: "قابل للحرق (Burnable)", desc: "السماح بحرق التوكنات لتقليل المعروض" },
  { id: "pausable", label: "قابل للإيقاف (Pausable)", desc: "إيقاف التحويلات مؤقتاً في حالات الطوارئ" },
  { id: "capped", label: "حد أقصى للمعروض", desc: "تحديد سقف صارم لإجمالي العرض" },
];

export function TokenFactory() {
  const [active, setActive] = useState<Record<string, boolean>>({
    mintable: true,
    burnable: true,
    pausable: false,
    capped: false,
  });

  return (
    <>
      <PageHeader
        title="مصنع التوكنات"
        subtitle="صمم وانشر عقد ERC-20 خلال دقائق دون كتابة سطر برمجي واحد."
      />

      <div className="grid grid-cols-3 gap-12 animate-enter">
        <div className="col-span-2 space-y-10">
          <Section title="١. المعلومات الأساسية">
            <div className="grid grid-cols-2 gap-6">
              <Field label="اسم التوكن" placeholder="مثال: ريال رقمي" />
              <Field label="الرمز (Symbol)" placeholder="RIY" mono />
              <Field label="المنازل العشرية" placeholder="18" mono />
              <Field label="المعروض الأولي" placeholder="1,000,000" mono />
            </div>
          </Section>

          <Section title="٢. الشبكة والمحفظة">
            <div className="grid grid-cols-2 gap-6">
              <Select label="الشبكة" options={["Ethereum Mainnet", "Polygon", "BNB Chain", "Arbitrum"]} />
              <Select label="محفظة النشر" options={["محفظة الخزينة الأساسية", "محفظة العمليات"]} />
            </div>
          </Section>

          <Section title="٣. الخصائص الاختيارية">
            <div className="space-y-3">
              {features.map((f) => {
                const on = active[f.id];
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive((s) => ({ ...s, [f.id]: !on }))}
                    className={`w-full text-right p-5 border rounded-sm flex items-start gap-4 transition-all ${
                      on
                        ? "border-foreground bg-foreground/[0.03]"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div
                      className={`size-5 shrink-0 rounded-sm border-2 grid place-items-center mt-0.5 transition-colors ${
                        on ? "bg-foreground border-foreground" : "border-border"
                      }`}
                    >
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

        {/* Sticky preview */}
        <aside className="space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="border border-border rounded-sm p-6 bg-card">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                ملخص العقد
              </p>
              <dl className="space-y-3 text-sm">
                <Row k="المعيار" v="ERC-20" />
                <Row k="الترجمة" v="Solidity 0.8.20" />
                <Row k="الغاز التقديري" v="~0.012 ETH" />
                <Row k="الخصائص" v={Object.values(active).filter(Boolean).length + " مفعّلة"} />
              </dl>

              <button className="mt-6 w-full py-3 px-4 bg-accent text-accent-foreground font-bold rounded-sm inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all">
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

function Field({ label, placeholder, mono }: { label: string; placeholder: string; mono?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <input
        placeholder={placeholder}
        dir={mono ? "ltr" : "rtl"}
        className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors ${
          mono ? "font-mono text-sm" : ""
        }`}
      />
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <select className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-bold font-mono ltr">{v}</dd>
    </div>
  );
}
