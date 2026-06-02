import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Care Circle Global" },
      { name: "description", content: "Care Circle Global Terms of Service. Understand your rights and responsibilities when using our HIPAA-compliant care coordination platform." },
      { property: "og:title", content: "Terms of Service - Care Circle Global" },
      { property: "og:description", content: "Terms of Service for Care Circle Global's HIPAA-compliant care coordination platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col justify-between" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-[1.15rem] font-bold leading-none">
                <span style={{ color: "#1B365D" }}>Care </span>
                <span style={{ color: "#1B365D" }}>Circle</span>
              </span>
              <span className="text-[1.15rem] font-bold leading-none" style={{ color: "#1B365D" }}>Global</span>
            </div>
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Terms of Service</h1>
          <p className="text-muted-foreground mb-10">Last updated: May 4, 2026</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">1. Acceptance of Terms</h2>
            <p className="text-black leading-relaxed mb-4">
              By accessing or using Care Circle Global ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform. The Platform is a HIPAA-compliant care coordination tool designed to help patients, families, and care coordinators manage health information securely.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">2. Eligibility</h2>
            <p className="text-black leading-relaxed mb-4">
              You must be at least 18 years of age to create an account. If you are creating an account on behalf of a minor or a person under your legal guardianship, you represent that you have the legal authority to do so and to consent to the collection and use of their Protected Health Information (PHI) under HIPAA.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">3. Account Responsibilities</h2>
            <p className="text-black leading-relaxed mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring that the information you provide is accurate and up to date</li>
              <li>Notifying us immediately of any unauthorized access to your account</li>
              <li>Complying with all applicable laws, including HIPAA, when using the Platform</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">4. HIPAA and Protected Health Information</h2>
            <p className="text-black leading-relaxed mb-4">
              The Platform processes and stores Protected Health Information (PHI) as defined by HIPAA. By using the Platform, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>You will only upload health information that you are authorized to share</li>
              <li>You will only grant access to care team members who have a legitimate need to view the information</li>
              <li>You understand that PHI shared through the Platform is protected under HIPAA regulations</li>
              <li>You will not use the Platform to transmit PHI in violation of HIPAA's minimum necessary standard</li>
              <li>Care coordinators using the Platform agree to handle all PHI in compliance with HIPAA and any applicable Business Associate Agreement (BAA)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">5. Permitted Use</h2>
            <p className="text-black leading-relaxed mb-4">The Platform is intended solely for:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>Organizing and storing personal health records</li>
              <li>Coordinating care among authorized care team members</li>
              <li>Receiving health-related alerts and notifications</li>
              <li>Communicating securely with your care team</li>
            </ul>
            <p className="text-black leading-relaxed mb-4">
              The Platform is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">6. Prohibited Conduct</h2>
            <p className="text-black leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Attempt to access another user's account or PHI without authorization</li>
              <li>Upload malicious software or content</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
              <li>Use the Platform to store or transmit information in violation of HIPAA or any other applicable law</li>
              <li>Share your login credentials with unauthorized individuals</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">7. Data Security and Breach Notification</h2>
            <p className="text-black leading-relaxed mb-4">
              We implement administrative, physical, and technical safeguards as required by HIPAA's Security Rule to protect your PHI. In the event of a breach of unsecured PHI, we will comply with HIPAA's Breach Notification Rule, notifying affected individuals within 60 days of discovering the breach.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">8. Intellectual Property</h2>
            <p className="text-black leading-relaxed mb-4">
              All content, features, and functionality of the Platform - including but not limited to text, graphics, logos, and software - are the exclusive property of Care Circle Global and are protected by copyright, trademark, and other intellectual property laws. You retain ownership of any health information you upload to the Platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">9. Limitation of Liability</h2>
            <p className="text-black leading-relaxed mb-4">
              To the fullest extent permitted by law, Care Circle Global shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. The Platform is provided "as is" and "as available" without warranties of any kind. Nothing in these Terms limits our obligations under HIPAA with respect to the protection of PHI.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">10. Termination</h2>
            <p className="text-black leading-relaxed mb-4">
              We may suspend or terminate your account at any time for violation of these Terms. Upon termination, your right to use the Platform ceases immediately. You may request deletion of your account and associated PHI at any time, subject to applicable legal retention requirements under HIPAA and state law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">11. Changes to These Terms</h2>
            <p className="text-black leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or through a notice on the Platform. Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">12. Governing Law</h2>
            <p className="text-black leading-relaxed mb-4">
              These Terms are governed by and construed in accordance with the laws of the United States, including HIPAA and applicable state laws. Any disputes arising from these Terms shall be resolved in the appropriate federal or state courts.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">13. Contact Us</h2>
            <p className="text-black leading-relaxed">
              If you have questions about these Terms of Service, please contact us:<br /><br />
              <strong>Care Circle Global</strong><br />
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