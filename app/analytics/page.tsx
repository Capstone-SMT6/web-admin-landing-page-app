import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnalyticsSection } from "@/components/analytics-section";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0D0F14] text-zinc-100 font-sans selection:bg-[#2A2F45]">
      <header className="sticky top-0 z-50 bg-[#0D0F14]/90 backdrop-blur-md border-b border-[#2A2F45]">
        <div className="container mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-mono text-[#6B7280] tracking-widest uppercase">
            AI Fitness · Capstone
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={12} />
            ← home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6">
        <div className="pt-16 pb-12 border-b border-[#2A2F45]">
          <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-6">
            § 02 — The data layer
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.95] text-white mb-6">
            Fitness Topic<br />
            <span className="text-[#67C23A]">Trends.</span>
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-lg">
            Wikipedia pageview data across 19 fitness topics — how interest rises,
            falls, and correlates over time. Raw numbers, no spin.
          </p>
        </div>

        <div className="py-12">
          <AnalyticsSection />
        </div>
      </main>

      <footer className="border-t border-[#2A2F45]">
        <div className="container mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <span className="text-xs font-mono text-[#2A2F45]">© 2026 Capstone Project</span>
          <span className="text-xs font-mono text-[#2A2F45]">Flutter · FastAPI · Next.js</span>
        </div>
      </footer>
    </div>
  );
}
