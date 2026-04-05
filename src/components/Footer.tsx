import Link from "next/link";
import Image from "next/image";
import { Instagram, Globe } from "lucide-react";

const links = {
  explore: [
    { label: "Merch", href: "/#merch" },
    { label: "About ESN Porto", href: "https://esnporto.org", external: true },
    { label: "Upcoming events", href: "https://esnporto.org/events", external: true },
  ],
  help: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Shipping info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Contact us", href: "mailto:store@esnporto.org" },
  ],
};

const socials = [
  { label: "Instagram", href: "https://instagram.com/esnporto", icon: Instagram },
  { label: "Website", href: "https://esnporto.org", icon: Globe },
];

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Image
              src="/esn-logo.png"
              alt="ESN Porto Store"
              width={100}
              height={44}
              className="object-contain brightness-0 invert opacity-90"
            />
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              More than merch — a way to carry your Erasmus with you.
              Every piece tells a story from your time in Porto.
            </p>

            <div className="flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/40 hover:text-esn-cyan hover:border-esn-cyan/40 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">
              Explore
            </p>
            <ul className="space-y-2.5">
              {links.explore.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/45 hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-white/45 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">
              Help
            </p>
            <ul className="space-y-2.5">
              {links.help.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/20 uppercase tracking-wider">
            © {new Date().getFullYear()} ESN Porto. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[10px] text-white/20 hover:text-white/50 uppercase tracking-wider transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[10px] text-white/20 hover:text-white/50 uppercase tracking-wider transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
