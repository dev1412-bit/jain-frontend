import { Search } from "lucide-react";

export default function SupportHero() {
  return (
    <section className="bg-background py-14 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          How can we help?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Search our knowledge base or contact our support team
        </p>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
        </div>
      </div>
    </section>
  );
}