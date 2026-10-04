"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    category: "AI & Behavioral",
    categoryColor: "#FF914D",
    title: "If AI Does the SDR Work, Where Do Tomorrow's Enterprise Account Executives Come From?",
    excerpt:
      "How generative intelligence is compressing junior prospecting roles and redefining what sales qualification will look like across Fortune 500 revenue organizations.",
    readTime: "5 min read",
    date: "Oct 2026",
    featured: true,
  },
  {
    id: "2",
    category: "Intent Telemetry",
    categoryColor: "#34FEFF",
    title: "The Best In-Market Buyer Might Not Have A Form Fill: The Rise of Dark Funnel Signals",
    excerpt:
      "Why over 70% of enterprise buying committees evaluate architecture documentation and pricing calculators in total anonymity before ever requesting a demo.",
    readTime: "4 min read",
    date: "Sep 2026",
  },
  {
    id: "3",
    category: "Revenue Architecture",
    categoryColor: "#38B6FF",
    title: "Signal-to-Action Latency: Why Response Within 90 Seconds Yields 9x Higher Win Rates",
    excerpt:
      "Empirical analysis of 1.2M B2B buying interactions showing how intent decays by 80% after the first hour of prospect departure.",
    readTime: "6 min read",
    date: "Sep 2026",
  },
  {
    id: "4",
    category: "Enterprise Security",
    categoryColor: "#F2BE01",
    title: "Zero-Cookie Tracking: How Modern Telemetry Operates Under Safari ITP and GDPR",
    excerpt:
      "Technical deep-dive into first-party edge-fingerprinting and cryptographic tokenization for privacy-first revenue intelligence.",
    readTime: "7 min read",
    date: "Aug 2026",
  },
];

const CATEGORIES = ["All", "AI & Behavioral", "Intent Telemetry", "Revenue Architecture", "Enterprise Security"];

export function InsightsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-[#121212] light:bg-[#f7f7f7] border-t border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 light:bg-black/5 border border-white/10 light:border-black/10 text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38b6ff]" />
              <span>Editorial Intelligence</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
              Our Latest News &amp; Insights
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-white light:bg-[#121212] text-[#121212] light:text-white font-bold shadow-sm"
                      : "bg-[#1e2224] light:bg-white text-slate-400 light:text-[#6c7377] border border-white/10 light:border-black/10 hover:text-white light:hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col justify-between p-7 rounded-[20px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 hover:border-white/25 light:hover:border-black/25 transition-all group hover:-translate-y-1 shadow-sm"
            >
              <div>
                {/* Category badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 light:bg-black/5"
                    style={{ color: article.categoryColor }}
                  >
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 light:text-[#787e82]">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white light:text-[#121212] tracking-tight mb-3 group-hover:text-[#38b6ff] transition-colors line-clamp-3">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-300 light:text-[#5a6266] leading-relaxed line-clamp-3 mb-6">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Read link */}
              <div className="pt-4 border-t border-white/10 light:border-black/10 flex items-center justify-between text-xs font-mono text-slate-400 light:text-[#787e82]">
                <span>{article.date}</span>
                <span className="flex items-center gap-1 text-[#38b6ff] light:text-[#0284c7] font-semibold group-hover:translate-x-0.5 transition-transform">
                  Read Article <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
