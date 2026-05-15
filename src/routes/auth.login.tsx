import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "AkramX — تسجيل الدخول" }] }),
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate({ to: "/" });
    }, 900);
  };

  return (
    <>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
        مرحباً بعودتك
      </p>
      <h1 className="text-4xl font-bold tracking-tight mb-3">تسجيل الدخول</h1>
      <p className="text-muted-foreground mb-10">
        ادخل بيانات حسابك المؤسسي للمتابعة.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <Field label="البريد الإلكتروني المؤسسي" type="email" placeholder="name@company.com" mono required />
        <div>
          <label className="block">
            <span className="text-sm font-semibold mb-2 flex items-center justify-between">
              كلمة المرور
              <Link to="/auth/forgot" className="text-xs font-normal text-muted-foreground hover:text-foreground underline underline-offset-2">
                نسيت كلمة المرور؟
              </Link>
            </span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                dir="ltr"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors font-mono text-sm pl-12"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-foreground" />
          <span>إبقائي مسجلاً للدخول لمدة ٣٠ يوم</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">أو</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button className="w-full py-3 border border-border rounded-sm font-semibold text-sm hover:bg-muted transition-colors">
        الدخول عبر SSO المؤسسي
      </button>

      <p className="text-sm text-muted-foreground text-center mt-10">
        ليس لديك حساب؟{" "}
        <Link to="/auth/register" className="font-bold text-foreground underline decoration-accent decoration-2 underline-offset-4">
          أنشئ حساب مؤسسة
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
