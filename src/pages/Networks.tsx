import { useState } from "react";
import { PageHeader } from "@/components/Primitives";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2, WifiOff, Edit2, Check, Wifi } from "lucide-react";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

type NetStatus = "active" | "inactive" | "testing";
interface Network {
  id: number;
  name: string;
  chainId: string;
  rpc: string;
  currency: string;
  explorer: string;
  status: NetStatus;
  latency?: number;
  block?: number;
}

const initial: Network[] = [
  { id: 1, name: "Ethereum Mainnet", chainId: "1", rpc: "https://mainnet.infura.io/v3/demo", currency: "ETH", explorer: "https://etherscan.io", status: "active", latency: 98, block: 19_800_012 },
  { id: 2, name: "Polygon", chainId: "137", rpc: "https://polygon-rpc.com", currency: "MATIC", explorer: "https://polygonscan.com", status: "active", latency: 62, block: 55_211_004 },
  { id: 3, name: "Arbitrum One", chainId: "42161", rpc: "https://arb1.arbitrum.io/rpc", currency: "ETH", explorer: "https://arbiscan.io", status: "active", latency: 45, block: 201_887_331 },
  { id: 4, name: "BNB Chain", chainId: "56", rpc: "https://bsc-dataseed.binance.org", currency: "BNB", explorer: "https://bscscan.com", status: "inactive" },
  { id: 5, name: "Optimism", chainId: "10", rpc: "https://mainnet.optimism.io", currency: "ETH", explorer: "https://optimistic.etherscan.io", status: "inactive" },
];

const emptyForm = { name: "", chainId: "", rpc: "", currency: "", explorer: "" };

