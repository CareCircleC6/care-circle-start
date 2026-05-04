import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignupModal } from "@/components/SignupModal";
import heroImage from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const problems = [
  { icon: "📄", text: "Health records scattered across WhatsApp, PDFs, and clinic folders" },
  { icon: "💊", text: "Nobody has the full picture of what medications are active" },
  { icon: "💬", text: "Coordination happens in group chats — things get missed" },
  { icon: "⚡", text: "Crises appear without warning because nobody is watching" },
];

const steps = [
  { num: "01", title: "Upload", desc: "Prescriptions, lab results, or voice notes" },
  { num: "02", title: "Unify", desc: "CareCircle builds one current, accurate health view" },
  { num: "03", title: "Flag", desc: "Drug interactions, missed tests, and care gaps are flagged" },
  { num: "04", title: "Act", desc: "Tasks are assigned, alerts sent, daily briefings generated" },
];

function Index() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>CareCircle</span>
          <Button variant="hero" size="sm" onClick={() => setModalOpen(true)}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Care for your parents,<br />no matter the distance.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              One place to organize health records, coordinate care, and stay informed — so nothing falls through the cracks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started</Button>
              <Button variant="heroGhost" size="xl" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>See How It Works</Button>
            </div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="flex justify-center">
            <img src={heroImage} alt="CareCircle — connected care illustration" width={560} height={420} className="w-full max-w-md" />
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Sound familiar?
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <p className="text-foreground leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
            How CareCircle works
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28 px-6 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.163 5.279L15 5.979L11.5 9.221L12.326 14L8 11.779L3.674 14L4.5 9.221L1 5.979L5.837 5.279L8 1Z" fill="currentColor"/></svg>
              HIPAA-grade privacy controls
            </div>
            <blockquote className="text-xl md:text-2xl text-foreground font-medium leading-relaxed italic max-w-2xl mx-auto">
              "Finally, one place where I can see everything about my mother's care — even from 3,000 miles away."
            </blockquote>
            <p className="mt-4 text-muted-foreground">— Early beta participant</p>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to bring care together?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you're a patient, a family member, or a care professional — start in under 2 minutes.
            </p>
            <Button variant="hero" size="xl" onClick={() => setModalOpen(true)}>Get Started — It's Free</Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2026 CareCircle. All rights reserved.</span>
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
