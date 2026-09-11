import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, AlertCircle, Eye, EyeOff, BookMarked } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { MONO, SANS } from "../../utils";

export function AdminLoginPage() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [attempts, setAttempts]   = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) { setError("Please enter the admin password."); return; }

    setLoading(true);
    setError("");

    // Simulate a brief network delay for realism
    setTimeout(() => {
      const ok = adminLogin(password);
      setLoading(false);
      if (ok) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setPassword("");
        if (next >= 3) {
          setError("Too many failed attempts. Please contact your system administrator.");
        } else {
          setError(`Incorrect password. ${3 - next} attempt${3 - next !== 1 ? "s" : ""} remaining.`);
        }
      }
    }, 800);
  }

  const locked = attempts >= 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4" style={SANS}>
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl shadow-primary/40"
            style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
          >
            <BookMarked className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Learn with GMSA</h1>
          <p className="text-sm text-slate-400 mt-1">Admin Panel — Restricted Access</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Security badge */}
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/60 border-b border-slate-700/60">
            <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs text-slate-400 font-medium">This area is restricted to authorised administrators only</span>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-black text-white mb-1">Administrator Sign In</h2>
            <p className="text-sm text-slate-400 mb-6">Enter your admin password to access the dashboard.</p>

            {locked ? (
              <div className="bg-red-950/60 border border-red-800/60 rounded-2xl p-4 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-sm font-bold text-red-300">Account Locked</p>
                <p className="text-xs text-red-400">Too many failed attempts. Contact your system administrator.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Admin Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      disabled={loading}
                      className="w-full pl-10 pr-10 py-3 text-sm bg-slate-800 rounded-xl border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/60 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="w-full py-3 font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #15803d, #16a34a)", color: "white" }}
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</>
                    : <><Shield className="w-4 h-4" />Sign In to Admin Panel</>
                  }
                </button>
              </form>
            )}

            {/* Demo hint */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-600 text-center">
                Demo password:{" "}
                <button
                  onClick={() => setPassword("gmsa-admin-2024")}
                  className="font-bold text-slate-500 hover:text-slate-400 transition-colors"
                  style={MONO}
                >
                  gmsa-admin-2024
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-5">
          Unauthorised access is strictly prohibited and may be subject to legal action.
        </p>
      </div>
    </div>
  );
}
