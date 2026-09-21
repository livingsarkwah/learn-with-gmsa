import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { resourceQueryKeys, useAdminResources } from "./useResourceQueries";
import type { Resource } from "../types";

export type AnalyticsMonth = {
  month: string;
  downloads: number;
  uploads: number;
};

export type AnalyticsCourse = {
  course: string;
  downloads: number;
};

export type AnalyticsCategory = {
  name: string;
  value: number;
  color: string;
};

const CATEGORY_COLORS = ["#16a34a", "#dc2626", "#2563eb", "#7c3aed", "#d97706", "#64748b"];

function getMonthKey(date: string) {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string) {
  return new Date(`${key}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });
}

export function getAnalyticsMonths(resources: Resource[]): AnalyticsMonth[] {
  const latestDate = resources.reduce((latest, resource) => resource.uploadDate > latest ? resource.uploadDate : latest, "");
  const end = latestDate ? new Date(latestDate) : new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - 11 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { key, month: formatMonth(key), downloads: 0, uploads: 0 };
  });
  const byKey = new Map(months.map(month => [month.key, month]));

  resources.forEach(resource => {
    const month = byKey.get(getMonthKey(resource.uploadDate));
    if (!month) return;
    month.uploads += 1;
    month.downloads += resource.downloads;
  });

  return months.map(({ month, downloads, uploads }) => ({ month, downloads, uploads }));
}

export function getTopCourses(resources: Resource[]): AnalyticsCourse[] {
  const courses = new Map<string, number>();
  resources.forEach(resource => {
    const course = resource.courseCode || "General";
    courses.set(course, (courses.get(course) ?? 0) + resource.downloads);
  });

  return [...courses.entries()]
    .map(([course, downloads]) => ({ course, downloads }))
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);
}

export function getTopCategories(resources: Resource[]): AnalyticsCategory[] {
  const categories = new Map<string, number>();
  resources.forEach(resource => {
    const category = resource.collection || "Uncategorized";
    categories.set(category, (categories.get(category) ?? 0) + 1);
  });

  const total = resources.length;
  return [...categories.entries()]
    .map(([name, count], index) => ({
      name,
      value: total ? Math.round((count / total) * 100) : 0,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, CATEGORY_COLORS.length);
}

export function useRealtimeAnalytics() {
  const queryClient = useQueryClient();
  const resourcesQuery = useAdminResources();
  const resources = resourcesQuery.data ?? [];

  useEffect(() => {
    if (!hasSupabaseConfig()) return undefined;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: resourceQueryKeys.admin() });
      }, 250);
    };

    const channel = supabase
      .channel("admin-analytics-resources")
      .on("postgres_changes", { event: "*", schema: "public", table: "resources" }, refresh)
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const totalDownloads = useMemo(() => resources.reduce((total, resource) => total + resource.downloads, 0), [resources]);
  const monthlyActivity = useMemo(() => getAnalyticsMonths(resources), [resources]);
  const topCourses = useMemo(() => getTopCourses(resources), [resources]);
  const topCategories = useMemo(() => getTopCategories(resources), [resources]);
  const currentMonth = monthlyActivity[monthlyActivity.length - 1];

  return {
    resources,
    totalDownloads,
    monthlyActivity,
    topCourses,
    topCategories,
    newResources: currentMonth?.uploads ?? 0,
    loading: resourcesQuery.isPending,
    fetching: resourcesQuery.isFetching,
    error: resourcesQuery.error,
  };
}