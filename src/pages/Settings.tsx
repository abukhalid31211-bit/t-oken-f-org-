import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { Building2, Network, Users, Shield, Database, CreditCard, Plus, Trash2, KeyRound, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type TabId = "company" | "networks" | "users" | "security" | "backup" | "billing";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: "company", label: "ملف الشركة", icon: Building2 },
  { id: "networks", label: "الشبكات", icon: Network },
  { id: "users", label: "المستخدمون", icon: Users },
  { id: "security", label: "الأمان", icon: Shield },
  { id: "backup", label: "النسخ الاحتياطي", icon: Database },
  { id: "billing", label: "الفوترة", icon: CreditCard },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("company");

  return (
    <>
      <PageHeader title="الإعدادات" subtitle="ملف الشركة، الشبكات، الأمان، والتفضيلات." />

      {/* Mobile: horizontal scroll tabs */}
      <div className="lg:hidden mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6 animate-enter">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === t.id
                    ? "bg-foreground text-background font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12 animate-enter [animation-delay:80ms]">
        {/* Desktop sidebar */}
        <nav className="hidden lg:flex flex-col gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm text-right transition-colors ${
                  activeTab === t.id
                    ? "bg-foreground/5 text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="space-y-10 min-w-0">
          {activeTab === "company" && <Company />}
          {activeTab === "networks" && <NetworksTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "security" && <Security />}
          {activeTab === "backup" && <Backup />}
          {activeTab === "billing" && <Billing />}
        </div>
      </div>
    </>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, mono, type = "text" }: { label: string; value?: string; mono?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <input
        type={type}
        defaultValue={value}
        dir={mono ? "ltr" : "rtl"}
        className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}

