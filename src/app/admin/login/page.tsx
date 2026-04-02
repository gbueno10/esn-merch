"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Loader2, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/esn-logo.png"
            alt="ESN Porto"
            width={96}
            height={40}
            className="object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-esn-dark-blue">Admin Panel</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage inventory and sales
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-esn-dark-blue/20 focus:border-esn-dark-blue transition-colors"
              placeholder="you@esnporto.org"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-esn-dark-blue/20 focus:border-esn-dark-blue transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full bg-esn-dark-blue text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-esn-dark-blue/90 active:scale-[0.98] transition-all disabled:opacity-60 uppercase tracking-wide"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
