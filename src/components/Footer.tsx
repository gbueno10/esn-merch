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
    <footer className="bg-white border-t border-slate-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Image src="/esn-logo.png" alt="ESN Porto Store" width={110} height={48} className="object-contain" />
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              More than merch — a way to carry your Erasmus with you.
              Every piece tells a story from your time in Porto.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-esn-dark-blue hover:border-esn-dark-blue transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Explore
            </p>
            <ul className="space-y-2">
              {links.explore.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-esn-dark-blue transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-xs text-slate-500 hover:text-esn-dark-blue transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Help
            </p>
            <ul className="space-y-2">
              {links.help.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-slate-500 hover:text-esn-dark-blue transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            © {new Date().getFullYear()} ESN Porto. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[10px] text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[10px] text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
