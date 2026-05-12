import { PageHeader } from "@/components/Primitives";

export function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="ملف الشركة، الشبكات، الأمان، والتفضيلات." />

      <div className="grid grid-cols-4 gap-12 animate-enter">
        <aside className="space-y-1">
          {["ملف الشركة", "الشبكات", "المستخدمون والصلاحيات", "الأمان", "النسخ الاحتياطي", "الفوترة"].map(
            (t, i) => (
              <button
                key={t}
                className={`w-full text-right py-2 px-3 rounded text-sm transition-colors ${
                  i === 0 ? "bg-foreground/5 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ),
          )}
        </aside>

        <div className="col-span-3 space-y-10">
          <Section title="ملف الشركة">
            <div className="grid grid-cols-2 gap-6">
              <Field label="اسم الشركة" value="مؤسسة الابتكار الرقمي" />
              <Field label="الاسم التجاري" value="نواة" />
              <Field label="البريد الإلكتروني" value="admin@nawah.io" mono />
              <Field label="الهاتف" value="+966 11 4xx xxxx" mono />
            </div>
          </Section>

          <Section title="الخطة الحالية">
            <div className="border border-border rounded-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Enterprise
                </p>
                <p className="text-2xl font-bold">خطة المؤسسات</p>
                <p className="text-sm text-muted-foreground mt-1">
                  توكنات غير محدودة • محافظ غير محدودة • دعم مخصص
                </p>
              </div>
              <button className="px-5 py-2.5 border border-border rounded-sm text-sm font-bold hover:bg-muted transition-colors">
                إدارة الخطة
              </button>
            </div>
          </Section>
        </div>
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

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block">{label}</span>
      <input
        defaultValue={value}
        dir={mono ? "ltr" : "rtl"}
        className={`w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground transition-colors ${
          mono ? "font-mono text-sm" : ""
        }`}
      />
    </label>
  );
}
