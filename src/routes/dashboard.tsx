import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ccLogoIcon from "@/assets/cc-logo-icon.png";
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
  { id: "lata",   label: "Lata",      sub: "Caregiver · onsite",       angle: 270, alert: false, alertCount: 0, icon: Users,        alertDetails: [] as { title: string; why: string; action: string }[] },
  { id: "iyer",   label: "Dr Iyer",   sub: "Eyes · overdue",           angle: 315, alert: true,  alertCount: 1, icon: Stethoscope,  alertDetails: [{ title: "Eye check overdue", why: "Annual review with Dr Iyer pending.", action: "Schedule" }] },
  { id: "log",    label: "Daily log", sub: "Last: 4 PM",               angle: 0,   alert: false, alertCount: 0, icon: ClipboardList, alertDetails: [] },
  { id: "vitals", label: "Vitals",    sub: "BP ↑ glucose ↑",           angle: 45,  alert: true,  alertCount: 2, icon: Activity,     alertDetails: [
    { title: "BP elevated 3 days in a row", why: "Average 158/96, above goal of 130/80. Increases stroke risk.", action: "Call Dr Khanna" },
    { title: "Glucose trending up", why: "Fasting glucose rose 12% over last week.", action: "Review diet" },
  ] },
  { id: "meds",   label: "Meds",      sub: "5 active · 1 low",         angle: 90,  alert: true,  alertCount: 1, icon: Pill,         alertDetails: [{ title: "Telmisartan running low", why: "5 days remaining. Refill takes 2–3 days locally.", action: "Order refill" }] },
  { id: "khanna", label: "Dr Khanna", sub: "Cardio · Thu",             angle: 135, alert: false, alertCount: 0, icon: Stethoscope,  alertDetails: [] },
  { id: "labs",   label: "Labs",      sub: "HbA1c overdue",            angle: 180, alert: true,  alertCount: 1, icon: FlaskConical, alertDetails: [{ title: "HbA1c lab overdue", why: "Last test was 4 months ago. Quarterly tracking recommended.", action: "Book lab" }] },
  { id: "appts",  label: "Appts",     sub: "2 upcoming · 1 overdue",   angle: 225, alert: true,  alertCount: 1, icon: Calendar,     alertDetails: [{ title: "1 appointment overdue", why: "Annual eye check with Dr Iyer is past due.", action: "Reschedule" }] },
];

