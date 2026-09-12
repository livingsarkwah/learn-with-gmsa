import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { BookOpen, User, ArrowRight, Shield, CheckCircle, Award, FolderOpen, GraduationCap, BookMarked, Users } from "lucide-react";
import { MONO, SANS } from "../../utils";

export function LoginPage() {
  const navigate = useNavigate();
  type Step = "id" | "otp" | "success";
  const [step, setStep]           = useState<Step>("id");
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  function submitId(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{8,10}$/.test(studentId)) { setError("Enter a valid Student ID (8–10 digits)."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  }

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.join("").length !== 6) { setError("Enter the complete 6-digit OTP."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 1200);
  }

  return (
    <div className="min-h-screen flex" style={SANS}>
      {/* Left brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #052e16 0%, #14532d 40%, #166534 70%, #16a34a 100%)" }}>
        {[280, 220, 160].map((size, i) => (
          <div key={i} className="absolute rounded-full border border-white/5"
            style={{ width: size, height: size, bottom: -size / 4, right: -size / 4 }} />
        ))} 
        <div className="relative space-y-6">
          <div>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">Your gateway to academic excellence.</h2>
            <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-sm">Access 10,000+ curated resources across all of KNUST's programs.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <FolderOpen className="w-4 h-4" />, v: "10,000+", l: "Resources" },
              { icon: <GraduationCap className="w-4 h-4" />, v: "90+", l: "Programs" },
              { icon: <BookMarked className="w-4 h-4" />, v: "4000+", l: "Courses" },
              { icon: <Users className="w-4 h-4" />, v: "12k+", l: "Students" },
            ].map(({ icon, v, l }) => (
              <div key={l} className="bg-white/10 rounded-xl p-3">
                <div className="text-yellow-300 mb-1">{icon}</div>
                <p className="font-black text-white text-lg" style={MONO}>{v}</p>
                <p className="text-white/50 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-background">
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-xl shadow-primary/30 mb-3">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-black text-xl text-foreground"><span className="text-primary">Learn</span> with GMSA</h1>
          <p className="text-xs text-muted-foreground mt-0.5">KNUST Academic Resource Hub</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
            {step !== "success" && (
              <div className="flex border-b border-border">
                {(["id", "otp"] as const).map((s, i) => {
                  const isActive = step === s;
                  const isDone   = s === "id" && step === "otp";
                  return (
                    <div key={s} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 ${isActive ? "border-primary text-primary bg-primary/5" : isDone ? "border-transparent text-muted-foreground" : "border-transparent text-muted-foreground/40"}`}>
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${isActive ? "bg-primary text-white" : isDone ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                        {isDone ? <CheckCircle className="w-3 h-3" /> : i + 1}
                      </span>
                      {s === "id" ? "Student ID" : "Verify OTP"}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-6 sm:p-8">
              {step === "id" && (
                <form onSubmit={submitId} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Sign in</h2>
                    <p className="text-sm text-muted-foreground mt-1">Enter your KNUST Student ID to get started.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student ID</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="text" value={studentId} onChange={e => setStudentId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="e.g. 2067XXXXX"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary tracking-widest" style={MONO} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">8–10 digit student number (numbers only)</p>
                  </div>
                  {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Request OTP <ArrowRight className="w-4 h-4" /></>}

                  </button>
                  <p className="text-center text-xs text-muted-foreground">Not a member?
                    <a href="https://gmsaknust.org/membership/register"
                      className="text-primary font-bold hover:underline"
                      target="_blank" rel="noopener noreferrer">
                        Request GMSA membership
                    </a>
                  </p>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={submitOtp} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Verify identity</h2>
                    <p className="text-sm text-muted-foreground mt-1">A 6-digit OTP was sent to the phone number linked to <span className="font-bold text-foreground" style={MONO}>{studentId}</span>.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">One-Time Password</label>
                    <div className="flex gap-1 justify-center">
                      {otp.map((digit, i) => (
                        <input key={i} ref={el => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKey(i, e)}
                          className="w-10 h-10 text-center text-lg font-black bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" style={MONO} />
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">OTP expires in 10 minutes</p>
                  </div>
                  {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Sign In <Shield className="w-4 h-4" /></>}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">Didn't receive it? <button type="button" onClick={() => setOtp(["","","","","",""])} className="text-primary font-bold hover:underline">Resend OTP</button></p>
                </form>
              )}

              {step === "success" && (
                <div className="text-center py-2 space-y-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20" style={{ background: "linear-gradient(135deg, #15803d, #22c55e)" }}>
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground mb-1">Welcome back!</h2>
                    <p className="text-sm text-muted-foreground">Signed in as <span className="font-bold text-foreground" style={MONO}>{studentId}</span></p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-4 text-left">
                    <p className="text-sm font-bold text-secondary-foreground mb-1">GMSA Member Access Unlocked</p>
                    <p className="text-xs text-muted-foreground">Full access to all resources, downloads, and member-only content is now active.</p>
                  </div>
                  <button onClick={() => navigate("/library")} className="w-full py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    Go to Library <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-5 opacity-60">Secured by IT&Media, GMSA-KNUST</p>
        </div>
      </div>
    </div>
  );
}