function Company() {
  return (
    <>
      <Section
        title="ملف الشركة"
        action={
          <button onClick={() => toast.success("تم حفظ التغييرات")} className="text-xs font-bold px-4 py-2 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-colors">
            حفظ
          </button>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <Field label="اسم الشركة" value="مؤسسة الابتكار الرقمي" />
          <Field label="الاسم التجاري" value="نواة" />
          <Field label="البريد الإلكتروني" value="admin@nawah.io" mono />
          <Field label="الهاتف" value="+966 11 4xx xxxx" mono />
          <Field label="السجل التجاري" value="1010123456" mono />
          <Field label="الموقع الإلكتروني" value="https://nawah.io" mono />
        </div>
      </Section>

      <Section title="الخطة الحالية">
        <div className="border border-border rounded-sm p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Enterprise</p>
            <p className="text-xl sm:text-2xl font-bold">خطة المؤسسات</p>
            <p className="text-sm text-muted-foreground mt-1">توكنات غير محدودة • محافظ غير محدودة • دعم مخصص</p>
          </div>
          <button className="px-5 py-2.5 border border-border rounded-sm text-sm font-bold hover:bg-muted transition-colors shrink-0">إدارة الخطة</button>
        </div>
      </Section>
    </>
  );
}

function NetworksTab() {
  const nets = [
    { name: "Ethereum Mainnet", id: "1", rpc: "https://mainnet.infura.io/v3/...", active: true },
    { name: "Polygon", id: "137", rpc: "https://polygon-rpc.com", active: true },
    { name: "Arbitrum", id: "42161", rpc: "https://arb1.arbitrum.io/rpc", active: true },
    { name: "BNB Chain", id: "56", rpc: "https://bsc-dataseed.binance.org", active: false },
  ];
  return (
    <Section
      title="شبكات EVM المتصلة"
      action={
        <button onClick={() => toast.info("توجه إلى صفحة الشبكات لإضافة شبكة")} className="text-xs font-bold px-4 py-2 bg-foreground text-background rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
          <Plus className="size-3" /> إضافة شبكة
        </button>
      }
    >
      <div className="space-y-3">
        {nets.map((n) => (
          <div key={n.id} className="border border-border rounded-sm p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-bold mb-1 flex items-center gap-2 flex-wrap">
                {n.name}
                <span className="text-xs font-mono ltr text-muted-foreground">Chain ID: {n.id}</span>
              </p>
              <code className="text-xs font-mono text-muted-foreground ltr truncate block">{n.rpc}</code>
            </div>
            <span className={`text-xs font-mono px-2 py-1 rounded-sm shrink-0 ${n.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
              {n.active ? "ACTIVE" : "DISABLED"}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function UsersTab() {
  const users = [
    { name: "أحمد العامودي", email: "ahmed@nawah.io", role: "مالك", lastSeen: "الآن" },
    { name: "سارة المطيري", email: "sarah@nawah.io", role: "مسؤول", lastSeen: "منذ 5 دقائق" },
    { name: "محمد الزهراني", email: "mohammed@nawah.io", role: "مدقق", lastSeen: "أمس" },
    { name: "نورة الحارثي", email: "noura@nawah.io", role: "مشاهد", lastSeen: "منذ 3 أيام" },
  ];
  return (
    <Section
      title="فريق العمل"
      action={
        <button onClick={() => toast.info("تم إرسال دعوة")} className="text-xs font-bold px-4 py-2 bg-foreground text-background rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
          <Plus className="size-3" /> دعوة عضو
        </button>
      }
    >
      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2">
        {users.map((u) => (
          <div key={u.email} className="border border-border rounded-sm p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 bg-muted rounded-full grid place-items-center text-xs font-bold shrink-0">
                {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.role} · {u.lastSeen}</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block table-scroll border border-border rounded-sm">
        <table className="w-full text-right text-sm" style={{ minWidth: 500 }}>
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-4 text-right font-semibold">الاسم</th>
              <th className="p-4 text-right font-semibold">البريد</th>
              <th className="p-4 text-right font-semibold">الدور</th>
              <th className="p-4 text-right font-semibold">آخر نشاط</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 font-mono text-xs ltr text-muted-foreground">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4 text-xs text-muted-foreground">{u.lastSeen}</td>
                <td className="p-4">
                  <button className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Security() {
  return (
    <>
      <Section title="المصادقة">
        <div className="space-y-3">
          <Toggle label="المصادقة الثنائية (2FA)" desc="تفعيل التحقق بخطوتين عبر تطبيق المصادقة" on={true} />
          <Toggle label="الدخول عبر SSO المؤسسي" desc="تمكين SAML 2.0 لشركتك" on={false} />
          <Toggle label="قيود IP" desc="السماح بالدخول من عناوين IP محددة فقط" on={true} />
        </div>
      </Section>

      <Section
        title="مفاتيح الـ API"
        action={
          <button onClick={() => toast.success("تم توليد مفتاح جديد")} className="text-xs font-bold px-4 py-2 bg-foreground text-background rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
            <KeyRound className="size-3" /> إنشاء مفتاح
          </button>
        }
      >
        <div className="space-y-3">
          {[
            { name: "Production API", key: "nwh_prod_•••••••••••••••••••a3f2", date: "2026-04-12" },
            { name: "Webhook Secret", key: "whsec_•••••••••••••••••••8b91", date: "2026-03-22" },
          ].map((k) => (
            <div key={k.name} className="border border-border rounded-sm p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm mb-1">{k.name}</p>
                <code className="text-xs font-mono text-muted-foreground ltr truncate block">{k.key}</code>
              </div>
              <span className="text-xs font-mono text-muted-foreground ltr shrink-0">{k.date}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function Backup() {
  return (
    <Section title="النسخ الاحتياطي">
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="border border-border rounded-sm p-5 sm:p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">آخر نسخة</p>
          <p className="text-xl sm:text-2xl font-bold mb-1 ltr font-mono">2026-05-13 03:00</p>
          <p className="text-sm text-muted-foreground">حجم النسخة: 124 MB</p>
        </div>
        <div className="border border-border rounded-sm p-5 sm:p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">جدولة تلقائية</p>
          <p className="text-xl sm:text-2xl font-bold mb-1">يومياً</p>
          <p className="text-sm text-muted-foreground">الاحتفاظ لمدة 90 يوم</p>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => toast.success("بدأ إنشاء نسخة احتياطية")} className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm hover:bg-foreground/90 transition-colors">
          إنشاء نسخة الآن
        </button>
        <button className="px-5 py-2.5 border border-border rounded-sm text-sm font-semibold hover:bg-muted transition-colors">
          استعادة من نسخة
        </button>
      </div>
    </Section>
  );
}

function Billing() {
  return (
    <>
      <Section title="طريقة الدفع">
        <div className="border border-border rounded-sm p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-foreground text-background rounded-sm grid place-items-center font-bold text-xs shrink-0">VISA</div>
            <div>
              <p className="font-bold">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">تنتهي في 12/2027</p>
            </div>
          </div>
          <button className="text-sm font-semibold underline underline-offset-4 hover:text-accent transition-colors">تحديث</button>
        </div>
      </Section>
      <Section title="فواتير سابقة">
        <div className="space-y-2">
          {["2026-05", "2026-04", "2026-03"].map((m) => (
            <div key={m} className="border border-border rounded-sm p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-sm ltr">INV-{m}-001</div>
              <div className="text-sm text-muted-foreground">{m}</div>
              <div className="font-mono text-sm font-bold ltr">$2,400.00</div>
              <button className="text-xs font-semibold underline underline-offset-4 hover:text-accent transition-colors">تنزيل PDF</button>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function Toggle({ label, desc, on }: { label: string; desc: string; on: boolean }) {
  const [val, setVal] = useState(on);
  return (
    <div className="flex items-start justify-between gap-4 sm:gap-6 p-4 sm:p-5 border border-border rounded-sm hover:border-foreground/20 transition-colors">
      <div className="min-w-0">
        <p className="font-bold mb-1 text-sm sm:text-base">{label}</p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => setVal(!val)}
        className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${val ? "bg-foreground" : "bg-border"}`}
        aria-label={val ? "تعطيل" : "تفعيل"}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-background transition-all shadow-sm ${val ? "right-1" : "right-6"}`} />
      </button>
    </div>
  );
}
