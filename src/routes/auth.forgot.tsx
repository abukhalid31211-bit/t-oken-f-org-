import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "نواة — استعادة كلمة المرور" }] }),
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success("تم إرسال رابط الاستعادة");
    }, 800);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="size-14 grid place-items-center mx-auto bg-foreground/5 rounded-full mb-6">
          <Mail className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">تحقق من بريدك</h1>
        <p className="text-muted-foreground mb-8">
          أرسلنا لك رابطاً لإعادة تعيين كلمة المرور. صلاحيته ٣٠ دقيقة.
        </p>
        <Link
          to="/auth/login"
          className="inline-block px-6 py-3 border border-border rounded-sm font-semibold hover:bg-muted transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight mb-3">استعادة كلمة المرور</h1>
      <p className="text-muted-foreground mb-10">
        أدخل بريدك المؤسسي وسنرسل لك رابط الاستعادة.
      </p>
      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-semibold mb-2 block">البريد الإلكتروني المؤسسي</span>
          <input
            type="email"
            required
            dir="ltr"
            placeholder="name@company.com"
            className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors font-mono text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
        </button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-10">
        تذكرت كلمة المرور؟{" "}
        <Link to="/auth/login" className="font-bold text-foreground underline decoration-accent decoration-2 underline-offset-4">
          تسجيل الدخول
        </Link>
      </p>
    </>
  );
}