export function Networks() {
  const [nets, setNets] = useState<Network[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Network | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [testId, setTestId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (n: Network) => {
    setEditing(n);
    setForm({ name: n.name, chainId: n.chainId, rpc: n.rpc, currency: n.currency, explorer: n.explorer });
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.rpc || !form.chainId || !form.currency) { toast.error("يرجى تعبئة الحقول المطلوبة"); return; }
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        setNets((all) => all.map((n) => n.id === editing.id ? { ...n, ...form } : n));
        toast.success("تم تحديث الشبكة بنجاح");
      } else {
        const id = Math.max(...nets.map((n) => n.id)) + 1;
        setNets((all) => [...all, { id, ...form, status: "inactive" }]);
        toast.success("تمت إضافة الشبكة بنجاح");
      }
      setOpen(false);
      setSaving(false);
    }, 700);
  };

  const testConn = (n: Network) => {
    setTestId(n.id);
    setNets((all) => all.map((x) => x.id === n.id ? { ...x, status: "testing" } : x));
    setTimeout(() => {
      const ok = Math.random() > 0.2;
      const latency = Math.floor(Math.random() * 120) + 30;
      const block = Math.floor(Math.random() * 50_000_000) + 18_000_000;
      setNets((all) => all.map((x) => x.id === n.id
        ? { ...x, status: ok ? "active" : "inactive", latency: ok ? latency : undefined, block: ok ? block : undefined }
        : x));
      setTestId(null);
      ok ? toast.success(`الاتصال بـ ${n.name} ناجح — ${latency}ms`) : toast.error(`فشل الاتصال بـ ${n.name}`);
    }, 1800);
  };

  const toggle = (n: Network) => {
    setNets((all) => all.map((x) => x.id === n.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
    toast.success(n.status === "active" ? `تم تعطيل ${n.name}` : `تم تفعيل ${n.name}`);
  };

  const remove = (n: Network) => { setNets((all) => all.filter((x) => x.id !== n.id)); toast.success(`تم حذف ${n.name}`); };

  const active = nets.filter((n) => n.status === "active").length;
  const avgLatency = nets.filter((n) => n.latency).reduce((a, n) => a + (n.latency ?? 0), 0) / (nets.filter((n) => n.latency).length || 1);

  return (
    <>
      <PageHeader
        title="إعدادات الشبكات"
        subtitle="إدارة اتصالات EVM Networks والـ RPC endpoints المؤسسية."
        action={
          <button onClick={openAdd} className="px-5 py-2.5 bg-foreground text-background font-bold text-sm rounded-sm inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors">
            <Plus className="size-4" strokeWidth={2.5} /> إضافة شبكة
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-enter">
        {[{ l: "إجمالي الشبكات", v: String(nets.length) }, { l: "شبكات نشطة", v: String(active) }, { l: "متوسط زمن الاستجابة", v: `${Math.round(avgLatency)} ms` }].map((s) => (
          <div key={s.l} className="border border-border p-6 rounded-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{s.l}</p>
            <p className="text-3xl font-bold ltr font-mono">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 animate-enter [animation-delay:150ms]">
        {nets.map((n) => (
          <div key={n.id} className="border border-border rounded-sm p-5 sm:p-6 flex flex-wrap gap-4 items-center justify-between hover:border-foreground/30 transition-colors">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`mt-1 size-2.5 rounded-full shrink-0 ${n.status === "active" ? "bg-success animate-pulse" : n.status === "testing" ? "bg-warning animate-pulse" : "bg-border"}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <p className="font-bold">{n.name}</p>
                  <span className="text-xs font-mono text-muted-foreground ltr bg-muted px-2 py-0.5 rounded-sm">Chain ID: {n.chainId}</span>
                  <span className="text-xs font-mono text-muted-foreground ltr">{n.currency}</span>
                </div>
                <code className="text-xs font-mono text-muted-foreground ltr truncate block">{n.rpc}</code>
                {n.latency && n.status === "active" && (
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-mono text-success ltr">{n.latency}ms</span>
                    <span className="text-xs font-mono text-muted-foreground ltr">Block #{n.block?.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => testConn(n)} disabled={testId === n.id || n.status === "testing"}
                className="px-3 py-1.5 text-xs font-semibold border border-border rounded-sm hover:bg-muted transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
                {testId === n.id ? <Loader2 className="size-3 animate-spin" /> : <Wifi className="size-3" />}
                {testId === n.id ? "جارٍ الفحص..." : "اختبار الاتصال"}
              </button>
              <button onClick={() => openEdit(n)} className="px-3 py-1.5 text-xs font-semibold border border-border rounded-sm hover:bg-muted transition-colors inline-flex items-center gap-1.5">
                <Edit2 className="size-3" /> تعديل
              </button>
              <button onClick={() => toggle(n)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors inline-flex items-center gap-1.5 ${n.status === "active" ? "bg-success/10 text-success hover:bg-success/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {n.status === "active" ? <><CheckCircle2 className="size-3" /> نشط</> : <><XCircle className="size-3" /> معطل</>}
              </button>
              <button onClick={() => remove(n)} className="size-8 grid place-items-center text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => { if (!saving) setOpen(false); }}
        title={<span className="flex items-center gap-3"><WifiOff className="size-5" /> {editing ? "تعديل الشبكة" : "إضافة شبكة جديدة"}</span>}
        description={editing ? "عدّل إعدادات الشبكة وبيانات RPC." : "أضف شبكة EVM جديدة للاتصال بها."}
      >
        <form onSubmit={save} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">اسم الشبكة <span className="text-destructive">*</span></span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ethereum Mainnet"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">Chain ID <span className="text-destructive">*</span></span>
              <input required value={form.chainId} onChange={(e) => setForm({ ...form, chainId: e.target.value })} placeholder="1" dir="ltr"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground font-mono text-sm" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold mb-2 block">RPC Endpoint <span className="text-destructive">*</span></span>
            <input required value={form.rpc} onChange={(e) => setForm({ ...form, rpc: e.target.value })} placeholder="https://mainnet.infura.io/v3/..." dir="ltr"
              className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground font-mono text-sm" />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">العملة الأصلية <span className="text-destructive">*</span></span>
              <input required value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="ETH" dir="ltr"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground font-mono text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">رابط المستكشف</span>
              <input value={form.explorer} onChange={(e) => setForm({ ...form, explorer: e.target.value })} placeholder="https://etherscan.io" dir="ltr"
                className="w-full bg-transparent border border-border rounded-sm px-4 py-3 outline-none focus:border-foreground font-mono text-sm" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-3 border border-border rounded-sm font-semibold hover:bg-muted">إلغاء</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-foreground text-background font-bold rounded-sm hover:bg-foreground/90 inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <><Loader2 className="size-4 animate-spin" /> جارٍ الحفظ...</> : <><Check className="size-4" />{editing ? "حفظ التغييرات" : "إضافة الشبكة"}</>}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
