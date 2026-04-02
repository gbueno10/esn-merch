import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { CheckCircle2 } from "lucide-react";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerEmail: string | null = null;
  let amountTotal: number | null = null;
  let currency: string | null = null;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      customerEmail =
        typeof session.customer_details?.email === "string"
          ? session.customer_details.email
          : null;
      amountTotal = session.amount_total;
      currency = session.currency;
    } catch {
      // invalid session — show generic message
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <ClearCartOnSuccess />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden w-full max-w-sm">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-esn-green" />
        <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-slate-100" />
          ))}
        </div>

        <div className="pl-6 p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-esn-green/10 rounded-full flex items-center justify-center text-esn-green">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Order confirmed
            </p>
            <h1 className="text-lg font-bold text-slate-900">You're all set!</h1>
            {customerEmail && (
              <p className="text-xs text-slate-500 mt-1">
                Confirmation sent to{" "}
                <span className="font-semibold text-slate-700">{customerEmail}</span>
              </p>
            )}
            {amountTotal != null && currency && (
              <p className="text-xs text-slate-500 mt-0.5">
                Total:{" "}
                <span className="font-bold text-esn-dark-blue">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency.toUpperCase(),
                  }).format(amountTotal / 100)}
                </span>
              </p>
            )}
          </div>

          <Link
            href="/"
            className="h-12 w-full border border-slate-200 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors uppercase tracking-wide"
          >
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
