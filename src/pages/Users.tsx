import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/Primitives";
import { Plus, Trash2, MoreHorizontal, Loader2, UserCheck, UserX, Shield, Eye, Mail } from "lucide-react";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

type UserRole = "super_admin" | "finance_manager" | "operations_manager" | "auditor" | "viewer";
type UserStatus = "active" | "disabled";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastSeen: string;
  joinedAt: string;
}

const roleLabel: Record<UserRole, string> = {
  super_admin: "مدير عام",
  finance_manager: "مدير مالي",
  operations_manager: "مدير عمليات",
  auditor: "مدقق",
  viewer: "مشاهد",
};
const roleColor: Record<UserRole, string> = {
  super_admin: "bg-accent/15 text-accent",
  finance_manager: "bg-success/15 text-success",
  operations_manager: "bg-warning/20 text-foreground",
  auditor: "bg-muted text-muted-foreground",
  viewer: "bg-muted text-muted-foreground",
};
const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ["جميع الصلاحيات بلا قيود"],
  finance_manager: ["التحويلات", "التقارير المالية", "إدارة المحافظ"],
  operations_manager: ["نشر التوكنات", "إدارة الشبكات", "التوزيع الجماعي"],
  auditor: ["قراءة سجلات التدقيق", "قراءة التقارير"],
  viewer: ["قراءة محدودة للوحة التحكم"],
};

const initial: User[] = [
  { id: 1, name: "أحمد العامودي", email: "ahmed@nawah.io", role: "super_admin", status: "active", lastSeen: "الآن", joinedAt: "2025-11-01" },
  { id: 2, name: "سارة المطيري", email: "sarah@nawah.io", role: "operations_manager", status: "active", lastSeen: "منذ 5 دقائق", joinedAt: "2025-11-15" },
  { id: 3, name: "محمد الزهراني", email: "mohammed@nawah.io", role: "auditor", status: "active", lastSeen: "أمس", joinedAt: "2026-01-10" },
  { id: 4, name: "نورة الحارثي", email: "noura@nawah.io", role: "viewer", status: "active", lastSeen: "منذ 3 أيام", joinedAt: "2026-02-20" },
  { id: 5, name: "خالد الدوسري", email: "khaled@nawah.io", role: "finance_manager", status: "disabled", lastSeen: "منذ أسبوع", joinedAt: "2026-03-05" },
];

