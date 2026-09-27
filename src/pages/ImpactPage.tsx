import React, { useMemo } from 'react';
import {
  BarChart3,
  Heart,
  Users,
  Building2,
  TrendingUp,
  PackageCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';

export const ImpactPage: React.FC = () => {
  const { metrics, needs, pledges } = useCareConnect();

  // Category breakdown calculation
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    needs.forEach(n => {
      map[n.category] = (map[n.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [needs]);

  // Beneficiary breakdown
  const beneficiaryCounts = useMemo(() => {
    let children = 0;
    let elderly = 0;
    let both = 0;
    needs.forEach(n => {
      if (n.beneficiary === 'Children') children++;
      else if (n.beneficiary === 'Elderly') elderly++;
      else both++;
    });
    return { children, elderly, both, total: needs.length || 1 };
  }, [needs]);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const fulfilled = needs.filter(n => n.status === 'fulfilled').length;
    const partial = needs.filter(n => n.status === 'partially_supported').length;
    const active = needs.filter(n => n.status === 'active').length;
    return { fulfilled, partial, active, total: needs.length || 1 };
  }, [needs]);

  const maxCategoryCount = Math.max(...categoryCounts.map(c => c[1]), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
            Coordination Progress
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-medium text-slate-500">
            Real-Time Community Network
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Community Impact & Support Dashboard
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Transparent tracking of unstructured requests transformed into verified community support across partner care homes in Karnataka.
        </p>
      </div>

      {/* Transparency Note */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs text-teal-950 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparent Impact:</strong> Every donation of items, equipment, and volunteer hours is recorded and matched with specific care-home requirements to eliminate waste and guarantee direct resident benefit.
        </p>
      </div>

      {/* 6 Key Impact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.totalNeedsCreated}
          </div>
          <div className="text-xs font-bold text-slate-700">Needs Created</div>
          <div className="text-[10px] text-slate-400">AI structured</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 tabular-nums">
            {metrics.totalNeedsSupported}
          </div>
          <div className="text-xs font-bold text-slate-700">Needs Supported</div>
          <div className="text-[10px] text-teal-700">Pledged & fulfilled</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.childrenSupportedCount}
          </div>
          <div className="text-xs font-bold text-slate-700">Children Reached</div>
          <div className="text-[10px] text-slate-400">Education & clothing</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.elderlySupportedCount}
          </div>
          <div className="text-xs font-bold text-slate-700">Seniors Supported</div>
          <div className="text-[10px] text-slate-400">Healthcare & mobility</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.activeVolunteers}
          </div>
          <div className="text-xs font-bold text-slate-700">Active Volunteers</div>
          <div className="text-[10px] text-slate-400">Mentors & clinicians</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.careHomesCount}
          </div>
          <div className="text-xs font-bold text-slate-700">Care Homes</div>
          <div className="text-[10px] text-slate-400">Connected network</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Needs by Category</h3>
            <span className="text-xs text-slate-400">{needs.length} Active Items</span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map(([cat, count]) => {
              const widthPct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{cat}</span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {count} {count === 1 ? 'need' : 'needs'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Beneficiary & Fulfillment Distribution */}
        <div className="lg:col-span-6 space-y-6">
          {/* Children vs Elderly */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Support by Beneficiary</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {beneficiaryCounts.children}
                </div>
                <div className="text-slate-500 font-medium mt-0.5">Children</div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((beneficiaryCounts.children / beneficiaryCounts.total) * 100)}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {beneficiaryCounts.elderly}
                </div>
                <div className="text-slate-500 font-medium mt-0.5">Elderly</div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((beneficiaryCounts.elderly / beneficiaryCounts.total) * 100)}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {beneficiaryCounts.both}
                </div>
                <div className="text-slate-500 font-medium mt-0.5">Both / Facility</div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((beneficiaryCounts.both / beneficiaryCounts.total) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Supported vs Pending */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Need Fulfillment Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700">Fulfilled (100% supported)</span>
                </div>
                <span className="font-bold tabular-nums text-slate-900">
                  {statusCounts.fulfilled}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span className="font-medium text-slate-700">Partially Supported (In Progress)</span>
                </div>
                <span className="font-bold tabular-nums text-slate-900">
                  {statusCounts.partial}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-slate-700">Awaiting Supporter Match</span>
                </div>
                <span className="font-bold tabular-nums text-slate-900">
                  {statusCounts.active}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Supporter Pledges Feed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-700 fill-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Recent Community Pledges</h3>
          </div>
          <span className="text-xs text-slate-400">Live Activity Feed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {pledges.slice(0, 6).map(p => (
            <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{p.supporterName}</span>
                  <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.2 rounded font-medium">
                    {p.supportType}
                  </span>
                </div>
                <div className="text-slate-600">
                  {p.contribution} for <strong>{p.careHomeName}</strong>
                </div>
              </div>

              <div className="text-slate-400 text-[11px] whitespace-nowrap">
                {new Date(p.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
