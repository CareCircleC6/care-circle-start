import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Care Circle Global" },
      { name: "description", content: "Care Circle Global Privacy Policy. Learn how we protect your health information in compliance with HIPAA regulations." },
      { property: "og:title", content: "Privacy Policy - Care Circle Global" },
      { property: "og:description", content: "Learn how we protect your health information in compliance with HIPAA." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: May 4, 2026</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">1. Introduction</h2>
            <p className="text-black leading-relaxed mb-4">
              Care Circle Global ("we," "us," or "our") is committed to protecting the privacy and security of your personal information, including Protected Health Information (PHI) as defined by the Health Insurance Portability and Accountability Act of 1996 (HIPAA). This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">2. HIPAA Compliance</h2>
            <p className="text-black leading-relaxed mb-4">
              Care Circle Global operates as a platform that handles Protected Health Information (PHI). We are committed to complying with the HIPAA Privacy Rule, the HIPAA Security Rule, and the HITECH Act. Our practices include:
            </p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>Implementing administrative, physical, and technical safeguards to protect PHI</li>
              <li>Restricting access to PHI to authorized individuals only</li>
              <li>Encrypting PHI both in transit and at rest using industry-standard encryption</li>
              <li>Maintaining audit logs of all access to PHI</li>
              <li>Providing breach notification in accordance with HIPAA requirements</li>
              <li>Entering into Business Associate Agreements (BAAs) with all third-party service providers who handle PHI</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">3. Information We Collect</h2>
            <p className="text-black leading-relaxed mb-4">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and account credentials</li>
              <li><strong>Protected Health Information (PHI):</strong> Medical records, prescriptions, lab results, diagnoses, treatment plans, and care coordination notes</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including log data and device information</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">4. How We Use Your Information</h2>
            <p className="text-black leading-relaxed mb-4">We use your information for the following purposes, consistent with HIPAA's permitted uses and disclosures:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li><strong>Treatment:</strong> Facilitating care coordination among your designated care team members</li>
              <li><strong>Operations:</strong> Improving our platform, providing customer support, and ensuring quality of service</li>
              <li><strong>As authorized by you:</strong> Sharing information with individuals or entities you explicitly authorize</li>
              <li><strong>As required by law:</strong> Complying with legal obligations, including public health reporting</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">5. Your Rights Under HIPAA</h2>
            <p className="text-black leading-relaxed mb-4">As a user of Care Circle Global, you have the following rights regarding your PHI:</p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li><strong>Right to Access:</strong> You may request access to your PHI that we maintain</li>
              <li><strong>Right to Amend:</strong> You may request corrections to your PHI</li>
              <li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of certain disclosures we have made of your PHI</li>
              <li><strong>Right to Request Restrictions:</strong> You may request limitations on how we use or disclose your PHI</li>
              <li><strong>Right to Confidential Communications:</strong> You may request that we communicate with you through specific channels</li>
              <li><strong>Right to a Copy of this Notice:</strong> You may request a paper copy of this Privacy Policy at any time</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">6. Data Security</h2>
            <p className="text-black leading-relaxed mb-4">
              We implement comprehensive security measures consistent with HIPAA's Security Rule, including:
            </p>
            <ul className="list-disc pl-6 text-black space-y-2 mb-4">
              <li>AES-256 encryption for data at rest</li>
              <li>TLS 1.2+ encryption for data in transit</li>
              <li>Multi-factor authentication for account access</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Role-based access controls</li>
              <li>Automatic session timeouts</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">7. Breach Notification</h2>
            <p className="text-black leading-relaxed mb-4">
              In the event of a breach of unsecured PHI, we will notify affected individuals, the Department of Health and Human Services (HHS), and, where required, the media, in accordance with HIPAA's Breach Notification Rule. Notification will be provided without unreasonable delay and no later than 60 days following discovery of the breach.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">8. Third-Party Services</h2>
            <p className="text-black leading-relaxed mb-4">
              We may use third-party service providers to support our platform. All third parties who have access to PHI are required to sign Business Associate Agreements (BAAs) and comply with HIPAA requirements. We do not sell your personal information or PHI to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">9. Data Retention</h2>
            <p className="text-black leading-relaxed mb-4">
              We retain your information for as long as your account is active or as needed to provide services. PHI is retained in accordance with applicable state and federal retention requirements. Upon account deletion, we will securely destroy your PHI within 30 days, unless retention is required by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-black mb-3">10. Contact Us</h2>
            <p className="text-black leading-relaxed mb-4">
              If you have questions about this Privacy Policy, wish to exercise your HIPAA rights, or need to report a privacy concern, please contact our Privacy Officer:
            </p>
            <p className="text-black leading-relaxed">
              <strong>Care Circle Global - Privacy Officer</strong><br />
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
          </div>
        </div>
      </footer>
    </div>
  );
}