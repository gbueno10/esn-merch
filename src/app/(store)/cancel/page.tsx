import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden w-full max-w-sm">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-400" />
        <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-slate-100" />
          ))}
        </div>

        <div className="pl-6 p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-400">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Payment cancelled
            </p>
            <h1 className="text-lg font-bold text-slate-900">No worries</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Your order wasn't completed. Your items are still in your bag.
            </p>
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
