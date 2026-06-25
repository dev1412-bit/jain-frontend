// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JainSoftware",
  description: "Terms of Service for JainSoftware's software marketplace.",
};

function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-amber-200/60 dark:bg-amber-900/40 text-foreground px-1 rounded font-normal">
      {children}
    </mark>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: <Fill>[Insert publish date]</Fill>
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10">
          These Terms of Service ("Terms") govern your access to and use of jain.software and its
          associated subdomains (collectively, the "Site"), operated by{" "}
          <Fill>[Insert registered legal entity name]</Fill> ("JainSoftware", "we", "us", "our"),
          based in Raipur, Chhattisgarh, India. By creating an account, browsing the Site, or
          purchasing any product or service through it, you agree to these Terms. If you do not
          agree, please do not use the Site.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Eligibility</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You must be at least 18 years old, or the age of majority in your jurisdiction, to
            create an account or make a purchase. By using the Site, you represent that you meet
            this requirement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Account Registration</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>You're responsible for keeping your account credentials confidential and for all activity that happens under your account.</li>
            <li>You agree to provide accurate information when registering and to keep it up to date.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, or are used for fraudulent activity.</li>
            <li>
              Authentication is handled via secure access tokens — see our{" "}
              <a href="/cookie-policy" className="text-brand hover:underline">Cookie Policy</a> for details on what's stored and why.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Products and Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            We operate as a software marketplace offering{" "}
            <Fill>[Insert short description — e.g. "SaaS products, software licenses, and related digital services"]</Fill>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>Product descriptions, pricing, and availability are subject to change without notice.</li>
            <li>We make reasonable efforts to ensure listed information is accurate but do not warrant that product descriptions are error-free.</li>
            <li>Some products may be offered as one-time purchases, others as recurring subscriptions — the applicable billing model will be clearly stated at checkout.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Pricing and Payments</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>All prices are listed in <Fill>[Insert currency, e.g. INR]</Fill> unless stated otherwise.</li>
            <li>Payments are processed securely through third-party payment gateways, currently Razorpay, and where enabled, Stripe and PayPal. We do not store your full card or bank details on our servers.</li>
            <li>By making a payment, you agree to the applicable payment processor's own terms and privacy policy in addition to these Terms.</li>
            <li>You authorize us to charge your chosen payment method for the full amount of your order, including applicable taxes.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Subscriptions and Auto-Renewal</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>Subscription plans renew automatically at the end of each billing cycle unless cancelled before the renewal date.</li>
            <li>You can cancel a subscription at any time from your account dashboard; cancellation takes effect at the end of the current billing period unless stated otherwise.</li>
            <li><Fill>[Insert: prorated refund on cancellation, or access continues until period end with no refund?]</Fill></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Refunds and Cancellations</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            <Fill>[This section needs your specific policy — at minimum specify the refund eligibility window, how digital/downloadable goods differ from subscriptions, how to request a refund, processing timeline, and any non-refundable items.]</Fill>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">7. License Grant for Software Products</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">Unless otherwise specified for a particular product:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>We grant you a limited, non-exclusive, non-transferable license to use purchased software/digital products for your own internal business or personal use, in accordance with the specific license terms shown for that product.</li>
            <li>You may not resell, sublicense, reverse-engineer, or redistribute purchased software unless explicitly permitted by the applicable product's license terms.</li>
            <li>License keys, downloadable files, and access credentials are for your use only and should not be shared.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Acceptable Use</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li>Use the Site for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to our systems, other users' accounts, or non-public areas of the Site</li>
            <li>Upload malicious code, scrape the Site at scale, or interfere with its normal operation</li>
            <li>Use automated means to create accounts or place orders without our permission</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Intellectual Property</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content on the Site — including but not limited to the JainSoftware name, logo,
            design, text, graphics, and underlying code — is owned by us or our licensors and
            protected by applicable intellectual property laws. Nothing in these Terms transfers
            any such ownership to you, except for the specific license rights described in Section 7
            for purchased products.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Third-Party Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Site integrates with third-party services (currently Razorpay, and optionally
            Stripe, PayPal, Google, and GitHub for sign-in where enabled). We are not responsible
            for the practices, content, or availability of these third-party services. Your use of
            them is governed by their own terms and privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Disclaimers</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Site and its products are provided "as is" and "as available," without warranties
            of any kind, whether express or implied, including but not limited to warranties of
            merchantability, fitness for a particular purpose, or non-infringement, to the maximum
            extent permitted by applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">12. Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, JainSoftware shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from your use
            of the Site or its products, including but not limited to loss of profits, data, or
            business opportunity. Our total liability for any claim arising from these Terms or your
            use of the Site shall not exceed the amount you paid us in the{" "}
            <Fill>2 months</Fill> preceding the claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">13. Indemnification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You agree to indemnify and hold harmless JainSoftware and its team from any claims,
            damages, or expenses arising from your violation of these Terms or misuse of the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">14. Termination</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may suspend or terminate your access to the Site at our discretion, with or without
            notice, if we reasonably believe you've violated these Terms. You may stop using the
            Site and close your account at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">15. Changes to These Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. We'll update the "Last updated" date
            above, and for material changes, we'll make reasonable efforts to notify active users.
            Continued use of the Site after changes take effect constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">16. Governing Law and Dispute Resolution</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms are governed by the laws of India. Any disputes arising from these Terms or
            your use of the Site shall be subject to the exclusive jurisdiction of the courts at{" "}
            <strong className="text-foreground">Raipur, Chhattisgarh, India</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">17. Grievance Officer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            In accordance with the Information Technology Act, 2000 and rules made thereunder, the
            contact details of our Grievance Officer are:
          </p>
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground space-y-1">
            <p><span className="text-foreground font-medium">Name:</span> <Fill>Jain Software</Fill></p>
            <p><span className="text-foreground font-medium">Email:</span> <Fill>contact@jain.software</Fill></p>
            <p><span className="text-foreground font-medium">Address:</span> <Fill>Jairam Complex, Near Jaistambh Chowk, Raipur, Chhattisgarh</Fill></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">18. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any questions about these Terms, contact us at{" "}
            <Fill>contact@jain.software</Fill>, <Fill>Jairam Complex, Near Jaistambh Chowk, Raipur, Chhattisgarh</Fill>.
          </p>
        </section>
      </div>
    </div>
  );
}