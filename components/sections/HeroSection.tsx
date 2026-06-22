import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-background">
      <div className="max-w-7xl mx-auto pt-16 pb-0">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Work Smarter, Scale Faster
          </h1>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Equip your team with industry-leading tools designed to automate
            workflows, boost productivity, and drive growth.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-colors shadow-md shadow-brand/20"
            >
              Learn more
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center px-6 py-2.5 rounded-full border border-border hover:bg-accent text-foreground text-sm font-semibold transition-colors"
            >
              Store
            </Link>
          </div>
        </div>
        <div className="mt-12 relative mx-auto max-w-5xl">
          <div className="absolute inset-x-10 top-4 h-32 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative rounded-xl border border-border shadow-2xl shadow-black/10 overflow-hidden bg-muted">
            <Image
              src="/hero-dashboard.png"
              alt="MLM Management Dashboard Preview"
              width={1200}
              height={750}
              className="w-full h-auto object-cover object-top"
              priority
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}