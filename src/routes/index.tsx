import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupModal, type UserRole } from "@/components/SignupModal";
import { User, Users, ClipboardCheck, FileText, Pill, MessageCircle, Zap, Lock } from "lucide-react";
import logoImage from "@/assets/logo-new.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Care Circle Global — Care Coordination & Navigation Hub" },
      { name: "description", content: "Organize health records, coordinate your care team, and stay ahead of crises. HIPAA-grade coordination for patients, families, and care coordinators." },
      { property: "og:title", content: "Care Circle Global — Care Coordination & Navigation Hub" },
      { property: "og:description", content: "Organize health records, coordinate your care team, and stay ahead of crises. HIPAA-grade coordination for patients, families, and care coordinators." },
      { property: "og:url", content: "https://carecircleglobal.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://carecircleglobal.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Care Circle Global",
          url: "https://carecircleglobal.com/",
          logo: "https://carecircleglobal.com/favicon.png",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Care Circle Global",
          url: "https://carecircleglobal.com/",
        }),
      },
    ],
  }),
  component: Index,
});

const problems = [
  { icon: FileText, text: "Health records scattered across WhatsApp, PDFs, and clinic folders" },
  { icon: Pill, text: "Nobody has the full picture of what medications are active" },
  { icon: MessageCircle, text: "Coordination happens in group chats - things get missed" },
  { icon: Zap, text: "Crises appear without warning because nobody is watching" },
];

