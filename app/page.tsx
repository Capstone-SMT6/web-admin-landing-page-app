import { Smartphone, Server, Activity, Database, Bot, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Minimal Header */}
      <header className="border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto max-w-5xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-zinc-900 dark:text-white" size={24} />
            <span className="text-lg font-medium tracking-tight">
              AI Fitness Capstone
            </span>
          </div>
          {/* Removed login button as requested */}
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-20 md:py-32">
        {/* Hero */}
        <div className="max-w-3xl mb-24">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
            Intelligent Fitness, <br className="hidden md:block" />
            Powered by AI.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
            A comprehensive smart fitness ecosystem. Combining real-time AI pose detection on mobile with a robust, high-performance RAG backend.
          </p>
        </div>

        {/* Project Components */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          
          {/* Mobile App Section */}
          <div className="group rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 p-8 md:p-10 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <Smartphone size={24} className="text-zinc-700 dark:text-zinc-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Mobile Application</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              A smart fitness app built with Flutter. Guides users with real-time posture analysis, structured workouts, and a virtual assistant.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BrainCircuit size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>AI Pose Detection:</strong> Real-time tracking using Google ML Kit & TFLite.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Activity size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>Smart Calibration & Tracking:</strong> Ensures optimal accuracy and visualizes workout history.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Bot size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>AI Chatbot:</strong> Integrated virtual fitness assistant.
                </span>
              </li>
            </ul>
          </div>

          {/* Backend API Section */}
          <div className="group rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 p-8 md:p-10 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <Server size={24} className="text-zinc-700 dark:text-zinc-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Backend API</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              A high-performance Python backend handling authentication, complex database operations, and AI context retrieval.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Server size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>FastAPI Core:</strong> Blazing fast Python API for processing requests and handling JWT Auth.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Bot size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>RAG Chatbot:</strong> Advanced AI powered by ChromaDB & Gemini for contextual fitness responses.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Database size={20} className="text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base">
                  <strong>Database Architecture:</strong> PostgreSQL managed seamlessly with SQLModel & Alembic migrations.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="container mx-auto max-w-5xl px-6 py-8 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} Capstone Project. All rights reserved.</p>
          <p className="hidden sm:block">Flutter • FastAPI • Next.js</p>
        </div>
      </footer>
    </div>
  );
}
