import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Heart,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';
import { CareNeed, CategoryType, BeneficiaryType } from '../types';

interface FindANeedPageProps {
  onSelectNeedToSupport: (need: CareNeed) => void;
  onOpenAIAssistant: () => void;
}

export const FindANeedPage: React.FC<FindANeedPageProps> = ({
  onSelectNeedToSupport,
  onOpenAIAssistant,
}) => {
  const { needs } = useCareConnect();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const filterTabs = [
    { id: 'All', label: 'All Needs' },
    { id: 'Children', label: 'Children' },
    { id: 'Elderly', label: 'Elderly' },
    { id: 'Education', label: 'Education' },
    { id: 'Healthcare', label: 'Healthcare' },
    { id: 'Essentials', label: 'Essentials' },
    { id: 'Accessibility', label: 'Accessibility' },
    { id: 'Volunteer', label: 'Volunteer' },
  ];

  const filteredNeeds = useMemo(() => {
    return needs.filter(need => {
      // 1. Category / Beneficiary Tab Filter
      if (activeFilter === 'Children' && need.beneficiary !== 'Children' && need.beneficiary !== 'Both') return false;
      if (activeFilter === 'Elderly' && need.beneficiary !== 'Elderly' && need.beneficiary !== 'Both') return false;
      if (activeFilter === 'Education' && need.category !== 'Education' && need.category !== 'Skills & Mentorship') return false;
      if (activeFilter === 'Healthcare' && need.category !== 'Healthcare') return false;
      if (activeFilter === 'Essentials' && need.category !== 'Essentials' && need.category !== 'Food' && need.category !== 'Clothing') return false;
      if (activeFilter === 'Accessibility' && need.category !== 'Accessibility') return false;
      if (activeFilter === 'Volunteer' && need.supportType !== 'Volunteer' && need.supportType !== 'Provide a Service') return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          need.title.toLowerCase().includes(q) ||
          need.description.toLowerCase().includes(q) ||
          need.careHomeName.toLowerCase().includes(q) ||
          need.category.toLowerCase().includes(q) ||
          need.careHomeLocation.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 3. Location filter
      if (selectedLocation !== 'All' && !need.careHomeLocation.includes(selectedLocation)) {
        return false;
      }

      // 4. Priority filter
      if (priorityFilter !== 'All' && need.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [needs, activeFilter, searchQuery, selectedLocation, priorityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
            Verified Support Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
            Find a Need
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Directly connect your goodwill with verified requirements from children's orphanages and old-age homes in Karnataka.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="self-start md:self-auto px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Care Home? Add Needs with AI</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        {/* Search Bar + Location & Priority Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by need, item, care home name, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Locations (Karnataka)</option>
              <option value="Belagavi">Belagavi</option>
              <option value="Hubli">Hubli</option>
              <option value="Dharwad">Dharwad</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs (Interactive Filter Controls conforming to Section 1A) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Disclaimer */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredNeeds.length}</strong> active support requests
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Click any card to pledge items, time, or professional services
        </span>
      </div>

      {/* Needs Cards Grid */}
      {filteredNeeds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-slate-500 text-sm">No needs matched your current search filters.</p>
          <button
            onClick={() => {
              setActiveFilter('All');
              setSearchQuery('');
              setSelectedLocation('All');
              setPriorityFilter('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map(need => {
            const percent = Math.min(100, Math.round((need.quantitySupported / need.quantityRequired) * 100));
            const isFulfilled = need.status === 'fulfilled' || percent >= 100;

            return (
              <div
                key={need.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Care home header with verification */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{need.careHomeName}</span>
                        {need.careHomeVerified && (
                          <span
                            className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium border border-emerald-200"
                            title="Verified Care Home"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{need.careHomeLocation}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        need.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : need.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {need.priority}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {need.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {need.description}
                  </p>

                  {/* Unboxed metadata tags per frontend design discipline */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span>{need.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>For: {need.beneficiary}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-medium">{need.supportType}</span>
                  </div>

                  {/* Suggested supporter hint */}
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suggested Support Match</span>
                    <span>{need.suggestedSupporter}</span>
                  </div>
                </div>

                {/* Progress & Support Action */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Support Progress</span>
                      <span className="text-slate-900 font-bold tabular-nums">
                        {need.quantitySupported} / {need.quantityRequired} {need.unit} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFulfilled ? 'bg-emerald-600' : 'bg-teal-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectNeedToSupport(need)}
                    className={`w-full py-2.5 px-4 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                      isFulfilled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFulfilled ? 'text-slate-500' : 'fill-white'}`} />
                    <span>{isFulfilled ? 'Pledge Additional Support' : 'Support This Need'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
