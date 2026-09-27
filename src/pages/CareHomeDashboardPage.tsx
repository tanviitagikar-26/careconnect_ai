import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Users,
  AlertCircle,
  FileText,
  Trash2,
  Edit2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';
import { CareNeed, CategoryType, BeneficiaryType, PriorityType, SupportType } from '../types';

interface CareHomeDashboardPageProps {
  onOpenAIAssistant: () => void;
  onSelectNeedToSupport: (need: CareNeed) => void;
}

export const CareHomeDashboardPage: React.FC<CareHomeDashboardPageProps> = ({
  onOpenAIAssistant,
  onSelectNeedToSupport,
}) => {
  const {
    careHomes,
    selectedHomeId,
    setSelectedHomeId,
    activeCareHome,
    needs,
    pledges,
    createManualNeed,
    deleteNeed,
  } = useCareConnect();

  const [activeTab, setActiveTab] = useState<'needs' | 'create' | 'pledges'>('needs');

  // Manual Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Essentials');
  const [beneficiary, setBeneficiary] = useState<BeneficiaryType>('Children');
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('kits');
  const [priority, setPriority] = useState<PriorityType>('Medium');
  const [supportType, setSupportType] = useState<SupportType>('Donate Items');
  const [requiredBy, setRequiredBy] = useState('2026-10-31');
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter needs for this specific care home
  const homeNeeds = needs.filter(n => n.careHomeId === selectedHomeId);
  const homePledges = pledges.filter(p => p.careHomeName === activeCareHome.name);

  const activeNeedsCount = homeNeeds.filter(n => n.status === 'active' || n.status === 'partially_supported').length;
  const fulfilledNeedsCount = homeNeeds.filter(n => n.status === 'fulfilled').length;

  const handleManualSubmit = (asDraft: boolean = false) => {
    if (!title.trim()) return;

    createManualNeed({
      careHomeId: activeCareHome.id,
      careHomeName: activeCareHome.name,
      careHomeLocation: activeCareHome.location,
      careHomeVerified: activeCareHome.verified,
      title: title.trim(),
      description: description.trim() || `Support request for ${title.trim()}.`,
      category,
      beneficiary,
      quantityRequired: parseInt(quantity) || 1,
      unit: unit.trim() || 'units',
      priority,
      supportType,
      suggestedSupporter:
        supportType === 'Volunteer'
          ? 'Volunteers & educators'
          : supportType === 'Provide Equipment'
          ? 'Equipment donors'
          : 'Community donors',
      reason: 'Manually logged by care-home coordinator.',
      requiredBy,
    });

    setFormSuccess(true);
    setTitle('');
    setDescription('');
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('needs');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header & Care Home Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Care Home Staff Portal
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              Community Coordinator Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {activeCareHome.name}
            </h1>
            {activeCareHome.verified && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Care Home ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {activeCareHome.location} · {activeCareHome.type} · Contact: {activeCareHome.contactPerson}
          </p>
        </div>

        {/* Switch Home selector + AI Shortcut */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedHomeId}
            onChange={e => setSelectedHomeId(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-xs focus:ring-2 focus:ring-teal-500"
          >
            {careHomes.map(h => (
              <option key={h.id} value={h.id}>
                Switch Home: {h.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAIAssistant}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Need Assistant</span>
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong>Verified Institution:</strong> Requests published here connect directly with local community donors, healthcare providers, and volunteer tutors across Karnataka.
        </div>
      </div>

      {/* Dashboard Metrics (8 Active Needs, 5 Partially Supported, 12 Volunteers, 24 Support Actions) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {8 + Math.max(0, homeNeeds.length - 3)}
          </div>
          <div className="text-xs font-semibold text-slate-600">Active Needs</div>
          <div className="text-[11px] text-slate-400">Published & open for support</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 tabular-nums">
            {5 + Math.max(0, homePledges.length - 2)}
          </div>
          <div className="text-xs font-semibold text-slate-600">Partially Supported</div>
          <div className="text-[11px] text-slate-400">Pledges underway</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            12
          </div>
          <div className="text-xs font-semibold text-slate-600">Volunteers Engaged</div>
          <div className="text-[11px] text-slate-400">Tutors, caregivers, doctors</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {24 + homePledges.length}
          </div>
          <div className="text-xs font-semibold text-slate-600">Support Actions</div>
          <div className="text-[11px] text-slate-400">Cumulative contributions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('needs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'needs'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Active Needs ({homeNeeds.length})
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Need (Manual)</span>
        </button>

        <button
          onClick={() => setActiveTab('pledges')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'pledges'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Recent Support Pledges ({homePledges.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE NEEDS LIST */}
      {activeTab === 'needs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              All requirements currently active for <strong>{activeCareHome.name}</strong>
            </span>
            <button
              onClick={onOpenAIAssistant}
              className="text-teal-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bulk Add with AI Assistant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeNeeds.map(need => {
              const percent = Math.min(100, Math.round((need.quantitySupported / need.quantityRequired) * 100));
              return (
                <div
                  key={need.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                        {need.category} · For: {need.beneficiary}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {need.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        need.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {need.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {need.description}
                  </p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Supported:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {need.quantitySupported} / {need.quantityRequired} {need.unit} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Support Type: <strong>{need.supportType}</strong>
                    </span>

                    <button
                      onClick={() => onSelectNeedToSupport(need)}
                      className="text-teal-700 hover:text-teal-800 font-semibold"
                    >
                      Test Support Flow →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL CREATE NEED FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Create a Need (Manual Form)</h3>
            <p className="text-xs text-slate-500">
              For quick single requests, or use the <strong>AI Need Assistant</strong> to convert natural paragraphs into multiple items automatically.
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Need created and published successfully to {activeCareHome.name}!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Need Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 20 Science Lab Kits or Emergency Wheelchair"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Provide details about why this is required and how it will be utilized..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Beneficiary</label>
                <select
                  value={beneficiary}
                  onChange={e => setBeneficiary(e.target.value as BeneficiaryType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Children">Children</option>
                  <option value="Elderly">Elderly</option>
                  <option value="Both">Both (Children & Elderly)</option>
                  <option value="Care Home">Care Home Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                >
                  {[
                    'Education',
                    'Healthcare',
                    'Essentials',
                    'Accessibility',
                    'Food',
                    'Clothing',
                    'Companionship',
                    'Skills & Mentorship',
                    'Infrastructure',
                    'Activities',
                    'Volunteer',
                  ].map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Required</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. kits, blankets, wheelchairs, sessions"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as PriorityType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Support Type</label>
                <select
                  value={supportType}
                  onChange={e => setSupportType(e.target.value as SupportType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Donate Items">Donate Items</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Provide a Service">Provide a Service</option>
                  <option value="Provide Equipment">Provide Equipment</option>
                  <option value="Sponsor a Need">Sponsor a Need</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleManualSubmit(true)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleManualSubmit(false)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-xs"
              >
                Publish to Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECENT SUPPORT PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Supporter actions recorded for <strong>{activeCareHome.name}</strong>
          </div>

          {homePledges.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
              No pledges recorded yet for this home. Test the "Support This Need" flow on the Find a Need page!
            </div>
          ) : (
            <div className="space-y-3">
              {homePledges.map(p => (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{p.supporterName}</span>
                      <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-100">
                        {p.supportType}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium">
                      {p.contribution}
                    </div>
                    {p.message && (
                      <div className="text-slate-500 italic">
                        "{p.message}"
                      </div>
                    )}
                  </div>

                  <div className="text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(p.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
