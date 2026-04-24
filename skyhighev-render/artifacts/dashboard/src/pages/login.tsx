import React, { useState } from "react";
import { useAuth, useTotpTimer } from "@/lib/auth-context";
import { Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, Settings } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const { login, isSetup, totpCode, autoTotpEnabled, config } = useAuth();
  const totpTimeLeft = useTotpTimer();
  const [, setLocation] = useLocation();

  const [adminKey, setAdminKey] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!adminKey) { setError("Admin Key is required."); return; }
    if (!autoTotpEnabled && !manualCode) { setError("Enter your 2FA code."); return; }
    setLoading(true);
    setError("");
    const result = await login(adminKey, autoTotpEnabled ? undefined : manualCode);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Connection failed.");
    } else {
      setLocation("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConnect();
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
      <div className="w-full max-w-sm" onKeyDown={handleKeyDown}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.svg" alt="CTRL.PNL" className="w-9 h-9 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }} />
          <div>
            <div className="text-white font-bold text-lg leading-none tracking-tight">CTRL.PNL</div>
            <div className="text-white/30 text-[11px] font-mono mt-0.5">v2.0 — restricted access</div>
          </div>
        </div>

        {/* Not setup warning */}
        {!isSetup && (
          <div className="mb-4 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-300 text-xs">
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            <span>
              API not configured yet.{" "}
              <button onClick={() => setLocation("/config")} className="underline font-semibold hover:text-amber-200">
                Go to Config
              </button>{" "}to set up your API URL, Worker Key, and TOTP Secret first.
            </span>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6 flex flex-col gap-5">
          <div>
            <h1 className="text-white font-semibold text-base">Admin Login</h1>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Enter your Admin Key to access the control panel.
            </p>
          </div>

          {/* Admin Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono font-semibold tracking-widest text-cyan-400/80 uppercase">
              Admin Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="ADM-…"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* 2FA Code */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono font-semibold tracking-widest text-cyan-400/80 uppercase">
              2FA Code
            </label>
            {autoTotpEnabled ? (
              <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-md px-4 py-2.5">
                <span className="text-2xl font-mono font-bold text-violet-300 tracking-[0.4em] flex-1">
                  {totpCode || "······"}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-500">Auto</span>
                  <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(totpTimeLeft / 30) * 100}%`,
                        background: totpTimeLeft <= 5 ? '#ef4444' : 'linear-gradient(to right, #8b5cf6, #a78bfa)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all tracking-[0.4em] text-center"
              />
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-red-400 text-xs">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={loading || !isSetup}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 font-semibold text-sm py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" />Connecting…</>
            ) : (
              <><ShieldCheck size={14} />Login</>
            )}
          </button>
        </div>

        <button
          onClick={() => setLocation("/config")}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-white/20 hover:text-white/40 text-[11px] transition-colors"
        >
          <Settings size={11} />
          Configure API Server
        </button>
      </div>
    </div>
  );
}
