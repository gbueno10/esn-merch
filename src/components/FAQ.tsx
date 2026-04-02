"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-1">
          Got questions?
        </p>
        <h2 className="text-2xl font-bold text-esn-dark-blue">FAQ</h2>
        <p className="text-sm text-slate-500 mt-2">
          Everything you need to know about ordering and picking up your merch.
        </p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-esn-orange/5 border border-esn-orange/15 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-100/50 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
