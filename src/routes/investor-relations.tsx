import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/investor-relations")({
  head: () => ({
    meta: [
      { title: "Investor Relations - Care Circle Global" },
      { name: "description", content: "Care Circle Global investor relations. Learn about our mission, market opportunity, and how to get in touch with our team." },
      { property: "og:title", content: "Investor Relations - Care Circle Global" },
      { property: "og:description", content: "Learn about Care Circle Global's mission, market opportunity, and investor opportunities." },
    ],
  }),
  component: InvestorRelationsPage,
});

function InvestorRelationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col justify-between" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-[1.15rem] font-bold leading-none">
                <span style={{ color: "#1B365D" }}>Care </span>
                <span style={{ color: "#1B365D" }}>Circle</span>
              </span>
              <span className="text-[1.15rem] font-bold leading-none" style={{ color: "#1B365D" }}>Global</span>
            </div>
          </Link>
          <a href="https://myequityholdings.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1B365D] hover:underline"class="inline-flex items-center gap-1">Investor Login <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></a>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Investor Relations</h1>
          <p className="text-muted-foreground mb-10">Building the future of care coordination</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">Our Mission</h2>
            <p className="text-black leading-relaxed mb-4">
              Care Circle Global is on a mission to transform how families, patients, and care coordinators manage health information. By bringing scattered health records into one HIPAA-compliant platform, we ensure that nothing falls through the cracks — especially during critical moments.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">Market Opportunity</h2>
            <p className="text-black leading-relaxed mb-4">
              The care coordination market is growing rapidly as populations age and chronic conditions become more prevalent. Families are increasingly managing care across multiple providers, locations, and health systems — creating a massive need for a unified coordination hub.
            </p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>Growing aging population requiring complex care management</li>
              <li>Increasing fragmentation across healthcare providers</li>
              <li>Rising demand for family-accessible health tools</li>
              <li>Regulatory tailwinds supporting patient data portability</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">Contact Us</h2>
            <p className="text-black leading-relaxed mb-4">
              For investment inquiries, partnership opportunities, or to request additional materials, please reach out to our team:
            </p>
            <p className="text-black leading-relaxed">
              <strong>Care Circle Global</strong><br />
              Investor Relations<br />
            </p>
          </section>

          <section className="mb-10">
            <p className="text-black leading-relaxed">
              Login to Investor relation Portal - <a href="https://myequityholdings.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">https://myequityholdings.com</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© 2026 Care Circle Global. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/investor-relations" className="hover:text-foreground transition-colors">Investor Relations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
