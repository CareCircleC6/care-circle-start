import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignupModal } from "@/components/SignupModal";
import { HeartPulse, Users, ClipboardCheck, FileText, Pill, MessageCircle, Zap } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const problems = [
  { icon: FileText, text: "Health records scattered across WhatsApp, PDFs, and clinic folders" },
  { icon: Pill, text: "Nobody has the full picture of what medications are active" },
  { icon: MessageCircle, text: "Coordination happens in group chats — things get missed" },
  { icon: Zap, text: "Crises appear without warning because nobody is watching" },
];

const steps = [
   { num: "01", title: "On-board", desc: "Sign up, add your care team, and upload key health documents" },
   { num: "02", title: "Organize", desc: "Care Circle Global builds one current, accurate health view" },
   { num: "03", title: "Monitor", desc: "Drug interactions, missed tests, and care gaps are flagged automatically" },
   { num: "04", title: "Coordinate", desc: "Tasks are assigned, alerts sent, and daily briefings keep everyone aligned" },
];

function Index() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Care Circle Global</span>
          <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-36 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Now accepting early access signups
            </div>
            <h1 className="text-4xl md:text-[3.5rem] lg:text-6xl font-bold text-foreground leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Care Coordination<br />and Navigation Hub
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-foreground max-w-lg leading-relaxed">
              Organize health records and navigate complex care — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started</Button>
              <Button variant="heroGhost" size="xl" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>How It Works</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img src={heroImage} alt="Care Circle Global — connected care illustration" width={560} height={420} className="w-full max-w-md drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Sign Up
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">Choose the role that best describes you to get started.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Patient */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <HeartPulse className="w-8 h-8 text-primary" strokeWidth={1.75} />
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">The Patient</h3>
               <p className="text-black/70 mb-6 leading-relaxed">Set up care for myself and keep my health records organized in one place.</p>
              <Button variant="hero" size="xl" className="w-full" onClick={() => setModalOpen(true)}>Sign Up as a Patient</Button>
            </div>
            {/* Family */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <Users className="w-8 h-8 text-primary" strokeWidth={1.75} />
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">A Family</h3>
               <p className="text-black/70 mb-6 leading-relaxed">Coordinate care for a parent or loved one — even from a distance.</p>
              <Button variant="hero" size="xl" className="w-full" onClick={() => setModalOpen(true)}>Sign Up as a Family</Button>
            </div>
            {/* Professional */}
             <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-black">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                 <ClipboardCheck className="w-8 h-8 text-primary" strokeWidth={1.75} />
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">A Care Coordinator</h3>
               <p className="text-black/70 mb-6 leading-relaxed">Register as a nurse or care manager and join our coordinator network.</p>
              <Button variant="hero" size="xl" className="w-full" onClick={() => setModalOpen(true)}>Sign Up as a Care Coordinator</Button>
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
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">Four simple steps to start your care team.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{s.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28 px-6 bg-muted/40">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.163 5.279L15 5.979L11.5 9.221L12.326 14L8 11.779L3.674 14L4.5 9.221L1 5.979L5.837 5.279L8 1Z" fill="currentColor"/></svg>
              HIPAA-grade privacy controls
            </div>
            <blockquote className="text-xl md:text-2xl text-foreground font-medium leading-relaxed italic max-w-2xl mx-auto">
              "Finally, one place where I can see everything about my mother's care — even from 3,000 miles away."
            </blockquote>
            <p className="mt-4 text-muted-foreground">— Early beta participant</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to bring care together?
            </h2>
            <p className="text-xl md:text-2xl text-foreground mb-10 max-w-xl mx-auto">
              Whether you're a patient, a family member, or a care coordinator — start in under 2 minutes.
            </p>
            <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started</Button>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 px-6 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Sound familiar?
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">Families dealing with chronic or complex care face these problems every day.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow">
                <p.icon className="w-6 h-6 text-primary flex-shrink-0" strokeWidth={2} />
                <p className="text-foreground leading-relaxed">{p.text}</p>
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
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <SignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
