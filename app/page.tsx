"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const content = {
  en: {
    analytics: "Analytics",
    dashboard: "Dashboard",
    heroTag: "§ SmaCoFit Companion",
    heroTitle: "Your body.",
    heroTitle2: "Your data.",
    heroTitle3: "Our system.",
    heroDesc: "SmaCoFit is your intelligent workout companion. Track your exercises with live on-device camera feedback, get posture corrections instantly, fuel with smart macro targets, and consult our AI fitness coach 24/7.",
    featuresTag: "§ 01 — Core Mobile Features",
    featuresTitle: "Everything you need to train smarter",
    f1Sub: "On-Device · Private · Real-time",
    f1Title: "AI Pose Detection & Form Correction",
    f1Desc: "Your camera streams directly to on-device ML Kit — no data leaves your phone. Joint angles at elbows, hips, and knees are calculated per-frame to count reps and flag bad posture instantly.",
    f2Sub: "Indonesian · id-ID",
    f2Title: "Vocal Form Coach",
    f2Desc: "Real-time spoken corrections in Bahasa Indonesia. Warns you when hips sag, elbows flare, or tempo breaks — and fires a haptic pulse every completed rep.",
    f3Sub: "Pre-workout · Auto-adapt",
    f3Title: "Smart Calibration",
    f3Desc: "Before every session, SmaCoFit runs a hardware and environment check — then tunes camera resolution and frame-skip thresholds so tracking stays smooth on any device.",
    f3Steps: [
      { label: "Device Check", col: "#67C23A", done: true },
      { label: "Lighting", col: "#67C23A", done: true },
      { label: "Position", col: "#67C23A", done: true },
      { label: "Ready!", col: "#6B7280", done: false }
    ],
    f4Sub: "BMR · TDEE · Gemini RAG",
    f4Title: "Nutrition & AI Coach",
    f4Desc: "Your profile unlocks dynamic calorie targets. Log meals, watch macros update in real time, and ask SmaCoFit's Gemini-backed chatbot anything about your diet or training plan.",
    howItWorksTag: "§ 02 — How it works",
    howItWorksTitle: "Three steps to a smarter routine",
    howItWorksSteps: [
      { n: "01", col: "#67C23A", title: "Profile Setup", body: "Enter your age, height, weight and goal. SmaCoFit computes your exact BMR and TDEE, assigns a difficulty gate, and distributes macros to match." },
      { n: "02", col: "#67C23A", title: "Room Calibration", body: "Hold the phone side-on. SmaCoFit checks room brightness, validates that all required joint landmarks are visible, and auto-adjusts frame rate for your hardware." },
      { n: "03", col: "#67C23A", title: "Train with Live Feedback", body: "Work through your plan. The on-device model tracks every rep, fires voice cues in Indonesian when form breaks, and logs duration and streaks on completion." }
    ],
    insightsTag: "§ 03 — Fitness Insights Engine",
    insightsSub: "Global Search & Trend Tracking",
    insightsDesc: "essential fitness topics continuously monitored to update SmaCoFit's RAG knowledge base.",
    insightsCtaSub: "EXPLORE THE DATA",
    insightsCtaTitle: "Explore the trends",
    footerDesc: "On-Device AI · Smart Fitness · Nutrition"
  },
  id: {
    analytics: "Analisis",
    dashboard: "Dasbor",
    heroTag: "§ Pendamping SmaCoFit",
    heroTitle: "Tubuh Anda.",
    heroTitle2: "Data Anda.",
    heroTitle3: "Sistem kami.",
    heroDesc: "SmaCoFit adalah pendamping latihan cerdas Anda. Lacak gerakan lewat kamera langsung, dapatkan koreksi postur instan, penuhi target makro harian, dan konsultasikan pelatih AI kami 24/7.",
    featuresTag: "§ 01 — Fitur Utama Seluler",
    featuresTitle: "Semua yang Anda butuhkan untuk berlatih lebih cerdas",
    f1Sub: "Di Perangkat · Privat · Real-time",
    f1Title: "Deteksi Pose AI & Koreksi Gerakan",
    f1Desc: "Aliran kamera Anda diproses langsung oleh ML Kit di perangkat — tidak ada data yang keluar dari ponsel Anda. Sudut sendi siku, pinggul, dan lutut dihitung per-bingkai untuk menghitung repetisi dan mendeteksi postur yang salah secara instan.",
    f2Sub: "Bahasa Indonesia · id-ID",
    f2Title: "Pelatih Suara Vokal",
    f2Desc: "Koreksi suara langsung dalam Bahasa Indonesia. Memperingatkan Anda saat pinggul turun, siku melebar, atau tempo latihan terganggu — serta memberikan getaran haptik setiap repetisi berhasil.",
    f3Sub: "Sebelum Latihan · Adaptasi Otomatis",
    f3Title: "Kalibrasi Cerdas",
    f3Desc: "Sebelum memulai sesi, SmaCoFit memeriksa perangkat keras dan lingkungan Anda — kemudian menyesuaikan resolusi kamera dan batas frame-skip agar pelacakan tetap lancar di perangkat apa pun.",
    f3Steps: [
      { label: "Cek Perangkat", col: "#67C23A", done: true },
      { label: "Pencahayaan", col: "#67C23A", done: true },
      { label: "Posisi", col: "#67C23A", done: true },
      { label: "Siap!", col: "#6B7280", done: false }
    ],
    f4Sub: "BMR · TDEE · Gemini RAG",
    f4Title: "Nutrisi & Pelatih AI",
    f4Desc: "Profil Anda membuka target kalori dinamis. Catat makanan, lihat perkembangan makro secara real-time, dan tanyakan apa pun tentang diet atau rencana latihan Anda kepada chatbot bertenaga Gemini kami.",
    howItWorksTag: "§ 02 — Cara Kerja",
    howItWorksTitle: "Tiga langkah menuju rutinitas yang lebih cerdas",
    howItWorksSteps: [
      { n: "01", col: "#67C23A", title: "Pengaturan Profil", body: "Masukkan usia, tinggi, berat badan, dan tujuan Anda. SmaCoFit menghitung BMR dan TDEE Anda secara tepat, menentukan tingkat kesulitan, dan membagi makro nutrisi yang sesuai." },
      { n: "02", col: "#67C23A", title: "Kalibrasi Ruangan", body: "Posisikan ponsel Anda dari samping. SmaCoFit memeriksa kecerahan ruangan, memastikan semua titik sendi tubuh terlihat, dan menyesuaikan frame rate otomatis sesuai kemampuan perangkat Anda." },
      { n: "03", col: "#67C23A", title: "Latihan dengan Umpan Balik Langsung", body: "Lakukan latihan sesuai rencana Anda. Model di perangkat melacak setiap repetisi, memberikan petunjuk suara dalam bahasa Indonesia ketika gerakan salah, serta mencatat durasi dan rekor latihan setelah selesai." }
    ],
    insightsTag: "§ 03 — Mesin Wawasan Kebugaran",
    insightsSub: "Pencarian Global & Pelacakan Tren",
    insightsDesc: "topik kebugaran penting yang dipantau terus-menerus untuk memperbarui basis pengetahuan RAG SmaCoFit.",
    insightsCtaSub: "JELAJAHI DATA",
    insightsCtaTitle: "Jelajahi tren",
    footerDesc: "AI di Perangkat · Kebugaran Cerdas · Nutrisi"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "id">("en");
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0D0F14] text-zinc-100 font-sans selection:bg-[#2A2F45]">

      <header className="sticky top-0 z-50 bg-[#0D0F14]/90 backdrop-blur-md border-b border-[#2A2F45]">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="text-sm font-bold text-white tracking-wider uppercase">
              SmaCoFit
            </span>
            <div className="border-l border-[#2A2F45] pl-3 sm:pl-4">
              <button
                onClick={() => setLang(lang === "en" ? "id" : "en")}
                className="flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors bg-[#1C2030]/30 border border-[#2A2F45] rounded px-2 py-0.5"
                title={lang === "en" ? "Switch to Indonesian" : "Ubah ke Bahasa Inggris"}
              >
                <Image
                  src={lang === "en" ? "/UK Flag.svg" : "/Indo Flag.webp"}
                  alt={lang === "en" ? "English" : "Indonesia"}
                  width={12}
                  height={8}
                  className="rounded-sm shrink-0"
                />
                <span className="uppercase font-bold">{lang}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/analytics" className="text-xs font-mono text-[#6B7280] hover:text-white transition-colors">
              {t.analytics}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-[#2A2F45] overflow-hidden min-h-[calc(100vh-3.5rem)] flex items-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "url('/Hero.png')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to right, #0D0F14 38%, #0D0F14bb 58%, transparent 82%)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
            style={{ background: "linear-gradient(to bottom, transparent, #0D0F14)" }}
          />

          <div className="relative container mx-auto max-w-5xl px-6 py-12 md:py-20 w-full">
            <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-10">
              {t.heroTag}
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white mb-10 max-w-3xl">
              {t.heroTitle}<br />
              {t.heroTitle2}<br />
              <span className="text-[#67C23A]">{t.heroTitle3}</span>
            </h1>

            <p className="text-base text-[#6B7280] leading-relaxed max-w-lg min-h-[120px] md:min-h-[80px]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-6">
          <section className="py-20 border-b border-[#2A2F45]">
            <div className="mb-16">
              <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-2">
                {t.featuresTag}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                {t.featuresTitle}
              </h2>
            </div>
            <div className="space-y-px">
              <div className="group relative overflow-hidden border border-[#2A2F45] rounded-t-3xl bg-[#0D0F14] hover:bg-[#0f1118] transition-colors duration-500 p-10 md:p-14">
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#67C23A]/5 blur-3xl" />
                <svg
                  viewBox="0 0 160 260"
                  className="absolute right-10 top-1/2 -translate-y-1/2 h-52 w-auto opacity-10 group-hover:opacity-20 transition-opacity duration-500 select-none pointer-events-none"
                  fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"
                >
                  <circle cx="80" cy="24" r="14" />
                  <line x1="80" y1="38" x2="80" y2="110" />
                  <line x1="80" y1="52" x2="28" y2="80" />
                  <line x1="80" y1="52" x2="132" y2="80" />
                  <line x1="28" y1="80" x2="14" y2="120" />
                  <line x1="132" y1="80" x2="146" y2="120" />
                  <line x1="80" y1="110" x2="50" y2="140" />
                  <line x1="80" y1="110" x2="110" y2="140" />
                  <line x1="50" y1="140" x2="40" y2="200" />
                  <line x1="40" y1="200" x2="36" y2="248" />
                  <line x1="110" y1="140" x2="120" y2="200" />
                  <line x1="120" y1="200" x2="124" y2="248" />
                  {[[80, 38], [80, 110], [28, 80], [132, 80], [14, 120], [146, 120], [50, 140], [110, 140], [40, 200], [120, 200]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#6B7280" stroke="none" />
                  ))}
                </svg>

                <div className="relative max-w-lg">
                  <span className="inline-block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-4 bg-[#1C2030]/50 border border-[#2A2F45] px-3 py-1 rounded-full">{t.f1Sub}</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">{t.f1Title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                    {t.f1Desc}
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {[["Push-Up", "#67C23A"], ["Sit-Up", "#67C23A"], ["Squat", "#67C23A"], ["Plank", "#67C23A"], ["Lunge", "#67C23A"]].map(([ex, col]: any) => (
                      <span key={ex} className="text-sm font-semibold" style={{ color: col }}>{ex}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden border border-[#2A2F45] border-t-0 bg-[#0D0F14] hover:bg-[#0f1118] transition-colors duration-500">
                <div className="md:grid md:grid-cols-2">
                  <div className="flex items-end justify-center gap-1.5 bg-[#080A0F] px-10 py-14 min-h-[180px] border-r border-[#2A2F45]">
                    {[40, 65, 32, 78, 55, 90, 42, 70, 58, 84, 36, 62, 48, 76, 52].map((h, i) => (
                      <div
                        key={i}
                        className="rounded-full w-2 bg-[#67C23A]/30 group-hover:bg-[#67C23A]/70 transition-all duration-300"
                        style={{
                          height: `${h}%`,
                          maxHeight: '80px',
                          minHeight: '6px',
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="p-10">
                    <span className="inline-block text-[10px] font-mono text-[#67C23A] tracking-widest uppercase mb-4 bg-[#67C23A]/10 px-3 py-1 rounded-full">{t.f2Sub}</span>
                    <h3 className="text-2xl font-extrabold text-white mb-3 leading-tight">{t.f2Title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {t.f2Desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden border border-[#2A2F45] border-t-0 bg-[#0D0F14] hover:bg-[#0f1118] transition-colors duration-500 p-10">
                <div className="mb-8">
                  <span className="inline-block text-[10px] font-mono text-[#67C23A] tracking-widest uppercase mb-4 bg-[#67C23A]/10 px-3 py-1 rounded-full">{t.f3Sub}</span>
                  <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">{t.f3Title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed max-w-md">
                    {t.f3Desc}
                  </p>
                </div>
                <div className="flex items-center gap-0 overflow-x-auto pb-1">
                  {t.f3Steps.map(({ label, col, done }, i, arr) => (
                    <div key={label} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shrink-0"
                          style={{
                            borderColor: col,
                            backgroundColor: done ? col : 'transparent',
                            color: done ? '#0D0F14' : col,
                          }}
                        >
                          {done ? '✓' : '→'}
                        </div>
                        <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: col }}>{label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="h-px w-10 md:w-16 mx-2 mb-5" style={{ backgroundColor: col + '55' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="group relative overflow-hidden border border-[#2A2F45] border-t-0 rounded-b-3xl bg-[#0D0F14] hover:bg-[#0f1118] transition-colors duration-500">
                <div className="md:grid md:grid-cols-2">
                  <div className="p-10 border-r border-[#2A2F45]">
                    <span className="inline-block text-[10px] font-mono text-[#67C23A] tracking-widest uppercase mb-4 bg-[#67C23A]/10 px-3 py-1 rounded-full">{t.f4Sub}</span>
                    <h3 className="text-2xl font-extrabold text-white mb-3 leading-tight">{t.f4Title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {t.f4Desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-center bg-[#080A0F] px-10 py-14 min-h-[180px]">
                    <div className="relative">
                      <svg viewBox="0 0 120 120" className="w-32 h-32" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#38BDF8" strokeWidth="12"
                          strokeDasharray="105.5 195.8" strokeDashoffset="0" strokeLinecap="round" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#67C23A" strokeWidth="12"
                          strokeDasharray="135.6 165.7" strokeDashoffset="-105.5" strokeLinecap="round" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#3d4461" strokeWidth="12"
                          strokeDasharray="60.3 241" strokeDashoffset="-241.1" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-white">Macros</span>
                        <span className="text-[10px] font-mono text-[#6B7280]">2 100 kcal</span>
                      </div>
                    </div>
                    <div className="ml-6 space-y-3">
                      {[["Protein", "35%", "#38BDF8"], ["Carbs", "45%", "#67C23A"], ["Fat", "20%", "#3d4461"]].map(([label, pct, col]: any) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
                          <span className="text-xs font-mono text-[#6B7280]">{label}</span>
                          <span className="text-xs font-bold text-white">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 border-b border-[#2A2F45]">
            <div className="mb-16">
              <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-2">
                {t.howItWorksTag}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                {t.howItWorksTitle}
              </h2>
            </div>

            <div className="space-y-0">
              {t.howItWorksSteps.map(({ n, col, title, body }) => (
                <div key={n} className="group grid md:grid-cols-[7rem_1fr] items-start gap-6 py-10 border-b border-[#2A2F45] last:border-0">
                  <span
                    className="text-[5rem] font-extrabold leading-none select-none transition-colors duration-300"
                    style={{ color: '#2A2F45' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = col)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#2A2F45')}
                  >
                    {n}
                  </span>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest mb-3 block" style={{ color: col }}>STEP {n}</span>
                    <h3 className="text-2xl font-extrabold text-white mb-3">{title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed max-w-xl">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-20">
            <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase mb-12">
              {t.insightsTag}
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 bg-[#1C2030]/20 border border-[#2A2F45] rounded-3xl p-8 md:p-12">
              <div>
                <p className="text-[#6B7280] text-sm font-mono mb-3">{t.insightsSub}</p>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[5rem] md:text-[7rem] font-extrabold leading-none text-white tracking-tighter">
                    19
                  </span>
                  <div className="text-[#6B7280] text-sm leading-relaxed max-w-xs">
                    {t.insightsDesc}
                  </div>
                </div>

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

              <Link
                href="/analytics"
                className="group flex items-center gap-4 border border-[#2A2F45] hover:border-[#67C23A] rounded-2xl px-7 py-5 transition-all duration-300 hover:bg-[#67C23A]/5 shrink-0"
              >
                <div className="text-left">
                  <span className="block text-xs font-mono text-[#6B7280] mb-0.5">{t.insightsCtaSub}</span>
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {t.insightsCtaTitle}
                  </span>
                </div>
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
          <span className="text-xs font-mono text-[#2A2F45]">© 2026 SmaCoFit App</span>
          <span className="text-xs font-mono text-[#2A2F45]">{t.footerDesc}</span>
        </div>
      </footer>
    </div>
  );
}

