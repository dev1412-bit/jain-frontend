import Link from "next/link";
export default function AboutHero() {
    return(
         <section className="bg-[#f5f5f7] dark:bg-muted/40 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-flex items-center rounded-full bg-brand/10 text-brand px-4 py-1 text-sm font-medium mb-6">About Jain Software</span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-foreground">
                        Modernizing businesses with{" "}
                        <span className="text-brand">software & technology</span>
                    </h1>
                    <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                        JainSoftware is a professional software and services company helping
                        global brands sell, operate, and grow through design, technology, and
                        AI. Founded in 2009, we&apos;ve helped over 1000+ businesses transform
                        their operations.
                    </p>
                </div>
            </div>
        </section>
    )
}