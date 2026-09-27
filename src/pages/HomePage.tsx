import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  PackageCheck,
  Clock,
  Compass,
  ArrowUpRight,
  Smile,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';
import { CareNeed } from '../types';

interface HomePageProps {
  onSelectTab: (tab: string) => void;
  onSelectNeedToSupport: (need: CareNeed) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab, onSelectNeedToSupport }) => {
  const { metrics, needs } = useCareConnect();

  // Pick top 3 urgent active needs for preview
  const urgentNeeds = needs.filter(n => n.status !== 'fulfilled').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Community Care Coordination</span>
              <span className="text-teal-400">·</span>
              <span className="text-teal-700 font-normal">Supporting Children & Elders</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Every care home deserves a{' '}
              <span className="text-teal-700 underline decoration-teal-300 underline-offset-8">
                helping hand.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              CareConnect connects children's care homes and old-age homes with people who can help — turning real needs into actionable support.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('find-a-need')}
                className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-teal-700/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Help Someone Today</span>
              </button>

              <button
                onClick={() => onSelectTab('dashboard')}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>I'm a Care Home</span>
              </button>

              <button
                onClick={() => onSelectTab('ai-assistant')}
                className="px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Try AI Need Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtext info */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Care-home staff can write or speak needs naturally; our AI organizes them into actionable requests for donors and volunteers.
              </span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 group">
              <img
                src="/src/assets/images/care_hero_community_1790494252784.jpg"
                alt="Compassionate community care in Karnataka"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium w-fit mb-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Dignified & Coordinated Support</span>
                </div>
                <h3 className="text-lg font-bold">Asha & Jeevan Care Community</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Connecting elderly seniors and orphaned children with education, healthcare, and compassionate volunteers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DEMO STATISTICS BAR */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Platform Activity & Coordination Reach
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Active across Karnataka communities
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.careHomesCount}
              </div>
              <div className="text-xs font-medium text-slate-500">Care Homes</div>
              <div className="text-[11px] text-slate-400">Children & senior homes</div>
            </div>

            <div className="space-y-1 border-l-0 sm:border-l sm:border-slate-100 sm:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.totalNeedsCreated}
              </div>
              <div className="text-xs font-medium text-slate-500">Needs Created</div>
              <div className="text-[11px] text-teal-700">Structured by AI & staff</div>
            </div>

            <div className="space-y-1 border-l-0 md:border-l md:border-slate-100 md:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 tabular-nums">
                {metrics.totalNeedsSupported}
              </div>
              <div className="text-xs font-medium text-slate-500">Needs Supported</div>
              <div className="text-[11px] text-slate-400">Pledged or fulfilled</div>
            </div>

            <div className="space-y-1 border-l-0 sm:border-l sm:border-slate-100 sm:pl-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.activeVolunteers}
              </div>
              <div className="text-xs font-medium text-slate-500">Active Volunteers</div>
              <div className="text-[11px] text-slate-400">Teachers, doctors, mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              The Real Social Problem
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              "The problem isn't always a lack of goodwill. Sometimes it's a lack of coordination."
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Care homes may have many different needs at the same time, but those needs can be difficult to organize, prioritize, and communicate to people who can help.
            </p>
          </div>

          {/* Real scattered needs quotes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              '“We need blankets.”',
              '“We need a wheelchair.”',
              '“We need a teacher.”',
              '“We need a doctor.”',
              '“We need someone to spend time with residents.”',
              '“We need school supplies.”',
            ].map((quote, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-medium text-slate-700 italic flex items-center justify-center text-center"
              >
                {quote}
              </div>
            ))}
          </div>

          {/* Manual Process vs CareConnect Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Manual Process */}
            <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  The Frustrating Manual Process (Hours / Days)
                </span>
                <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-medium">
                  Slow & Chaotic
                </span>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span><strong>Messy Note / Call:</strong> Staff jot down requests during busy shifts.</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span><strong>Manual Categorization:</strong> Sorting who needs what (kids vs elders).</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span><strong>Scattered Outreach:</strong> Messaging WhatsApp groups & multiple people.</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">4</span>
                  <span><strong>Duplicate / Misaligned Donations:</strong> Getting 100 biscuits, but 0 wheelchairs.</span>
                </div>
              </div>
            </div>

            {/* CareConnect AI Process */}
            <div className="bg-white p-6 rounded-3xl border border-teal-300 shadow-sm space-y-4 ring-2 ring-teal-600/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  The CareConnect Process (Seconds)
                </span>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-semibold">
                  Coordinated & Actionable
                </span>
              </div>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span><strong>One Natural Request:</strong> Staff speaks or types whatever they need.</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span><strong>AI Structures Needs:</strong> Extracts quantities, categories, beneficiaries & priorities.</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span><strong>Human Review & Approval:</strong> Staff verifies suggestions before publishing.</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">4</span>
                  <span><strong>Direct Matching:</strong> Volunteers & donors pledge exact items/time needed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
            Clear 4-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How CareConnect Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From an unstructured sentence to verified community impact in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Care Home Shares a Need</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Staff describe their requirements naturally in one text or voice input without manual forms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-teal-200/80 shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Organizes Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI extracts individual needs, categories, quantities, beneficiaries, and suggested support types.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Human Reviews & Publishes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized staff inspect, adjust quantities, and approve requests before publishing to the community.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">People Turn Support into Impact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors, volunteers, and service providers respond to specific needs, tracking progress in real time.
            </p>
          </div>
        </div>

        {/* Highlight CTA Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-['Outfit']">Ready to test the AI Need Assistant?</h3>
            <p className="text-xs text-teal-100 max-w-xl">
              Type or paste: <em>"We need 15 blankets, 2 wheelchairs, a doctor for our elderly residents and someone to teach English to the children."</em> and see the transformation.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('ai-assistant')}
            className="px-6 py-3 bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md whitespace-nowrap transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Launch AI Assistant</span>
          </button>
        </div>
      </section>

      {/* 5. URGENT NEEDS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Urgent Support Requests
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Active Needs Awaiting Support</h2>
          </div>
          <button
            onClick={() => onSelectTab('find-a-need')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Needs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {urgentNeeds.map(need => {
            const percent = Math.min(100, Math.round((need.quantitySupported / need.quantityRequired) * 100));
            return (
              <div
                key={need.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">{need.careHomeName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        need.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {need.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {need.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {need.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <span>{need.category}</span>
                    <span>·</span>
                    <span>For: {need.beneficiary}</span>
                    <span>·</span>
                    <span>{need.supportType}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-slate-900 font-semibold tabular-nums">
                        {need.quantitySupported} / {need.quantityRequired} {need.unit} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectNeedToSupport(need)}
                    className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Support This Need</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INTERGENERATIONAL CONNECTION SECTION */}
      <section className="bg-amber-50/40 border-y border-amber-200/50 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Secondary Feature · Social Bond
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Connect Through Shared Activities
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Elderly residents can share stories and life experiences. Children can help with digital skills, reading, music, and creative activities — breaking generational silos in compassionate community centers.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
                <span className="font-bold text-slate-900">📖 Storytelling & Reading</span>
                <p className="text-slate-500 text-[11px]">Seniors pass down folklore, life wisdom, and oral history.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
                <span className="font-bold text-slate-900">💻 Digital Skills Exchange</span>
                <p className="text-slate-500 text-[11px]">Younger residents help elders with tablets and video calls.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
                <span className="font-bold text-slate-900">🎨 Art & Gardening</span>
                <p className="text-slate-500 text-[11px]">Shared potting, flower care, and collaborative painting.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
                <span className="font-bold text-slate-900">♟️ Games & Music</span>
                <p className="text-slate-500 text-[11px]">Carrom, chess, bhajans, and folk song afternoons.</p>
              </div>
            </div>

            {/* Vital Safeguard Banner */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Safeguard Requirement:</strong> Activities are coordinated and supervised by authorized care-home staff. No public child profiles or direct unsupervised messaging.
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-amber-200/80 bg-slate-900">
              <img
                src="/src/assets/images/intergenerational_reading_1790494269945.jpg"
                alt="Intergenerational reading and companionship"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY & SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Responsible Technology</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Privacy, Dignity & Safeguards
              </h2>
            </div>
            <span className="text-xs text-slate-400 max-w-xs text-right hidden sm:block">
              Built in compliance with child welfare protection principles and senior privacy ethics.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Child & Senior Privacy Protection</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                We never publicly expose children's full identities, personal photographs, medical histories, or exact room locations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Staff Oversight & Approval</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                AI only structures suggestions. Authorized care-home coordinators review, edit, and approve all support requests before publication.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Verified Partners & Direct Impact</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                Care homes are registered institutions. Donors and volunteers connect directly with verified home coordinators for item drop-offs and sessions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
