"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="-mt-16 relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-900">
      {/* Hero photo */}
      <Image
        src="/IMG_0877.png"
        alt="ESN Porto students wearing merch"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />

      {/* Gradient layers for editorial depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      {/* Content — anchored to bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full pb-14 sm:pb-20">

          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-esn-cyan" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-esn-cyan">
              ESN Porto — Official Merch
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.88] text-white uppercase mb-5 tracking-wide">
            Wear the
            <br />
            <span className="text-esn-cyan">Experience</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-9 max-w-xs sm:max-w-sm">
            Official gear for Erasmus students in Porto.
            Quality hoodies, tees and accessories for your exchange.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="#merch"
              className="inline-flex items-center gap-2.5 bg-esn-cyan text-white font-bold text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 hover:bg-[#009fd6] active:scale-[0.98] transition-all group"
            >
              Shop the drop
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <span className="text-[10px] text-white/30 uppercase tracking-wider">
              Free pickup · ESN Porto office
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
        <div
          className="w-px bg-white/30"
          style={{ height: "36px", animation: "scroll-pulse 2.2s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
