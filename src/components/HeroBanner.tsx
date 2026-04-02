"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  accent: string;
};

const slides: Slide[] = [
  {
    id: 1,
    label: "ESN Porto",
    title: "Your Erasmus,\nYour Merch",
    subtitle: "Official gear for international students in Porto. Made for the experience.",
    cta: "See what's in",
    href: "#merch",
    bg: "bg-esn-dark-blue",
    accent: "bg-esn-cyan",
  },
  {
    id: 2,
    label: "ESN Porto Store",
    title: "Wear the\nMemory",
    subtitle: "Hoodies, tees and more — take a piece of Porto back home.",
    cta: "Take a look",
    href: "#merch",
    bg: "bg-esn-cyan",
    accent: "bg-esn-magenta",
  },
  {
    id: 3,
    label: "2025 – 26",
    title: "This Year's\nDrops",
    subtitle: "Exclusive items for this academic year. Once they're gone, they're gone.",
    cta: "See the drops",
    href: "#merch",
    bg: "bg-esn-magenta",
    accent: "bg-esn-orange",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <div
      className={`relative overflow-hidden ${slide.bg} transition-colors duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-24 -left-12 w-80 h-80 rounded-full bg-white/5" />
      <div className={`absolute top-8 right-24 w-3 h-3 rounded-full ${slide.accent} opacity-60`} />
      <div className={`absolute bottom-12 left-32 w-2 h-2 rounded-full ${slide.accent} opacity-40`} />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">
            {slide.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight whitespace-pre-line mb-4">
            {slide.title}
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 bg-white text-esn-dark-blue font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
