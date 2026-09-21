import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { ADMIN_STATS } from "../../constants/data";
import { MONO, SANS } from "../../utils";
import { Download, FolderOpen } from "lucide-react";
import { useRealtimeAnalytics } from "../../hooks/useRealtimeAnalytics";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5" style={SANS}>
      <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{title}</h2>
      {children}
    </div>
  );
}

function StatBadge({ label, value, icon: Icon, color, sub }: {
  label: string; value: string; icon: React.ElementType; color: string; sub: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5" style={SANS}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white" style={MONO}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{sub}</p>
    </div>
  );
}

export function AnalyticsPage() {
  const { totalDownloads, monthlyActivity, newResources, topCourses, topCategories } = useRealtimeAnalytics();

  return (
    <div className="space-y-6" style={SANS}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBadge label="Total Downloads" value={totalDownloads.toLocaleString()} icon={Download} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" sub="Live resource total" />
        <StatBadge label="New Resources" value={String(newResources)} icon={FolderOpen} color="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" sub="This month" />
      </div>

      {/* Monthly downloads + upload activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Downloads (12 months)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyActivity} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v.toLocaleString(), "Downloads"]} />
              <Bar dataKey="downloads" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Upload Activity (12 months)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v, "Uploads"]} />
              <Line type="monotone" dataKey="uploads" stroke="#d97706" strokeWidth={2.5} dot={{ fill: "#d97706", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top courses + categories + storage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Top Courses by Downloads">
          <div className="space-y-3">
            {topCourses.map((d, i) => (
              <div key={d.course}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300" style={MONO}>{d.course}</span>
                  <span className="text-slate-500 dark:text-slate-400">{d.downloads.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${topCourses[0]?.downloads ? (d.downloads / topCourses[0].downloads) * 100 : 0}%`, background: i === 0 ? "#16a34a" : "#22c55e" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Categories">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={topCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {topCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {topCategories.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300" style={MONO}>{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Storage Usage">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 40 * (ADMIN_STATS.storageUsedGB / ADMIN_STATS.storageMaxGB)} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 dark:text-white" style={MONO}>{Math.round((ADMIN_STATS.storageUsedGB / ADMIN_STATS.storageMaxGB) * 100)}%</span>
                <span className="text-[11px] text-slate-400">Used</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ADMIN_STATS.storageUsedGB} GB used</p>
              <p className="text-xs text-slate-400">{ADMIN_STATS.storageMaxGB - ADMIN_STATS.storageUsedGB} GB remaining of {ADMIN_STATS.storageMaxGB} GB</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
