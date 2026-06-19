import Image from "next/image";
import Link from "next/link";

export default function AfterHeroSection() {
  return (
    <section className="w-full bg-background">
      {/* ─── FIXED: Changed pb-0 to pb-16 for perfect bottom spacing ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Software Development
          </h1>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed text-muted-foreground">
            Custom Software Solutions developed according to our client's need.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-colors shadow-md shadow-brand/20"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Image Mockup Wrapper */}
        <div className="mt-12 relative mx-auto max-w-5xl">
          {/* Background Glow */}
          <div className="absolute inset-x-10 top-4 h-32 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
          
          {/* Main Image Container */}
          <div className="relative rounded-xl border border-border shadow-2xl shadow-black/10 overflow-hidden bg-muted mb-5">
            <Image
              src="/code.png"
              alt="Jain Software Net"
              width={1200}
              height={750}
              className="w-full h-auto object-cover object-top"
              priority
            />
            
            {/* ─── FIXED: Moved gradient inside the overflow-hidden parent ─── */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}