const steps = [
  { num: "01", title: "On-board", desc: "Sign up and add your prescriptions, lab results, images, notes, or your voice memos." },
  { num: "02", title: "Organize", desc: "We build a single, up-to-date health profile so every provider, family member, and coordinator sees the same complete picture - no more scattered files." },
  { num: "03", title: "Auto-Monitor", desc: "Smart alerts flag missed appointments, skipped medications, drug interactions, overdue labs, and care gaps before they become emergencies." },
  { num: "04", title: "Coordinate", desc: "Your care team receives assigned tasks, real-time notifications, and daily briefings - so everyone stays aligned and nothing falls through the cracks." },
];

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedRole, setPreSelectedRole] = useState<NonNullable<UserRole> | null>(null);

  const [heroRole, setHeroRole] = useState("");
  const [heroFirstName, setHeroFirstName] = useState("");
  const [heroLastName, setHeroLastName] = useState("");
  const [heroEmail, setHeroEmail] = useState("");
  const [heroPassword, setHeroPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleHeroSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!heroRole) return;
    setSignupLoading(true);
    setSignupError("");

    const { error } = await supabase.auth.signUp({
      email: heroEmail,
      password: heroPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/complete-profile`,
        data: {
          first_name: heroFirstName,
          last_name: heroLastName,
          role: heroRole,
        },
      },
    });

    if (error) {
      setSignupError(error.message);
    } else {
      setSignupSuccess(true);
    }
    setSignupLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 pt-4 pb-2 md:h-20 md:pt-4 md:pb-0 flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-2 shrink-0">
             <div className="flex flex-col justify-between" style={{ fontFamily: "var(--font-display)" }}>
               <span className="text-[1.15rem] font-bold leading-none">
                <span style={{ color: "#1B365D" }}>Care </span>
                 <span style={{ color: "#1B365D" }}>Circle</span>
              </span>
               <span className="text-[1.15rem] font-bold leading-none" style={{ color: "#1B365D" }}>Global</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login" className="flex-1 md:flex-none">
              <Button variant="heroGhost" size="default" className="w-full md:w-auto md:h-14 md:px-10 md:text-base md:rounded-xl">Log In</Button>
            </Link>
            <Button variant="hero" size="default" className="flex-1 md:flex-none md:h-14 md:px-10 md:text-base md:rounded-xl" onClick={() => setModalOpen(true)}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-16 md:pt-36 md:pb-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-300 text-black text-sm font-medium mb-4 italic">
              <span className="animate-pulse">★</span>
              Now accepting early access signups
            </div>
            <h1 className="text-4xl md:text-[3.5rem] lg:text-6xl font-bold text-black leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Care Coordination<br />and Navigation Hub
            </h1>
            <p className="mt-6 text-lg md:text-xl text-black max-w-lg leading-tight">
              Know what's happening and what to do next - <span className="font-semibold">get and equip your care coordination team.</span>
            </p>
            <Button
              variant="heroGhost"
              size="xl"
              className="mt-6"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How it Works
            </Button>
          </div>
          <div className="flex justify-center">
            <form onSubmit={handleHeroSubmit} className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border/50 p-6 md:p-8">
              <h2 className="text-lg font-bold text-foreground mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Get Started
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="hero-role" className="block text-sm font-semibold text-foreground mb-1.5">I am signing up as<span className="text-destructive">*</span></label>
                  <select
                    id="hero-role"
                    value={heroRole}
                    onChange={(e) => setHeroRole(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-lg border-[1.5px] border-gray-300 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  >
                    <option value="">Select...</option>
                    <option value="patient">A Patient</option>
                    <option value="family">A Family Member</option>
                    <option value="professional">A Care Coordinator</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="hero-first-name" className="block text-sm font-semibold text-foreground mb-1.5">First Name<span className="text-destructive">*</span></label>
                    <input
                      id="hero-first-name"
                      type="text"
                      value={heroFirstName}
                      onChange={(e) => setHeroFirstName(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-lg border-[1.5px] border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-last-name" className="block text-sm font-semibold text-foreground mb-1.5">Last Name<span className="text-destructive">*</span></label>
                    <input
                      id="hero-last-name"
                      type="text"
                      value={heroLastName}
                      onChange={(e) => setHeroLastName(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-lg border-[1.5px] border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-email" className="block text-sm font-semibold text-foreground mb-1.5">Email<span className="text-destructive">*</span></label>
                  <input
                    id="hero-email"
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-lg border-[1.5px] border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="hero-password" className="block text-sm font-semibold text-foreground mb-1.5">Password<span className="text-destructive">*</span></label>
                  <input
                    id="hero-password"
                    type="password"
                    value={heroPassword}
                    onChange={(e) => setHeroPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full h-12 px-4 rounded-lg border-[1.5px] border-gray-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="Min 8 characters"
                  />
                </div>

                {signupError && (
                  <p className="text-sm text-destructive">{signupError}</p>
                )}

                {signupSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800 font-semibold">Check your email!</p>
                    <p className="text-green-700 text-sm mt-1">We sent a verification link to <strong>{heroEmail}</strong>. Click it to continue setting up your profile.</p>
                  </div>
                ) : (
                <Button type="submit" variant="hero" size="xl" className="w-full">
                  {signupLoading ? "Creating account…" : "Get Started"}
                </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                <span>All information you share is secure and HIPAA-compliant</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Sign Up
          </h2>
          <p className="text-center text-black text-lg mb-14 max-w-xl mx-auto">Whether you're a patient, a family member, or a care coordinator - start in under 2 minutes.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Patient */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <User className="w-8 h-8 text-primary" strokeWidth={1.75} />
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">The Patient</h3>
                <p className="text-black mb-6 leading-relaxed">Set up care for myself and keep my health records organized in one place.</p>
              <Button variant="hero" size="xl" className="w-full" onClick={() => { setPreSelectedRole("patient"); setModalOpen(true); }}>Sign Up as a Patient</Button>
            </div>
            {/* Family */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <Users className="w-8 h-8 text-primary" strokeWidth={1.75} />
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">A Family</h3>
                <p className="text-black mb-6 leading-relaxed">Coordinate care for a parent or loved one - even from a distance.</p>
              <Button variant="hero" size="xl" className="w-full" onClick={() => { setPreSelectedRole("family"); setModalOpen(true); }}>Sign Up as a Family</Button>
            </div>
            {/* Professional */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <div className="relative w-8 h-8">
                   <User className="absolute left-0 top-0 w-5 h-5 text-primary" strokeWidth={1.75} />
                   <ClipboardCheck className="absolute right-1 bottom-0 w-5 h-5 text-primary" strokeWidth={1.75} />
                 </div>
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">A Care Coordinator</h3>
               <p className="text-black mb-6 leading-relaxed">Register as a nurse, navigator or care coordinator and join our coordinator network.</p>
              <Button variant="hero" size="xl" className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white" onClick={() => { setPreSelectedRole("professional"); setModalOpen(true); }}>Sign Up as a Coordinator</Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            How it works
          </h2>
          <p className="text-center text-black mb-14 max-w-xl mx-auto">Four simple steps to start your care team.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{s.num}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28 px-6 bg-muted/40">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-[#3B82F6] text-sm font-medium mb-8 italic">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.163 5.279L15 5.979L11.5 9.221L12.326 14L8 11.779L3.674 14L4.5 9.221L1 5.979L5.837 5.279L8 1Z" fill="currentColor"/></svg>
              HIPAA-grade privacy controls
            </div>
             <blockquote className="text-xl md:text-2xl text-black font-medium leading-relaxed italic max-w-2xl mx-auto">
              "Finally, one place where I can see everything about my mother's care - even from 3,000 miles away."
            </blockquote>
             <p className="mt-4 text-black">- Early beta participant</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div>
           <h2 className="text-3xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to bring care together?
            </h2>
             <p className="text-xl md:text-2xl text-black mb-10 max-w-xl mx-auto">
              Whether you're a patient, a family member, or a care coordinator - start in under 2 minutes.
            </p>
            <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started</Button>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 px-6 bg-muted/40">
        <div className="max-w-5xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Sound familiar?
          </h2>
           <p className="text-center text-black mb-14 max-w-xl mx-auto">Families dealing with chronic or complex care face these problems every day.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow">
                <p.icon className="w-6 h-6 text-primary flex-shrink-0" strokeWidth={2} />
                <p className="text-black leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2026 Care Circle Global. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <SignupModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setPreSelectedRole(null); }} initialRole={preSelectedRole} />
    </div>
  );
}
