import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Download, Users, HardDrive, FolderOpen, TrendingUp, TrendingDown, Upload, Plus, UserPlus, BookOpen, ArrowUpRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { ADMIN_STATS, MONTHLY_DOWNLOADS, CATEGORY_DATA } from "../../constants/data";
import { badgeClass, fmtNumFull, MONO, SANS, statusBadge } from "../../utils";
import { getResources } from "../../utils/getData";
import type { Resource } from "../../types";

function StatCard({ label, value, icon: Icon, delta, positive, color }: {
  label: string; value: string; icon: React.ElementType; delta: string; positive: boolean; color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5" style={SANS}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {delta}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white mb-0.5" style={MONO}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    let active = true;

    getResources()
      .then(data => {
        if (!active) return;
        setResources(data);
      })
      .catch(() => {
        if (!active) return;
        setResources([]);
      });

    return () => { active = false; };
  }, []);

  const recent = [...resources].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).slice(0, 6);
  const totalResources = resources.length;

  return (
    <div className="space-y-6" style={SANS}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Resources"    value={fmtNumFull(totalResources)}                 icon={FolderOpen} delta={ADMIN_STATS.resourcesDelta} positive color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" />
        <StatCard label="Total Downloads"    value={fmtNumFull(ADMIN_STATS.totalDownloads)}    icon={Download}   delta={ADMIN_STATS.downloadsDelta} positive color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" />
        <StatCard label="Registered Members" value={fmtNumFull(ADMIN_STATS.registeredMembers)} icon={Users}      delta={ADMIN_STATS.membersDelta}   positive color="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400" />
        <StatCard label="Storage Used"       value={`${ADMIN_STATS.storageUsedGB} / ${ADMIN_STATS.storageMaxGB} GB`} icon={HardDrive} delta={ADMIN_STATS.storageDelta} positive color="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploads */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Uploads</h2>
            <button onClick={() => navigate("/admin/resources")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {["Resource", "Course", "Collection", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/resources`)}>
                    <td className="px-4 py-3 max-w-[200px]"><p className="font-semibold text-slate-900 dark:text-white truncate text-xs">{r.title}</p></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs font-bold text-slate-500 dark:text-slate-400" style={MONO}>{r.courseCode}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${badgeClass(r.collection)}`}>{r.collection}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400" style={MONO}>{r.uploadDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions + storage */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Upload Resource", Icon: Upload,   path: "/admin/upload",    color: "bg-emerald-600 hover:bg-emerald-700" },
              { label: "Add Course",      Icon: Plus,     path: "/admin/courses",   color: "bg-blue-600 hover:bg-blue-700" },
              { label: "Add Program",     Icon: BookOpen, path: "/admin/programs",  color: "bg-violet-600 hover:bg-violet-700" },
            ].map(({ label, Icon, path, color }) => (
              <button key={label} onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-bold transition-colors ${color}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Storage</span>
              <span className="font-bold text-slate-700 dark:text-slate-300" style={MONO}>{ADMIN_STATS.storageUsedGB} / {ADMIN_STATS.storageMaxGB} GB</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(ADMIN_STATS.storageUsedGB / ADMIN_STATS.storageMaxGB) * 100}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{(ADMIN_STATS.storageMaxGB - ADMIN_STATS.storageUsedGB).toFixed(1)} GB remaining</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Downloads This Month</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DOWNLOADS} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v.toLocaleString(), "Downloads"]} />
              <Bar dataKey="downloads" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_DATA.slice(0, 4).map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300" style={MONO}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
