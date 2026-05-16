import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload, FileText, Mic, User, Bell, Calendar, Pill, Activity,
  AlertTriangle, ChevronDown, ChevronRight, Send, Search, Plus,
  Stethoscope, FlaskConical, Users, ClipboardList, LogOut, Menu,
  LayoutDashboard, MessageSquare, X,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Care Circle Global" },
      { name: "description", content: "Coordinate your parent's care from one calm, clear view: status, alerts, medications, appointments, and tasks." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

/* ----------------- mock data (PRD: Rajesh, 72, Lucknow) ----------------- */
const patient = {
  name: "Rajesh Sharma",
  age: 72,
  city: "Lucknow",
  status: "attention" as "stable" | "attention" | "urgent",
  lastUpdated: "2h ago",
  medications: 5,
  appointments: 2,
  pendingTasks: 3,
};

const alerts = [
  { id: 1, level: "critical", title: "BP elevated 3 days in a row", why: "Average 158/96, above goal of 130/80. Increases stroke risk.", action: "Call Dr Khanna" },
  { id: 2, level: "moderate", title: "HbA1c lab overdue", why: "Last test was 4 months ago. Quarterly tracking recommended.", action: "Book lab" },
  { id: 3, level: "moderate", title: "Telmisartan running low", why: "5 days remaining. Refill takes 2–3 days locally.", action: "Order refill" },
  { id: 4, level: "info", title: "Eye check overdue", why: "Annual review with Dr Iyer pending.", action: "Schedule" },
];

const briefing = [
  "Status: Attention — BP trending up, one lab overdue.",
  "Lata logged breakfast and morning meds on time today.",
  "Active risks: elevated BP, low Telmisartan supply.",
  "Overdue: HbA1c lab, eye check with Dr Iyer.",
  "Next 48h: Cardiology teleconsult Thu 4 PM with Dr Khanna.",
];

const timeline = [
  { time: "07:30", type: "routine", row: "vitals", label: "BP 158/96" },
  { time: "08:00", type: "routine", row: "meds", label: "Breakfast + meds" },
  { time: "11:00", type: "watch", row: "vitals", label: "Head fog noted" },
  { time: "13:30", type: "routine", row: "meds", label: "Lunch logged" },
  { time: "16:00", type: "routine", row: "meds", label: "Lata voice note" },
  { time: "18:00", type: "watch", row: "vitals", label: "BP 162/98" },
  { time: "19:00", type: "risk", row: "meds", label: "Cardio prep due" },
  { time: "20:30", type: "routine", row: "meds", label: "Telmisartan" },
];

const tasks = [
  { id: 1, label: "Refill Telmisartan", due: "Today", done: false },
  { id: 2, label: "Book HbA1c lab", due: "This week", done: false },
  { id: 3, label: "Prep notes for cardio call", due: "Thu", done: false },
  { id: 4, label: "Confirm caregiver schedule", due: "Done", done: true },
];

const documents = [
  { id: 1, name: "Lipid panel — Oct.pdf", tag: "lab", date: "Oct 12" },
  { id: 2, name: "Echo report.pdf", tag: "scan", date: "Sep 28" },
  { id: 3, name: "Discharge summary.pdf", tag: "note", date: "Aug 14" },
  { id: 4, name: "Prescription — Dr Khanna.jpg", tag: "prescription", date: "Aug 02" },
];

const circleNodes = [
  { id: "lata", label: "Lata", sub: "Caregiver · onsite", angle: 270, alert: false, icon: Users },
  { id: "iyer", label: "Dr Iyer", sub: "Eyes · overdue", angle: 315, alert: true, icon: Stethoscope },
  { id: "log", label: "Daily log", sub: "Last: 4 PM", angle: 0, alert: false, icon: ClipboardList },
  { id: "vitals", label: "Vitals", sub: "BP ↑ glucose ↑", angle: 45, alert: true, icon: Activity },
  { id: "meds", label: "Meds", sub: "5 active · 1 low", angle: 90, alert: true, icon: Pill },
  { id: "khanna", label: "Dr Khanna", sub: "Cardio · Thu", angle: 135, alert: false, icon: Stethoscope },
  { id: "labs", label: "Labs", sub: "HbA1c overdue", angle: 180, alert: true, icon: FlaskConical },
  { id: "appts", label: "Appts", sub: "2 upcoming · 1 overdue", angle: 225, alert: true, icon: Calendar },
];

/* ----------------- component ----------------- */
function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [focusedNode, setFocusedNode] = useState<string | null>("vitals");
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi — I can explain what's happening with Rajesh. Try: 'What changed this week?'" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");

  const menuItems = useMemo(() => ([
    { id: "snapshot",  label: "Snapshot",       icon: LayoutDashboard },
    { id: "alerts",    label: "Alerts",         icon: Bell, badge: alerts.length },
    { id: "circle",    label: "Care circle",    icon: Users },
    { id: "today",     label: "Today",          icon: Activity },
    { id: "tasks",     label: "Tasks",          icon: ClipboardList, badge: tasks.filter(t => !t.done).length },
    { id: "documents", label: "Documents",      icon: FileText },
    { id: "briefing",  label: "Daily briefing", icon: Calendar },
    { id: "assistant", label: "Assistant",      icon: MessageSquare },
  ]), []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    setMenuOpen(false);
  };

  useEffect(() => {
    const ids = ["snapshot","alerts","circle","today","tasks","documents","briefing","assistant"];
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSection(visible[0].target.id.replace("sec-",""));
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    ids.forEach(id => { const el = document.getElementById(`sec-${id}`); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loading]);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }
      setUserEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles").select("first_name, profile_completed")
        .eq("user_id", user.id).single();
      if (profile && !profile.profile_completed) { navigate({ to: "/complete-profile" }); return; }
      setFirstName(profile?.first_name ?? "");
      setLoading(false);
    };
    check();
  }, [navigate]);

  const statusColor = useMemo(() => ({
    stable: { bg: "bg-emerald-50", dot: "bg-emerald-500", text: "text-emerald-700", label: "Stable" },
    attention: { bg: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-700", label: "Attention" },
    urgent: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700", label: "Urgent" },
  }[patient.status]), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChat((c) => [...c, { role: "user", text: q }]);
    setChatInput("");
    setTimeout(() => {
      setChat((c) => [...c, { role: "assistant", text: answerFor(q) }]);
    }, 400);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading your dashboard…</p></div>;
  }

  const critical = alerts.filter(a => a.level === "critical");

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.003_180)] pb-24 md:pb-8">
      {/* top bar */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="lg:hidden -ml-2" onClick={() => setMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">cc</span>
              </div>
              <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Care Circle</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">{firstName || userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" />Sign out</Button>
          </div>
        </div>
      </header>

      {/* critical banner */}
      {critical.map(c => (
        <div key={c.id} className="bg-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{c.title}.</span>
            <span className="opacity-90 hidden md:inline">{c.why}</span>
            <Button size="sm" variant="secondary" className="ml-auto h-7 text-red-700">{c.action}</Button>
          </div>
        </div>
      ))}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMenuOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <MenuList items={menuItems} active={activeSection} onSelect={scrollTo} />
          </aside>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6">
        {/* LEFT MENU (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Dashboard</p>
            <MenuList items={menuItems} active={activeSection} onSelect={scrollTo} />
          </div>
        </aside>

        {/* CENTER */}
        <section className="space-y-6 min-w-0">
          {/* Snapshot */}
          <div id="sec-snapshot" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{patient.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                    <span className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
                    {statusColor.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {patient.age} · {patient.city} · Updated {patient.lastUpdated}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <Stat icon={Pill} label="Medications" value={patient.medications} />
                  <Stat icon={Calendar} label="Appointments" value={patient.appointments} />
                  <Stat icon={ClipboardList} label="Pending tasks" value={patient.pendingTasks} />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-1.5" />Upload file</Button>
              <Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-1.5" />Add note</Button>
              <Button size="sm" variant="outline"><Mic className="w-4 h-4 mr-1.5" />Voice note</Button>
              <Button size="sm" variant="ghost">Open full profile <ChevronRight className="w-4 h-4 ml-1" /></Button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" />
            </div>
          </div>

          {/* Alerts */}
          <div id="sec-alerts" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-primary" />Alerts</h2>
              <span className="text-xs text-muted-foreground">{alerts.length} active</span>
            </div>
            <div className="space-y-3">
              {alerts.filter(a => a.level !== "critical").map(a => <AlertCard key={a.id} a={a} />)}
            </div>
          </div>

          {/* Circle */}
          <div id="sec-circle" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Care circle</h2>
              <div className="flex gap-1 text-xs">
                {["People","Domains","Risks"].map(f => (
                  <button key={f} className="px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">{f}</button>
                ))}
              </div>
            </div>
            <CircleViz focused={focusedNode} setFocused={setFocusedNode} />
            <div className="mt-4 bg-muted/60 rounded-xl px-4 py-3 text-sm flex flex-wrap items-center gap-3">
              <span className="font-medium">Focused — Vitals:</span>
              <span className="text-muted-foreground">BP 158/96 · 3-day avg above goal</span>
              <Button size="sm" variant="ghost" className="ml-auto h-7">Open detail <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
            </div>
          </div>

          {/* Timeline */}
          <div id="sec-today" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Today</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <button className="px-2 py-1 rounded hover:bg-muted">← Yesterday</button>
                <span className="font-medium text-foreground">Today</span>
                <button className="px-2 py-1 rounded hover:bg-muted">Tomorrow →</button>
              </div>
            </div>
            <Timeline />
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              <Legend color="bg-emerald-500" label="routine" />
              <Legend color="bg-amber-500" label="watch" />
              <Legend color="bg-red-500" label="risk" />
            </div>
          </div>

          {/* Tasks + Documents */}
          <div className="grid md:grid-cols-2 gap-6">
            <div id="sec-tasks" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Tasks</h2>
                <Button size="sm" variant="ghost" className="h-7"><Plus className="w-4 h-4" /></Button>
              </div>
              <ul className="space-y-2">
                {tasks.map(t => (
                  <li key={t.id} className="flex items-center gap-3 text-sm">
                    <input type="checkbox" defaultChecked={t.done} className="w-4 h-4 rounded border-border accent-[oklch(0.60_0.14_180)]" />
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{t.due}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div id="sec-documents" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Documents</h2>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search" className="h-7 pl-7 w-32 text-xs" />
                </div>
              </div>
              <ul className="space-y-2">
                {documents.map(d => (
                  <li key={d.id} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* RIGHT sidebar */}
        <aside className="space-y-6">
          {/* Daily briefing */}
          <div id="sec-briefing" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <button className="w-full flex items-center justify-between" onClick={() => setBriefingOpen(o => !o)}>
              <h2 className="font-semibold">Daily briefing</h2>
              <ChevronDown className={`w-4 h-4 transition-transform ${briefingOpen ? "" : "-rotate-90"}`} />
            </button>
            {briefingOpen && (
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                {briefing.map((b, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />{b}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Assistant */}
          <div id="sec-assistant" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col h-[420px]">
            <h2 className="font-semibold mb-2">Assistant</h2>
            <p className="text-xs text-muted-foreground mb-3">Explains. Does not diagnose.</p>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chat.map((m, i) => (
                <div key={i} className={`text-sm rounded-xl px-3 py-2 max-w-[90%] ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Ask about Dad…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-9"
              />
              <Button size="sm" className="h-9" onClick={handleSend}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border">
        <div className="grid grid-cols-4 text-xs">
          <BottomBtn icon={Upload} label="Upload" />
          <BottomBtn icon={FileText} label="Note" />
          <BottomBtn icon={Bell} label="Alerts" />
          <BottomBtn icon={Menu} label="Ask" />
        </div>
      </nav>
    </div>
  );
}

/* ----------------- helpers ----------------- */
function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function AlertCard({ a }: { a: typeof alerts[number] }) {
  const map = {
    moderate: "border-amber-200 bg-amber-50",
    info: "border-sky-200 bg-sky-50",
    critical: "border-red-200 bg-red-50",
  } as const;
  const dot = { moderate: "bg-amber-500", info: "bg-sky-500", critical: "bg-red-500" } as const;
  return (
    <div className={`border rounded-xl p-3 ${map[a.level as keyof typeof map]}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 w-2 h-2 rounded-full ${dot[a.level as keyof typeof dot]}`} />
        <div className="flex-1">
          <p className="font-medium text-sm">{a.title}</p>
          <p className="text-xs text-foreground/70 mt-0.5">{a.why}</p>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-card">{a.action}</Button>
      </div>
    </div>
  );
}

function CircleViz({ focused, setFocused }: { focused: string | null; setFocused: (id: string | null) => void }) {
  const size = 380;
  const cx = size / 2, cy = size / 2;
  const r = 140;
  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto h-auto">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.92 0.005 240)" strokeDasharray="3 4" />
        {/* spokes from center to each node */}
        {circleNodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <line
              key={`spoke-${n.id}`}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={n.alert ? "oklch(0.75 0.18 25)" : "oklch(0.88 0.01 200)"}
              strokeWidth={n.alert ? 1.5 : 1}
              strokeDasharray={n.alert ? "0" : "2 3"}
              opacity={0.7}
            />
          );
        })}
        {/* center */}
        <g>
          <circle cx={cx} cy={cy} r={46} fill="oklch(0.96 0.02 80)" stroke="oklch(0.85 0.08 80)" />
          <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 600 }}>Rajesh</text>
          <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>72 · Lucknow</text>
        </g>
        {circleNodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          const isFocused = focused === n.id;
          return (
            <g key={n.id} style={{ cursor: "pointer" }} onClick={() => setFocused(n.id)} onMouseEnter={() => setFocused(n.id)}>
              <circle cx={x} cy={y} r={isFocused ? 30 : 26}
                fill={n.alert ? "oklch(0.96 0.08 60)" : "oklch(0.97 0.01 200)"}
                stroke={isFocused ? "oklch(0.60 0.14 180)" : n.alert ? "oklch(0.75 0.15 50)" : "oklch(0.88 0.01 200)"}
                strokeWidth={isFocused ? 2 : 1} />
              <text x={x} y={y - 2} textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>{n.label}</text>
              <text x={x} y={y + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>
                {n.sub.split(/(\d+)/).map((tok, i) => {
                  const isNum = /^\d+$/.test(tok);
                  return (
                    <tspan key={i} fill={isNum ? "oklch(0.58 0.22 25)" : undefined} fontWeight={isNum ? 700 : undefined}>
                      {tok}
                    </tspan>
                  );
                })}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Timeline() {
  const colors = { routine: "bg-emerald-500", watch: "bg-amber-500", risk: "bg-red-500" } as const;
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7..19
  const toPct = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const min = h * 60 + m;
    const start = 7 * 60, end = 20 * 60;
    return ((min - start) / (end - start)) * 100;
  };
  const nowPct = 55; // mock "now"
  return (
    <div className="relative">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1 px-1">
        {hours.map(h => <span key={h}>{h}:00</span>)}
      </div>
      {(["vitals", "meds"] as const).map(row => (
        <div key={row} className="relative h-10 bg-muted/40 rounded-md mb-1.5">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-muted-foreground">{row}</span>
          {timeline.filter(e => e.row === row).map((e, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${toPct(e.time)}%` }}>
              <div className={`px-2 py-0.5 rounded-full text-[10px] text-white whitespace-nowrap ${colors[e.type as keyof typeof colors]}`}>{e.label}</div>
            </div>
          ))}
        </div>
      ))}
      <div className="absolute top-4 bottom-0 w-px bg-red-500/70" style={{ left: `${nowPct}%` }}>
        <span className="absolute -top-3 -translate-x-1/2 text-[9px] text-red-600 font-medium">now</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${color}`} />{label}</span>;
}

function BottomBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center py-2.5 gap-1 text-muted-foreground active:bg-muted">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function answerFor(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("medic")) return "Rajesh is on 5 active medications. Telmisartan is low (5 days left).";
  if (s.includes("alert") || s.includes("important")) return "The BP alert matters because the 3-day average is 158/96, above his 130/80 goal — this raises stroke risk.";
  if (s.includes("change") || s.includes("week")) return "This week: BP trended up, head fog noted once, HbA1c lab is now overdue.";
  if (s.includes("task") || s.includes("overdue")) return "Overdue: refill Telmisartan, book HbA1c lab, prep notes for Thu cardio call.";
  return "I can answer questions about medications, alerts, recent changes, and tasks. I won't diagnose or prescribe.";
}