/* ----------------- component ----------------- */
function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [focusedNode, setFocusedNode] = useState<string | null>("vitals");
  const [circleFilter, setCircleFilter] = useState<"All" | "People" | "Domains" | "Risks">("All");
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi — I can explain what's happening with Rajesh. Try: 'What changed this week?'" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");
  const [dismissedCritical, setDismissedCritical] = useState<number[]>([]);

  const menuItems = useMemo(() => ([
    { id: "snapshot",  label: "Snapshot",       icon: LayoutDashboard },
    { id: "intake",    label: "Info intake",    icon: Upload },
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
    const ids = ["snapshot","intake","alerts","circle","today","tasks","documents","briefing","assistant"];
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

  const critical = alerts.filter(a => a.level === "critical" && !dismissedCritical.includes(a.id));

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.003_180)] pb-24 md:pb-8 text-[15px] md:text-[16px] leading-relaxed text-foreground">
      {/* top bar */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="lg:hidden -ml-2" onClick={() => setMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src={ccLogoIcon} alt="Care Circle" className="w-8 h-8 md:hidden" />
              <div className="hidden md:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">cc</span>
                </div>
                <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Care Circle</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">{firstName || userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="italic text-orange-600 hover:text-orange-700"><LogOut className="w-4 h-4 mr-1" />Sign out</Button>
          </div>
        </div>
      </header>

      {/* critical banner — sticky, dismissible */}
      {critical.length > 0 && (
        <div className="sticky top-14 z-20 shadow-md">
          {critical.map(c => (
            <div key={c.id} className="bg-red-600 text-white">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{c.title}.</span>
                <span className="opacity-90 hidden md:inline">{c.why}</span>
                <Button size="sm" variant="secondary" className="ml-auto h-7 text-red-700">{c.action}</Button>
                <button
                  aria-label="Dismiss alert"
                  onClick={() => setDismissedCritical(d => [...d, c.id])}
                  className="ml-1 rounded p-1 hover:bg-white/15"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  {patient.age} · {patient.city} · <em className="italic">Updated {patient.lastUpdated}…</em>
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <Stat icon={Pill} label="Medications" value={patient.medications} />
                  <Stat icon={Calendar} label="Appointments" value={patient.appointments} />
                  <Stat icon={ClipboardList} label="Pending tasks" value={patient.pendingTasks} />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Button size="sm" variant="ghost" className="italic">Open full profile <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>

          {/* Info Intake */}
          <div id="sec-intake" className="scroll-mt-20 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />Info intake
              </h2>
              <span className="text-xs text-muted-foreground">Add updates & documents</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Capture new updates about Rajesh — upload a lab report, write a quick note, or record a voice update from the caregiver.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-start gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Upload className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Upload document</span>
                <span className="text-xs text-muted-foreground">Labs, prescriptions, scans (PDF/JPG)</span>
              </button>
              <button className="flex flex-col items-start gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Add note</span>
                <span className="text-xs text-muted-foreground">Symptoms, observations, questions</span>
              </button>
              <button className="flex flex-col items-start gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Mic className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm flex items-center gap-2">
                  Voice note
                  <span className="italic text-[11px] font-normal text-muted-foreground">Coming soon</span>
                </span>
                <span className="text-xs text-muted-foreground">Quick caregiver update</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" />
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
                {(["People","Domains","Risks"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setCircleFilter(f)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      circleFilter === f
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <CircleViz focused={focusedNode} setFocused={setFocusedNode} filter={circleFilter} />
            <div className="mt-4 rounded-xl px-4 py-3 text-sm flex flex-wrap items-center gap-3 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border border-orange-200 shadow-sm">
              <span className="font-semibold text-orange-700">Focused — Vitals:</span>
              <span className="font-semibold text-foreground/90">BP 158/96 · 3-day avg above goal</span>
              <Button size="sm" variant="ghost" className="ml-auto h-7 font-semibold text-orange-700 hover:bg-orange-200/60">Open detail <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
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
                {briefing.map((b, i) => {
                  const parts = b.split(/(Status:|Overdue:|Next 48h:|Active risks:)/g);
                  const colorFor = (kw: string) =>
                    kw === "Status:"      ? "text-amber-600 font-semibold" :
                    kw === "Overdue:"     ? "text-red-600 font-semibold"   :
                    kw === "Next 48h:"    ? "text-blue-600 font-semibold"  :
                    kw === "Active risks:"? "text-orange-600 font-semibold": "";
                  return (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      <span>
                        {parts.map((p, j) => {
                          const cls = colorFor(p);
                          return cls
                            ? <span key={j} className={cls}>{p}</span>
                            : <span key={j}>{p}</span>;
                        })}
                      </span>
                    </li>
                  );
                })}
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
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-black text-white border-t border-black/40 shadow-lg">
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
    <div className="flex items-center gap-1.5 text-blue-600">
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function MenuList({
  items, active, onSelect,
}: {
  items: { id: string; label: string; icon: any; badge?: number }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/80 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 truncate">{it.label}</span>
            {it.badge ? (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {it.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
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

function CircleViz({ focused, setFocused, filter }: { focused: string | null; setFocused: (id: string | null) => void; filter: "All" | "People" | "Domains" | "Risks" }) {
  const [popup, setPopup] = useState<{ id: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = 520;
  const cx = size / 2, cy = size / 2;
  const r = 180;
  const nodeR = 34;
  const ink = "oklch(0.35 0.04 240)";
  const peopleIds = ["lata", "iyer", "khanna"];
  const domainIds = ["vitals", "meds", "labs", "appts", "log"];
  const visibleNodes = circleNodes.filter(n =>
    filter === "All"     ? true :
    filter === "People"  ? peopleIds.includes(n.id) :
    filter === "Domains" ? domainIds.includes(n.id) :
    /* Risks */            n.alert
  );
  // re-distribute angles evenly around the circle for visible subset
  const nodes = visibleNodes.map((n, i) => ({
    ...n,
    angle: (i * 360) / visibleNodes.length - 90,
  }));
  const popupNode = popup ? nodes.find(n => n.id === popup.id) : null;
  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xl mx-auto h-auto">
        {/* outer hand-drawn ring */}
        <circle cx={cx} cy={cy} r={r + nodeR + 14} fill="none" stroke={ink} strokeWidth={1} strokeDasharray="2 6" opacity={0.25} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={1.25} opacity={0.55} />

        {/* spokes from center to each node (sketch-style solid lines) */}
        {nodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          // start at edge of center, end at edge of node
          const centerR = 56;
          const sx = cx + centerR * Math.cos(rad);
          const sy = cy + centerR * Math.sin(rad);
          const ex = x - nodeR * Math.cos(rad);
          const ey = y - nodeR * Math.sin(rad);
          return (
            <line
              key={`spoke-${n.id}`}
              x1={sx} y1={sy} x2={ex} y2={ey}
              stroke={ink}
              strokeWidth={1.4}
              opacity={0.55}
              strokeLinecap="round"
            />
          );
        })}

        {/* center patient */}
        <g>
          <circle cx={cx} cy={cy} r={56} fill="oklch(0.98 0.015 80)" stroke={ink} strokeWidth={1.6} />
          <circle cx={cx} cy={cy} r={50} fill="none" stroke={ink} strokeWidth={0.8} opacity={0.4} />
          <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 16, fontWeight: 700 }}>Rajesh</text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>72 · Lucknow</text>
        </g>

        {/* nodes */}
        {nodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          const isFocused = focused === n.id;
          const isVitals = n.id === "vitals";
          const isHoverBlue = isFocused && !isVitals;
          // label position outside node along radius
          const labelDist = nodeR + 14;
          const lx = x + labelDist * Math.cos(rad);
          const ly = y + labelDist * Math.sin(rad);
          // text anchor based on angle
          let anchor: "start" | "middle" | "end" = "middle";
          const cosA = Math.cos(rad);
          if (cosA > 0.3) anchor = "start";
          else if (cosA < -0.3) anchor = "end";
          // sub line below label
          const subDy = 12;
          return (
            <g key={n.id} style={{ cursor: "pointer" }} onClick={() => setFocused(n.id)} onMouseEnter={() => setFocused(n.id)}>
              {/* node circle */}
              <circle cx={x} cy={y} r={isFocused ? nodeR + 3 : nodeR}
                fill={
                  isVitals ? "oklch(0.78 0.14 70)"
                  : isHoverBlue ? "oklch(0.72 0.13 240)"
                  : n.alert ? "oklch(0.97 0.04 30)"
                  : "oklch(0.985 0.005 200)"
                }
                stroke={
                  isVitals ? "oklch(0.55 0.16 60)"
                  : isHoverBlue ? "oklch(0.45 0.18 240)"
                  : ink
                }
                strokeWidth={isFocused ? 2 : 1.4} />
              {/* icon inside node — draw via foreignObject for lucide */}
              <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, color: (isVitals || isHoverBlue) ? "white" : n.alert ? "oklch(0.55 0.18 30)" : "oklch(0.45 0.04 240)" }}>
                  <n.icon width={20} height={20} />
                </div>
              </foreignObject>

              {/* red alert badge with count */}
              {n.alert && n.alertCount > 0 && (
                <g
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const rect = containerRef.current?.getBoundingClientRect();
                    const svg = (e.currentTarget.ownerSVGElement) as SVGSVGElement | null;
                    if (!svg || !rect) return;
                    const ctm = svg.getScreenCTM();
                    if (!ctm) return;
                    const pt = svg.createSVGPoint();
                    pt.x = x + nodeR - 6;
                    pt.y = y - nodeR + 6;
                    const screen = pt.matrixTransform(ctm);
                    setPopup({ id: n.id, x: screen.x - rect.left, y: screen.y - rect.top });
                  }}
                  onMouseLeave={() => setPopup(p => (p?.id === n.id ? null : p))}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = containerRef.current?.getBoundingClientRect();
                    const svg = (e.currentTarget.ownerSVGElement) as SVGSVGElement | null;
                    if (!svg || !rect) return;
                    const ctm = svg.getScreenCTM();
                    if (!ctm) return;
                    const pt = svg.createSVGPoint();
                    pt.x = x + nodeR - 6;
                    pt.y = y - nodeR + 6;
                    const screen = pt.matrixTransform(ctm);
                    setPopup({ id: n.id, x: screen.x - rect.left, y: screen.y - rect.top });
                  }}
                >
                  {/* invisible larger hit area */}
                  <circle cx={x + nodeR - 6} cy={y - nodeR + 6} r={16} fill="transparent" />
                  <circle cx={x + nodeR - 6} cy={y - nodeR + 6} r={10}
                    fill="oklch(0.58 0.22 25)" stroke="white" strokeWidth={1.5} />
                  <text x={x + nodeR - 6} y={y - nodeR + 10} textAnchor="middle"
                    fill="white" style={{ fontSize: 11, fontWeight: 700 }}>{n.alertCount}</text>
                </g>
              )}

              {/* label outside */}
              <text x={lx} y={ly} textAnchor={anchor} className="fill-foreground" style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</text>
              <text x={lx} y={ly + subDy} textAnchor={anchor} className="fill-muted-foreground" style={{ fontSize: 11 }}>
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

      {popupNode && popup && (
        <div
          className="absolute z-30 w-64 bg-card border border-border rounded-xl shadow-lg p-3 text-sm"
          style={{
            left: Math.max(8, Math.min(popup.x - 128, (containerRef.current?.clientWidth ?? 600) - 264)),
            top: popup.y + 14,
          }}
          onMouseEnter={() => { /* keep open */ }}
          onMouseLeave={() => setPopup(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {popupNode.alertCount}
            </span>
            <span className="font-semibold">{popupNode.label} alerts</span>
            <button
              className="ml-auto text-muted-foreground hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); setPopup(null); }}
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-2">
            {popupNode.alertDetails.map((d, i) => (
              <li key={i} className="border-l-2 border-red-500 pl-2">
                <p className="font-medium text-[13px]">{d.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.why}</p>
                <button className="mt-1.5 text-xs font-medium text-primary hover:underline">{d.action} →</button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
    <button className="flex flex-col items-center justify-center py-2.5 gap-1 text-white/80 hover:text-white active:bg-white/10">
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
