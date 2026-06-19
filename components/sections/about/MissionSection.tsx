import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MissionSection() {
  return (
   <section className="bg-[#f5f5f7] dark:bg-muted/40 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-snug">
              Empowering Businesses with Scalable &amp; Secure Software Solutions
            </h2>

            <div className="mt-6 space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We believe great software shouldn&apos;t be exclusive to large
                enterprises. Our mission is to make professional-grade business
                solutions accessible to companies of all sizes — from startups
                to Fortune 500s.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From SaaS platforms to custom development, APIs to AR solutions,
                we cover the full spectrum of digital transformation needs.
              </p>
            </div>

         
            <Link
              href="/store"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand hover:bg-brand-hover text-white px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
           
            <Image
              src="/about-mission.png"
              alt="Team working on software solutions"
             fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}