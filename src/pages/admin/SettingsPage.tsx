import { useState } from "react";
import { Save, Shield, Bell, Globe, Database, CheckCircle } from "lucide-react";
import { SANS } from "../../utils";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6" style={SANS}>
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? "bg-primary" : "bg-slate-200 dark:bg-slate-600"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4.5" : ""}`} />
    </button>
  );
}

export function SettingsPage() {
  const [platformName, setPlatformName] = useState("Learn with GMSA");
  const [institution, setInstitution]   = useState("Kwame Nkrumah University of Science and Technology");
  const [guestAccess, setGuestAccess]   = useState(true);
  const [otpEnabled, setOtpEnabled]     = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [emailNotif, setEmailNotif]     = useState(true);
  const [uploadAlert, setUploadAlert]   = useState(false);
  const [savedMsg, setSavedMsg]         = useState(false);

  function handleSave() {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  }

  return (
    <div className="max-w-2xl space-y-6" style={SANS}>
      {/* Platform settings */}
      <Section title="Platform Settings" icon={Globe}>
        <Field label="Platform Name" desc="Displayed in the header and browser tab">
          <input value={platformName} onChange={e => setPlatformName(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </Field>
        <Field label="Institution" desc="University or organisation name">
          <input value={institution} onChange={e => setInstitution(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </Field>
        <Field label="Guest Access" desc="Allow unauthenticated users to browse resources">
          <Toggle value={guestAccess} onChange={setGuestAccess} />
        </Field>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <Field label="OTP Verification" desc="Require OTP for all member logins">
          <Toggle value={otpEnabled} onChange={setOtpEnabled} />
        </Field>
        <Field label="Session Timeout" desc="Automatically log out inactive sessions (minutes)">
          <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
            {["15", "30", "60", "120", "240"].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Field label="Email Notifications" desc="Send email alerts to administrators for key events">
          <Toggle value={emailNotif} onChange={setEmailNotif} />
        </Field>
        <Field label="Upload Alerts" desc="Notify admin when a new resource is uploaded for review">
          <Toggle value={uploadAlert} onChange={setUploadAlert} />
        </Field>
      </Section>

      {/* Storage */}
      <Section title="Storage" icon={Database}>
        <Field label="Max File Size" desc="Maximum upload size per resource">
          <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30">
            {["50 MB", "100 MB", "200 MB", "500 MB"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Allowed Formats" desc="File types accepted for resource uploads">
          <div className="flex flex-wrap gap-2">
            {["PDF", "MP4", "DOCX", "PPTX", "XLSX", "PNG"].map(fmt => (
              <span key={fmt} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold">{fmt}</span>
            ))}
          </div>
        </Field>
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
          {savedMsg ? <><CheckCircle className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
        </button>
        {savedMsg && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Settings saved successfully.</span>}
      </div>
    </div>
  );
}
