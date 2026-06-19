import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Our Platform",
  description: "Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 17, 2026";

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-border pb-8 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to our platform. We value your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website, use our platform, or interact with our services.
            </p>
            <p>
              By accessing or using our services, you agree to the collection and use of information in accordance 
              with this policy. If you do not agree with any terms within this policy, please discontinue use of our platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, as well as data gathered automatically:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Personal Data:</strong> Personally identifiable information, such as your name, 
                email address, phone number, and account credentials that you voluntarily submit when registering or contacting us.
              </li>
              <li>
                <strong className="text-foreground">Derivative & Usage Data:</strong> Information our servers automatically collect 
                when you access the site, including your IP address, browser type, operating system, access times, and the pages you viewed.
              </li>
              <li>
                <strong className="text-foreground">Cookies and Tracking Technologies:</strong> We may use cookies, web beacons, and 
                tracking pixels to help customize the platform and improve your overall experience.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. How We Use Your Information</h2>
            <p>We use the collected information for various professional and operational purposes, including to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create, manage, and maintain your user account.</li>
              <li>Deliver, operate, and improve the specific features of our platform.</li>
              <li>Respond to customer service requests, product inquiries, and support needs.</li>
              <li>Monitor and analyze usage patterns and behaviors to optimize our user interface and system performance.</li>
              <li>Prevent fraudulent transactions, counter security threats, and safeguard our community.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Sharing and Disclosure of Information</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share information with third-party 
              service providers who perform operations on our behalf (such as database management, payment processing, or analytics hosting), 
              provided they are strictly obligated to preserve your data security.
            </p>
            <p>
              We may also disclose information if required to do so by law, court order, or governmental authority to protect 
              our legal rights, safety, or property.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Data Security</h2>
            <p>
              We implement comprehensive technical and organizational security measures designed to protect the safety of your personal data. 
              However, please remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. 
              While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Your Rights & Choices</h2>
            <p>Depending on your geographical location, you may have specific statutory rights regarding your personal data, which include:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The right to access, update, or correct the personal data we hold about you.</li>
              <li>The right to request that we delete or permanently erase your personal data from our active systems.</li>
              <li>The right to opt-out of marketing communications by clicking the &ldquo;unsubscribe&rdquo; links inside our emails.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">7. Contact Us</h2>
            <p>
              If you have any remaining questions, technical concerns, or complaints regarding this Privacy Policy or our overall data 
              handling processes, please feel free to reach out to our team:
            </p>
            <div className="bg-muted/40 border border-border rounded-xl p-5 mt-4 space-y-1">
              <p className="text-sm font-semibold text-foreground">Platform Support Team</p>
              <p className="text-sm text-muted-foreground">Email: contact@jain.software</p>
              <p className="text-sm text-muted-foreground">Address: Raipur, Chhattisgarh, India</p>
            </div>
          </section>

        </div>

        {/* Footer Navigation Back Link */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <Link href="/" className="text-xs text-brand hover:underline font-medium">
            &larr; Return to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}