export function Users() {
  const [users, setUsers] = useState<User[]>(initial);
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "viewer" as UserRole });
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite.email || !invite.name) { toast.error("يرجى تعبئة جميع الحقول"); return; }
    setSending(true);
    setTimeout(() => {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: invite.name, email: invite.email, role: invite.role,
        status: "active", lastSeen: "لم يسجل دخول بعد", joinedAt: new Date().toISOString().split("T")[0],
      };
      setUsers((u) => [...u, newUser]);
      toast.success(`تم إرسال دعوة إلى ${invite.email}`);
      setOpen(false);
      setSending(false);
      setInvite({ name: "", email: "", role: "viewer" });
    }, 900);
  };

  const toggleStatus = (u: User) => {
    setUsers((all) => all.map((x) => x.id === u.id ? { ...x, status: x.status === "active" ? "disabled" : "active" } : x));
    if (selected?.id === u.id) setSelected((s) => s ? { ...s, status: s.status === "active" ? "disabled" : "active" } : null);
    toast.success(u.status === "active" ? `تم تعطيل ${u.name}` : `تم تفعيل ${u.name}`);
  };

  const changeRole = (u: User, role: UserRole) => {
    setUsers((all) => all.map((x) => x.id === u.id ? { ...x, role } : x));
    if (selected?.id === u.id) setSelected((s) => s ? { ...s, role } : null);
    toast.success(`تم تغيير دور ${u.name} إلى ${roleLabel[role]}`);
    setOpenMenu(null);
  };

  const remove = (u: User) => {
    setUsers((all) => all.filter((x) => x.id !== u.id));
    if (selected?.id === u.id) setSelected(null);
    toast.success(`تم إزالة ${u.name}`);
    setOpenMenu(null);
  };

  return (
    <>
      <PageHeader
        title="إدارة المستخدمين"
        subtitle="تحكم في أعضاء الفريق وصلاحياتهم RBAC."
        action={
          <button onClick={() => setOpen(true)} className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
            <Plus className="size-4" strokeWidth={2.5} /> دعوة عضو
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-enter">
        {[{ l: "إجمالي المستخدمين", v: String(users.length) }, { l: "مستخدمون نشطون", v: String(users.filter((u) => u.status === "active").length) }, { l: "الأدوار المتاحة", v: "5" }].map((s) => (
          <div key={s.l} className="border border-border p-6 rounded-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{s.l}</p>
            <p className="text-3xl font-bold ltr font-mono">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-enter [animation-delay:150ms]">
        <div className="lg:col-span-2">
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-right">
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/40">
                  <th className="p-4 text-right font-semibold">المستخدم</th>
                  <th className="p-4 text-right font-semibold">الدور</th>
                  <th className="p-4 text-right font-semibold">الحالة</th>
                  <th className="p-4 text-right font-semibold">آخر نشاط</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} onClick={() => setSelected(u)} className={`cursor-pointer hover:bg-foreground/[0.02] transition-colors ${selected?.id === u.id ? "bg-foreground/[0.03]" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-foreground/5 rounded-full grid place-items-center text-xs font-bold shrink-0">
                          {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-xs font-mono text-muted-foreground ltr">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-sm font-semibold ${roleColor[u.role]}`}>{roleLabel[u.role]}</span>
                    </td>
                    <td className="p-4">
                      <StatusPill variant={u.status === "active" ? "active" : "failed"}>{u.status === "active" ? "نشط" : "معطل"}</StatusPill>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">{u.lastSeen}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      {/* Pure CSS dropdown — no Radix */}
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                          className="size-8 grid place-items-center text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openMenu === u.id && (
                          <>
                            <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setOpenMenu(null)} />
                            <div style={{ position: "absolute", left: 0, top: "calc(100% + 4px)", zIndex: 40, width: 200 }}
                              className="bg-popover border border-border rounded-sm shadow-xl py-1">
                              <button type="button" onClick={() => { setSelected(u); setOpenMenu(null); }}
                                className="w-full text-right px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2">
                                <Eye className="size-4" /> عرض التفاصيل
                              </button>
                              <div className="my-1 border-t border-border" />
                              {(Object.keys(roleLabel) as UserRole[]).map((r) => (
                                <button key={r} type="button" onClick={() => changeRole(u, r)}
                                  className={`w-full text-right px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 ${u.role === r ? "font-bold text-accent" : ""}`}>
                                  <Shield className="size-4 opacity-60" /> {roleLabel[r]}{u.role === r ? " ✓" : ""}
                                </button>
                              ))}
                              <div className="my-1 border-t border-border" />
                              <button type="button" onClick={() => { toggleStatus(u); setOpenMenu(null); }}
                                className="w-full text-right px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2">
                                {u.status === "active" ? <><UserX className="size-4" /> تعطيل</> : <><UserCheck className="size-4" /> تفعيل</>}
                              </button>
                              <div className="my-1 border-t border-border" />
                              <button type="button" onClick={() => remove(u)}
                                className="w-full text-right px-4 py-2.5 text-sm text-destructive hover:bg-muted flex items-center gap-2">
                                <Trash2 className="size-4" /> إزالة
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          {selected ? (
            <div className="border border-border rounded-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="size-14 bg-foreground/5 rounded-full grid place-items-center text-lg font-bold mb-3">
                    {selected.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <p className="font-bold text-lg">{selected.name}</p>
                  <p className="text-xs font-mono text-muted-foreground ltr">{selected.email}</p>
                </div>
                <StatusPill variant={selected.status === "active" ? "active" : "failed"}>
                  {selected.status === "active" ? "نشط" : "معطل"}
                </StatusPill>
              </div>
              <div className="pt-4 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الدور</span>
                  <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${roleColor[selected.role]}`}>{roleLabel[selected.role]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاريخ الانضمام</span>
                  <span className="font-mono text-xs ltr">{selected.joinedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">آخر دخول</span>
                  <span className="text-xs">{selected.lastSeen}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">الصلاحيات</p>
                <ul className="space-y-2">
                  {rolePermissions[selected.role].map((p) => (
                    <li key={p} className="text-xs flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-success shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => toggleStatus(selected)}
                className={`w-full py-2.5 text-sm font-bold rounded-sm transition-colors ${selected.status === "active" ? "border border-destructive text-destructive hover:bg-destructive/10" : "bg-success/15 text-success hover:bg-success/25"}`}
              >
                {selected.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-sm p-8 text-center">
              <Shield className="size-8 mx-auto mb-3 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm font-semibold mb-1">تفاصيل المستخدم</p>
              <p className="text-xs text-muted-foreground">انقر على مستخدم لعرض تفاصيله</p>
            </div>
          )}
          <div className="border border-border rounded-sm p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">الأدوار المتاحة</p>
            <div className="space-y-2">
              {(Object.entries(roleLabel) as [UserRole, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${roleColor[key]}`}>{label}</span>
                  <span className="text-xs text-muted-foreground">{users.filter((u) => u.role === key).length} مستخدمين</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => { if (!sending) setOpen(false); }}
        title={<span className="flex items-center gap-3"><Mail className="size-5" /> دعوة عضو جديد</span>}
        description="سيصل رابط دعوة آمن إلى البريد المُدخل.">
        <form onSubmit={sendInvite} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold mb-2 block">الاسم الكامل</span>
            <input required value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="أحمد محمد العمري"
              className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold mb-2 block">البريد الإلكتروني المؤسسي</span>
            <input required type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="name@company.com" dir="ltr"
              className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground font-mono text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold mb-2 block">الدور</span>
            <select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value as UserRole })}
              className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground">
              {(Object.entries(roleLabel) as [UserRole, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="mt-2 p-3 bg-muted/50 rounded-sm">
              <ul className="space-y-1">
                {rolePermissions[invite.role].map((p) => (
                  <li key={p} className="text-xs flex items-center gap-2"><span className="size-1.5 rounded-full bg-success shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted">إلغاء</button>
            <button type="submit" disabled={sending} className="flex-1 py-3 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {sending ? <><Loader2 className="size-4 animate-spin" /> جارٍ الإرسال...</> : <><Mail className="size-4" /> إرسال الدعوة</>}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
