"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Search, Info, TrendingUp, BarChart3, Activity } from "lucide-react";
import {
  parseWikiData,
  getTop10Topics,
  getTop5TrendingList,
  getMonthlyTrends,
  getCorrelationMatrix,
  getTrendingOverTime,
  type WikiDataPoint,
} from "@/lib/analytics-utils";

type Timeframe = "7d" | "30d" | "1y" | "5y";

const CHART_COLORS = ["#67C23A", "#7C6AF7", "#409EFF", "#E6A23C", "#F56C6C"];

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  "7d": "7D",
  "30d": "30D",
  "1y": "1Y",
  "5y": "5Y",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono text-[#6B7280] tracking-widest uppercase mb-4">
      {children}
    </p>
  );
}

export function AnalyticsSection() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dataPoints, setDataPoints] = React.useState<WikiDataPoint[]>([]);
  const [descriptions, setDescriptions] = React.useState<Record<string, string>>({});
  const [timeframe, setTimeframe] = React.useState<Timeframe>("30d");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/wiki_trends.json");
        if (!res.ok) throw new Error("Failed to fetch trends data");
        const json = await res.json();
        const { df, descriptions: desc } = parseWikiData(json);
        setDataPoints(df);
        setDescriptions(desc);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading analytics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const top10 = React.useMemo(() => getTop10Topics(dataPoints), [dataPoints]);
  const top5Names = React.useMemo(() => getTop5TrendingList(dataPoints), [dataPoints]);
  const top10Names = React.useMemo(() => top10.map((t) => t.article), [top10]);

  const trendData = React.useMemo(() => {
    if (!dataPoints.length || !top5Names.length) return [];
    if (timeframe === "7d") return getTrendingOverTime(dataPoints, 7, top5Names);
    if (timeframe === "30d") return getTrendingOverTime(dataPoints, 30, top5Names);
    if (timeframe === "1y") return getTrendingOverTime(dataPoints, 365, top5Names);
    return getMonthlyTrends(dataPoints, top5Names);
  }, [dataPoints, timeframe, top5Names]);

  const correlation = React.useMemo(() => {
    if (!dataPoints.length || !top10Names.length) return { columns: [], matrix: [] };
    return getCorrelationMatrix(dataPoints, top10Names);
  }, [dataPoints, top10Names]);

  const formatXAxis = (tickItem: string) => {
    if (timeframe === "5y") {
      const [year, month] = tickItem.split("-");
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("en-US", { month: "short" });
      return `${monthName} ${year.slice(2)}`;
    }
    return new Date(tickItem).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredDescriptions = React.useMemo(() => {
    return Object.entries(descriptions).filter(([topic, desc]) =>
      topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [descriptions, searchQuery]);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#0D0F14",
      borderRadius: "8px",
      border: "1px solid #2A2F45",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      fontSize: "12px",
    },
    labelStyle: { color: "#6B7280", fontWeight: 600, marginBottom: 4 },
    itemStyle: { color: "#e4e4e7", padding: "1px 0" },
  };

  if (loading) {
    return (
      <div className="space-y-0 animate-pulse">
        {[430, 480].map((h, i) => (
          <div key={i} className="border-b border-[#2A2F45] py-10">
            <div className="h-3 w-32 bg-[#1C2030] rounded mb-6" />
            <div style={{ height: h }} className="bg-[#1C2030] rounded-xl border border-[#2A2F45]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[#2A2F45] rounded-xl p-10 text-center">
        <Info className="mx-auto mb-3 text-[#F56C6C]" size={28} />
        <p className="font-mono text-sm text-zinc-300">Failed to load trends data</p>
        <p className="text-xs text-[#6B7280] mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>

      {/* ── CHART 1: INTEREST OVER TIME ─────────────────── */}
      <div className="border-b border-[#2A2F45] pb-14 mb-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <SectionLabel>
              <TrendingUp size={10} className="inline mr-1.5 mb-0.5" />
              Interest Over Time
            </SectionLabel>
            <p className="text-xl font-bold tracking-tight text-white">
              Top 5 topics by search trend
            </p>
            <p className="text-xs text-[#6B7280] mt-1">Wikipedia daily pageviews</p>
          </div>

          {/* Timeframe toggle */}
          <div className="flex gap-1 self-start border border-[#2A2F45] rounded-lg p-1 bg-[#0D0F14]">
            {(["7d", "30d", "1y", "5y"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  timeframe === t
                    ? "bg-[#7C6AF7] text-white"
                    : "text-[#6B7280] hover:text-zinc-300"
                }`}
              >
                {TIMEFRAME_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Legend as colored mono tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          {top5Names.map((name, i) => (
            <span key={name} className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B7280]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              {name}
            </span>
          ))}
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2A2F45" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatXAxis}
                tick={{ fill: "#6B7280", fontSize: 11, fontFamily: "monospace" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                tick={{ fill: "#6B7280", fontSize: 11, fontFamily: "monospace" }}
                width={36}
              />
              <Tooltip {...tooltipStyle} />
              {top5Names.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHART 2: MOST RESEARCHED ────────────────────── */}
      <div className="border-b border-[#2A2F45] pb-14 mb-14">
        <SectionLabel>
          <BarChart3 size={10} className="inline mr-1.5 mb-0.5" />
          Most Researched
        </SectionLabel>
        <p className="text-xl font-bold tracking-tight text-white mb-1">
          Top 10 topics by average daily views
        </p>
        <p className="text-xs text-[#6B7280] mb-8">All-time average across collected data</p>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10} layout="vertical" margin={{ left: 0, right: 16 }}>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                tick={{ fill: "#6B7280", fontSize: 11, fontFamily: "monospace" }}
              />
              <YAxis
                dataKey="article"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                width={100}
              />
              <Tooltip
                {...tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C6AF7" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#67C23A" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <Bar dataKey="avgViews" fill="url(#barGrad)" radius={[0, 4, 4, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHART 3: CORRELATION MATRIX ─────────────────── */}
      <div className="border-b border-[#2A2F45] pb-14 mb-14">
        <SectionLabel>
          <Activity size={10} className="inline mr-1.5 mb-0.5" />
          Correlation Matrix
        </SectionLabel>
        <p className="text-xl font-bold tracking-tight text-white mb-1">
          Do these topics trend together?
        </p>
        <div className="flex items-center gap-4 mb-8">
          <p className="text-xs text-[#6B7280]">Pearson coefficient — −1 to +1</p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#6B7280]">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-[#F56C6C]/60" /> negative
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-[#67C23A]/60" /> positive
            </span>
          </div>
        </div>

        {correlation.columns.length > 0 && (
          <div className="overflow-x-auto">
            <table className="border-collapse text-center" style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th className="w-20 p-1" />
                  {correlation.columns.map((col) => (
                    <th
                      key={col}
                      className="p-1 font-mono font-normal text-[#6B7280] cursor-default"
                      style={{ fontSize: 9 }}
                      title={col}
                    >
                      {col.slice(0, 6)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlation.matrix.map((row, i) => {
                  const rowName = correlation.columns[i];
                  return (
                    <tr key={rowName}>
                      <td
                        className="text-left font-mono text-zinc-400 p-1 truncate cursor-default pr-3"
                        style={{ fontSize: 10, maxWidth: 80 }}
                        title={rowName}
                      >
                        {rowName}
                      </td>
                      {row.map((val, j) => {
                        const colName = correlation.columns[j];
                        let bg = "rgba(42,47,69,0.3)";
                        let color = "#52525b";
                        if (val > 0) {
                          bg = `rgba(103,194,58,${(val * 0.85).toFixed(2)})`;
                          color = val > 0.45 ? "#ffffff" : "#d4d4d8";
                        } else if (val < 0) {
                          bg = `rgba(245,108,108,${(Math.abs(val) * 0.85).toFixed(2)})`;
                          color = Math.abs(val) > 0.45 ? "#ffffff" : "#d4d4d8";
                        }
                        return (
                          <td
                            key={colName}
                            className="h-8 w-8 font-mono font-semibold select-none rounded-[3px]"
                            style={{ backgroundColor: bg, color, fontSize: 9 }}
                          >
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── GLOSSARY: TOPIC DEFINITIONS ─────────────────── */}
      <div>
        <SectionLabel>
          <Info size={10} className="inline mr-1.5 mb-0.5" />
          Topic Definitions
        </SectionLabel>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xl font-bold tracking-tight text-white mb-1">
              Fitness term glossary
            </p>
            <p className="text-xs text-[#6B7280]">Descriptions sourced from Wikipedia</p>
          </div>

          {/* Search */}
          <div className="relative md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={14} />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#2A2F45] text-zinc-200 placeholder:text-[#6B7280] rounded-lg py-2 pl-9 pr-4 text-xs font-mono focus:outline-none focus:border-[#7C6AF7] transition-colors"
            />
          </div>
        </div>

        {filteredDescriptions.length > 0 ? (
          <div className="divide-y divide-[#2A2F45]">
            {filteredDescriptions.map(([topic, desc]) => (
              <div key={topic} className="py-5 group">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-mono text-[10px] text-[#6B7280] w-4 select-none">—</span>
                  <h4 className="font-bold text-sm text-zinc-100">{topic}</h4>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed pl-7">
                  {desc || "No description available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs text-[#6B7280] py-10 text-center">
            No matching topics found.
          </p>
        )}
      </div>

    </div>
  );
}
