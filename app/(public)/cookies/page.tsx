// app/cookie-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | JainSoftware",
  description: "How JainSoftware uses cookies and local storage.",
};

function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-amber-200/60 dark:bg-amber-900/40 text-foreground px-1 rounded font-normal">
      {children}
    </mark>
  );
}

const COOKIES = [
  {
    name: "laravel_session",
    type: "Strictly necessary, first-party, HttpOnly",
    purpose: "Keeps you signed in and maintains session state across pages",
    duration: "Session",
    control: "No — required to sign in or complete a purchase",
  },
  {
    name: "XSRF-TOKEN",
    type: "Strictly necessary, first-party",
    purpose: "Security token verifying requests genuinely come from you (CSRF protection)",
    duration: "Session",
    control: "No — required for secure account and checkout actions",
  },
  {
    name: "Razorpay checkout cookies",
    type: "Third-party, functional",
    purpose: "Fraud detection and completing your payment securely",
    duration: "Set by Razorpay",
    control: "Only by not completing checkout",
  },
  {
    name: "Stripe cookies (if enabled)",
    type: "Third-party, functional",
    purpose: "Fraud prevention and payment processing via Stripe",
    duration: "Set by Stripe",
    control: "Only by not completing checkout via Stripe",
  },
  {
    name: "PayPal cookies (if enabled)",
    type: "Third-party, functional",
    purpose: "Payment processing and fraud prevention via PayPal",
    duration: "Set by PayPal",
    control: "Only by not completing checkout via PayPal",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: <Fill>25-06-2026</Fill>
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10">
          This Cookie Policy explains how JainSoftware ("we", "us", "our"), operated by{" "}
          <Fill>Jain Software Pvt Ltd</Fill>, located at{" "}
          <Fill>New Rajendra Nagar, Raipur, Chhattisgarh, India</Fill>, uses
          cookies and similar technologies on jain.software and its associated subdomains
          (collectively, the "Site").
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They
            allow a site to recognize your browser across requests — for example, to keep you
            signed in, or to remember a preference. We also use browser local storage, a related
            technology that stores small amounts of data directly in your browser rather than
            sending it with every request like a cookie does. We disclose our use of local storage
            here too, in the interest of full transparency.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Cookies We Actually Use</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="px-4 py-2.5 font-medium text-foreground">Name</th>
                  <th className="px-4 py-2.5 font-medium text-foreground">Type</th>
                  <th className="px-4 py-2.5 font-medium text-foreground">Purpose</th>
                  <th className="px-4 py-2.5 font-medium text-foreground">Duration</th>
                  <th className="px-4 py-2.5 font-medium text-foreground">Can you disable it?</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name} className="border-t border-border text-muted-foreground">
                    <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-2.5">{c.type}</td>
                    <td className="px-4 py-2.5">{c.purpose}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{c.duration}</td>
                    <td className="px-4 py-2.5">{c.control}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4">
            We do not currently use advertising cookies, cross-site tracking cookies, or third-party
            analytics cookies (e.g. Google Analytics). If this changes, this table will be updated,
            and you'll see a notice on the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Local Storage We Use</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            <li><span className="text-foreground font-medium">Theme preference</span> — remembers your chosen light/dark mode so it doesn't reset on your next visit.</li>
            <li><span className="text-foreground font-medium">Cart contents (guest users)</span> — lets you keep items in your cart between visits before you sign in.</li>
            <li><span className="text-foreground font-medium">Product/catalog cache</span> — speeds up page loads by temporarily storing recently viewed product data.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            You can clear local storage at any time via your browser's site settings; doing so
            resets these preferences but does not delete your account data stored on our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Why There's No Cookie Consent Banner (Yet)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our strictly-necessary cookies (session + CSRF) are required for the Site to function —
            to let you log in and pay — so under most frameworks, including India's current regime,
            these require disclosure rather than opt-in consent, which this page provides. If we add
            any non-essential cookie (analytics, marketing, advertising) in the future, we will add
            a consent mechanism before that cookie is set, and update this policy accordingly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">5. How to Control Cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most browsers let you block or delete cookies through their settings. Be aware that
            blocking the <code className="text-xs bg-muted/60 px-1.5 py-0.5 rounded">laravel_session</code> or{" "}
            <code className="text-xs bg-muted/60 px-1.5 py-0.5 rounded">XSRF-TOKEN</code> cookies will
            prevent you from signing in or completing checkout — these aren't optional convenience
            cookies, they're load-bearing for the Site to work.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Changes to This Policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time, for example if we add a new payment
            provider or analytics tool. We'll update the "Last updated" date above when we do.
            Material changes will be highlighted on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about this Cookie Policy, contact us at{" "}
            <Fill>contact@jain.software</Fill>,{" "}
            <Fill>Jairam complex, JaiStambh Chowk, Raipur, Chhattisgarh</Fill>.
          </p>
        </section>
      </div>
    </div>
  );
}