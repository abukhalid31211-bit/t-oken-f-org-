import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="size-10 bg-background text-foreground rounded-sm grid place-items-center shrink-0">
            <span className="text-sm font-black tracking-tighter ltr leading-none">AX</span>
          </div>
          <div className="flex flex-col leading-none gap-1">
            <span className="font-bold text-xl tracking-tight ltr">AkramX</span>
            <span className="text-[10px] text-background/60 font-semibold tracking-widest uppercase ltr">Web3 Solutions</span>
          </div>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-xs font-mono uppercase tracking-widest text-background/60 mb-6">
            Enterprise Web3 Infrastructure
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            بنية تحتية مؤسسية لإصدار وإدارة الأصول الرقمية.
          </h1>
          <p className="text-background/70 leading-relaxed">
            أنشئ، انشر، ووزّع توكنات ERC-20 عبر شبكات EVM المختلفة بأعلى معايير الأمان،
            دون الحاجة لكتابة سطر برمجي واحد.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 text-xs font-mono">
          <div>
            <p className="text-2xl font-bold mb-1 ltr">ISO 27001</p>
            <p className="text-background/60">معتمد أمنياً</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1 ltr">99.99%</p>
            <p className="text-background/60">جاهزية</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1 ltr">+8</p>
            <p className="text-background/60">شبكات مدعومة</p>
          </div>
        </div>

        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="size-8 bg-foreground text-background rounded-sm grid place-items-center shrink-0">
              <span className="text-[11px] font-black tracking-tighter ltr leading-none">AX</span>
            </div>
            <div className="flex flex-col leading-none gap-1">
              <span className="font-bold text-sm tracking-tight ltr">AkramX</span>
              <span className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase ltr">Web3 Solutions</span>
            </div>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
