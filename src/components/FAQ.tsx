"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I pick up my order?",
    answer:
      "All orders are collected at the ESN Porto office. After checkout you'll receive a confirmation email — just bring it with you and we'll have your merch ready!",
  },
  {
    question: "Can I buy merch directly at the office?",
    answer:
      "Yes! You're welcome to drop by the ESN Porto office and grab merch in person. We accept card and cash. Check our Instagram for office hours.",
  },
  {
    question: "Is there shipping available?",
    answer:
      "For now, we only offer office pickup. We're a student-run association and want to keep costs down for everyone. Come say hi!",
  },
  {
    question: "Can I exchange or return an item?",
    answer:
      "Of course. If the size doesn't fit or something's wrong, bring it back to the office within 14 days and we'll sort it out.",
  },
  {
    question: "Do I need to be an Erasmus student to buy?",
    answer:
      "Not at all! Our merch is for everyone who loves Porto and the Erasmus spirit. Friends, locals, alumni — all welcome.",
  },
  {
    question: "How do I know my size?",
    answer:
      "Our clothing is unisex and runs true to European sizing. If you're unsure, pass by the office and try one on before ordering.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left label */}
          <div className="lg:col-span-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              Got questions?
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-esn-dark-blue uppercase tracking-wide leading-none mb-4">
              FAQ
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Everything you need to know about ordering and picking up your merch.
            </p>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-2 divide-y divide-slate-200">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-sm font-semibold text-slate-800 pr-8 group-hover:text-esn-dark-blue transition-colors">
                      {faq.question}
                    </span>
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-esn-dark-blue transition-colors">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ${
                      isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
