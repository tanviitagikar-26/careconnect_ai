import React from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Target,
  Clock,
  Compass,
  Building2,
  Users,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const AboutPage: React.FC<{ onOpenAIAssistant: () => void }> = ({ onOpenAIAssistant }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
          Our Purpose & Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          About CareConnect
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          "Turn compassion into coordinated action."
        </p>
      </div>

      {/* Why CareConnect Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Why CareConnect?</h2>
        <blockquote className="border-l-4 border-teal-600 pl-4 py-1 text-sm sm:text-base text-slate-700 italic font-medium">
          "Care homes don't always need generic donations. They need specific forms of support at specific times."
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Care-home staff often have multiple simultaneous needs — education materials, food/essentials, wheelchairs, healthcare volunteers, teachers, companionship, repairs, accessibility equipment, etc. — but these requests can be scattered across conversations, notes, calls, and messages. Organizing these unstructured requests into clear, actionable requirements takes time and coordination that overburdened care workers rarely have.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          CareConnect solves this by allowing care-home staff to describe their needs naturally in <strong>one text or voice-style input</strong>, then using AI to transform that unstructured information into structured, actionable support requests within seconds.
        </p>
      </div>

      {/* The Core Concept Pipeline */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
          How CareConnect Works
        </span>
        <h3 className="text-lg font-bold">The Core Coordination Flow</h3>
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 font-mono text-xs sm:text-sm text-teal-300 leading-relaxed text-center">
          Natural Care-Home Request → AI Organization → Structured Items → Supporter Matching → Human Confirmation → Impact Tracking
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          CareConnect is not simply a donation website. It is an intelligent coordination platform designed to empower care coordinators and eliminate operational friction.
        </p>
      </div>

      {/* Core Principles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Our Core Principles</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Addressing Real Unmet Needs
            </span>
            <p className="text-slate-600 leading-relaxed">
              Connects donors and volunteers with specific items and services care homes actually require today.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Supporting Dedicated Staff
            </span>
            <p className="text-slate-600 leading-relaxed">
              Designed explicitly for care-home coordinators so they spend less time on administration and more time with residents.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Effortless Communication
            </span>
            <p className="text-slate-600 leading-relaxed">
              Turns unstructured notes and requests into clean, organized support cards in seconds.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Human Oversight & Dignity
            </span>
            <p className="text-slate-600 leading-relaxed">
              Every request is reviewed and confirmed by authorized staff, preserving the privacy and dignity of residents.
            </p>
          </div>
        </div>
      </div>

      {/* Community Roadmap */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-teal-950">Our Vision for Care Communities</h3>
        <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
          CareConnect is expanding to connect verified care institutions across Karnataka with local volunteer doctors, teachers, student groups, and generous community donors.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onOpenAIAssistant}
          className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Try the AI Need Assistant</span>
        </button>
      </div>
    </div>
  );
};
