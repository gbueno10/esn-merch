"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="-mt-16 relative w-full h-[80vh] min-h-[500px] overflow-hidden bg-neutral-900">
      {/* Hero photo — desktop */}
      <Image
        src="/IMG_0877.png"
        alt="ESN Porto students wearing merch"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-[center_30%] hidden sm:block"
      />
      {/* Hero photo — mobile */}
      <Image
        src="/IMG_0877_mobile.png"
        alt="ESN Porto students wearing merch"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center sm:hidden"
      />

      {/* Color tint overlay */}
      <div className="absolute inset-0 bg-esn-dark-blue/25 mix-blend-multiply" />

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
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-white uppercase mb-5 tracking-wide">
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
              className="inline-flex items-center gap-2.5 bg-esn-cyan text-white font-bold text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 rounded-full hover:bg-[#009fd6] active:scale-[0.98] transition-all group"
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

    </section>
  );
}
