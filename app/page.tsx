import { BrainCircuit, Activity, Bot, Server, Database, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0F14] text-zinc-100 font-sans selection:bg-[#2A2F45]">

      {/* Header — sparse, left-heavy */}
      <header className="sticky top-0 z-50 bg-[#0D0F14]/90 backdrop-blur-md border-b border-[#2A2F45]">
        <div className="container mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-mono text-[#6B7280] tracking-widest uppercase">
            AI Fitness · Capstone
          </span>
          <span className="text-xs font-mono text-[#2A2F45]">2026</span>
        </div>
      </header>

      <main>

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="relative border-b border-[#2A2F45] overflow-hidden">
          {/* Hero background image */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "url('/Hero.png')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Left fade so text stays readable */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to right, #0D0F14 38%, #0D0F14bb 58%, transparent 82%)",
            }}
          />
          {/* Bottom fade into next section */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
            style={{ background: "linear-gradient(to bottom, transparent, #0D0F14)" }}
          />

          <div className="relative container mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
            <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-10">
              § 00 — Overview
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white mb-10 max-w-3xl">
              Your body.<br />
              Your data.<br />
              <span className="text-[#67C23A]">Our system.</span>
            </h1>

            <p className="text-base text-[#6B7280] leading-relaxed max-w-lg">
              A capstone project combining a Flutter mobile app with real-time pose
              detection, a Python backend with RAG-powered chat, and big-data
              analysis of how people actually search for fitness content.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-6">

        {/* ── SYSTEM STACK ────────────────────────────────── */}
        <section className="py-20 border-b border-[#2A2F45]">
          <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-12">
            § 01 — What we built
          </p>

          {/* Row 01: Mobile */}
          <div className="group py-10 border-b border-[#2A2F45] grid md:grid-cols-[6rem_1fr_auto] gap-6 md:gap-10 items-start">
            <span className="text-[4rem] md:text-[5rem] font-extrabold leading-none text-[#2A2F45] group-hover:text-[#7C6AF7] transition-colors duration-300 select-none">
              01
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
                Mobile Application
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 max-w-sm">
                Built with Flutter. Watches your form in real time, counts reps,
                and answers your questions through an embedded AI assistant.
              </p>
              <ul className="space-y-2">
                {[
                  [BrainCircuit, "Pose detection via Google ML Kit & TFLite"],
                  [Activity,     "Smart calibration + workout history"],
                  [Bot,          "In-app AI chatbot"],
                ].map(([Icon, text]: any) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Icon size={13} className="text-[#7C6AF7] shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:flex flex-col gap-1.5 items-end pt-1 shrink-0">
              {["Flutter", "ML Kit", "TFLite"].map((t) => (
                <span key={t} className="font-mono text-[10px] text-[#6B7280] border border-[#2A2F45] rounded px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Row 02: Backend */}
          <div className="group py-10 grid md:grid-cols-[6rem_1fr_auto] gap-6 md:gap-10 items-start">
            <span className="text-[4rem] md:text-[5rem] font-extrabold leading-none text-[#2A2F45] group-hover:text-[#67C23A] transition-colors duration-300 select-none">
              02
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
                Backend API
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 max-w-sm">
                High-performance Python API that handles auth, serves data to
                the app, and runs a retrieval-augmented chatbot backed by
                ChromaDB and Gemini.
              </p>
              <ul className="space-y-2">
                {[
                  [Server,   "FastAPI with JWT authentication"],
                  [Bot,      "RAG chatbot — ChromaDB + Gemini"],
                  [Database, "PostgreSQL · SQLModel · Alembic"],
                ].map(([Icon, text]: any) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Icon size={13} className="text-[#67C23A] shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:flex flex-col gap-1.5 items-end pt-1 shrink-0">
              {["FastAPI", "ChromaDB", "PostgreSQL", "Gemini"].map((t) => (
                <span key={t} className="font-mono text-[10px] text-[#6B7280] border border-[#2A2F45] rounded px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANALYTICS CTA ───────────────────────────────── */}
        <section className="py-20">
          <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-12">
            § 02 — The data layer
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            {/* Left: the hook */}
            <div>
              <p className="text-[#6B7280] text-sm font-mono mb-3">Wikipedia pageview trends</p>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-[7rem] md:text-[9rem] font-extrabold leading-none text-white tracking-tighter">
                  19
                </span>
                <div className="text-[#6B7280] text-sm leading-relaxed max-w-[14rem]">
                  fitness topics tracked over time — cardio, strength, nutrition, and more.
                </div>
              </div>

              {/* Horizontal topic strip */}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  "Muscle", "Squat", "Yoga", "Running", "HIIT",
                  "Protein", "Cardio", "Deadlift", "Stretching", "Nutrition",
                ].map((t) => (
                  <span key={t} className="font-mono text-xs text-[#2A2F45] hover:text-[#6B7280] transition-colors">
                    {t}
                  </span>
                ))}
                <span className="font-mono text-xs text-[#2A2F45]">+ 9 more</span>
              </div>
            </div>

            {/* Right: CTA */}
            <Link
              href="/analytics"
              className="group flex items-center gap-4 border border-[#2A2F45] hover:border-[#67C23A] rounded-2xl px-7 py-5 transition-all duration-300 hover:bg-[#67C23A]/5 shrink-0 self-start md:self-end"
            >
              <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                Explore the trends
              </span>
              <ArrowUpRight
                size={18}
                className="text-[#6B7280] group-hover:text-[#67C23A] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2A2F45]">
        <div className="container mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <span className="text-xs font-mono text-[#2A2F45]">© 2026 Capstone Project</span>
          <span className="text-xs font-mono text-[#2A2F45]">Flutter · FastAPI · Next.js</span>
        </div>
      </footer>
    </div>
  );
}
