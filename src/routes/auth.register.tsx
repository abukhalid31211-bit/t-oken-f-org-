import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "نواة — إنشاء حساب مؤسسة" }] }),
});

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return setStep(step + 1);
    setLoading(true);
    setTimeout(() => {
      toast.success("تم إنشاء حسابك المؤسسي");
      navigate({ to: "/" });
    }, 900);
  };

  return (
    <>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
        خطوة {step} من ٣
      </p>
      <h1 className="text-4xl font-bold tracking-tight mb-3">إنشاء حساب مؤسسة</h1>
      <p className="text-muted-foreground mb-8">
        {step === 1 && "ابدأ بإدخال معلومات شركتك."}
        {step === 2 && "أنشئ حساب المسؤول الأول."}
        {step === 3 && "اختر الخطة المناسبة."}
      </p>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-foreground" : "bg-border"
            }`}
          />
        ))}
      </div>

      <form onSubmit={next} className="space-y-5">
        {step === 1 && (
          <>
            <Field label="اسم الشركة الرسمي" placeholder="مؤسسة الابتكار الرقمي" required />
            <Field label="السجل التجاري" placeholder="1010xxxxxx" mono required />
            <Field label="الدولة" placeholder="المملكة العربية السعودية" required />
            <Field label="حجم الشركة" placeholder="50-200 موظف" required />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="الاسم الكامل" placeholder="أحمد عبدالله العامودي" required />
            <Field label="البريد المؤسسي" type="email" placeholder="ahmed@company.com" mono required />
            <Field label="كلمة المرور" type="password" mono required />
            <Field label="تأكيد كلمة المرور" type="password" mono required />
          </>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {[
              { name: "Starter", price: "مجاني", desc: "حتى 3 توكنات / محفظتين", current: false },
              { name: "Business", price: "299 USD/شهر", desc: "توكنات غير محدودة، 10 محافظ", current: true },
              { name: "Enterprise", price: "تواصل معنا", desc: "SSO، SLA، دعم مخصص 24/7", current: false },
            ].map((p) => (
              <label
                key={p.name}
                className={`block p-5 border rounded-sm cursor-pointer transition-all ${
                  p.current ? "border-foreground bg-foreground/[0.03]" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="plan" defaultChecked={p.current} className="accent-foreground" />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <span className="font-mono text-sm">{p.price}</span>
                </div>
                <p className="text-sm text-muted-foreground pr-6">{p.desc}</p>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-border rounded-sm font-semibold hover:bg-muted transition-colors"
            >
              رجوع
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {step < 3 ? "متابعة" : loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            {step === 3 && !loading && <Check className="size-4" />}
          </button>
        </div>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-10">
        لديك حساب بالفعل؟{" "}
        <Link to="/auth/login" className="font-bold text-foreground underline decoration-accent decoration-2 underline-offset-4">
          تسجيل الدخول
        </Link>
      </p>
    </>
  );
}

function Field({
  label, type = "text", placeholder, mono, required,
}: { label: string; type?: string; placeholder?: string; mono?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        dir={mono ? "ltr" : "rtl"}
        className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}
