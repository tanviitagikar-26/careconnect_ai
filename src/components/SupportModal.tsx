import React, { useState } from 'react';
import { X, Heart, Shield, CheckCircle2, User, Clock, MapPin, Sparkles } from 'lucide-react';
import { CareNeed, SupportType } from '../types';
import { useCareConnect } from '../context/CareConnectContext';

interface SupportModalProps {
  need: CareNeed | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ need, onClose, onSuccess }) => {
  const { submitPledge } = useCareConnect();

  const [supportType, setSupportType] = useState<SupportType>(need?.supportType || 'Donate Items');
  const [supporterName, setSupporterName] = useState('');
  const [supporterContact, setSupporterContact] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('Belagavi');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!need) return null;

  const remaining = Math.max(1, need.quantityRequired - need.quantitySupported);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterName.trim()) return;

    let contributionText = '';
    if (supportType === 'Donate Items') {
      contributionText = `Pledged ${quantity} ${need.unit} for ${need.title}`;
    } else if (supportType === 'Volunteer') {
      contributionText = `Volunteered ${skills ? `as ${skills}` : 'time'} (${availability || 'Flexible availability'})`;
    } else if (supportType === 'Provide Equipment') {
      contributionText = `Providing ${quantity} ${need.unit} of required equipment`;
    } else if (supportType === 'Provide a Service') {
      contributionText = `Offering professional service (${skills || 'general assistance'})`;
    } else {
      contributionText = `Sponsoring support for ${need.title}`;
    }

    submitPledge({
      needId: need.id,
      needTitle: need.title,
      careHomeName: need.careHomeName,
      supporterName: supporterName.trim(),
      supporterContact: supporterContact.trim(),
      supportType,
      contribution: contributionText,
      quantityPledged: quantity,
      skills: skills.trim(),
      availability: availability.trim(),
      location: location.trim(),
      message: message.trim(),
    });

    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 overflow-y-auto py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Thank You, {supporterName}!</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Your support pledge has been recorded for <strong>{need.careHomeName}</strong>. Care-home staff will reach out to coordinate fulfillment.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 max-w-sm mx-auto text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Need:</span>
                <span className="font-medium text-slate-800">{need.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Support Mode:</span>
                <span className="font-medium text-teal-700">{supportType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Care Home:</span>
                <span className="font-medium text-slate-800">{need.careHomeName}</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full max-w-xs py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl shadow-xs transition-colors"
              >
                Close & View Updated Need
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="p-5 sm:p-6 pb-3 sm:pb-4 pr-12 border-b border-slate-100 shrink-0">
              <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                Support Action · {need.careHomeName}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug mt-0.5">
                {need.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{need.category}</span>
                <span>·</span>
                <span>For: {need.beneficiary}</span>
                <span>·</span>
                <span>
                  Needed: {need.quantitySupported} / {need.quantityRequired} {need.unit}
                </span>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 pt-4 space-y-4">
              {/* Support Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  I want to help by:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Donate Items', 'Volunteer', 'Provide a Service', 'Provide Equipment', 'Sponsor a Need'] as SupportType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSupportType(type)}
                      className={`px-3 py-2 rounded-xl text-left font-medium border transition-colors ${
                        supportType === type
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Inputs */}
              {(supportType === 'Donate Items' || supportType === 'Provide Equipment') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity you can provide (Units: {need.unit})
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={Math.max(50, remaining * 2)}
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500">
                      Remaining needed: <strong>{remaining} {need.unit}</strong>
                    </span>
                  </div>
                </div>
              )}

              {supportType === 'Volunteer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Skill / Expertise
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. English teacher, Doctor, Artist"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekends 2 hrs"
                      value={availability}
                      onChange={e => setAvailability(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {supportType === 'Provide a Service' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Service / Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free medical checkup, Plumbing repair, Electrical"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              {/* Supporter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Rao"
                    value={supporterName}
                    onChange={e => setSupporterName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Email
                  </label>
                  <input
                    type="text"
                    placeholder="Contact info for home staff"
                    value={supporterContact}
                    onChange={e => setSupporterContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Belagavi, Hubli, Bangalore"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Note to Care Home Staff
                </label>
                <textarea
                  rows={2}
                  placeholder="Share details on when or how you'd like to help..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Direct Coordination Notice */}
              <div className="bg-teal-50/80 border border-teal-200/80 rounded-xl p-3 text-[11px] text-teal-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Direct Coordination:</strong> CareConnect coordinates physical items, equipment, and volunteer time directly with care home coordinators. No online financial payments are required.
                </p>
              </div>

              {/* Sticky footer action buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-xs -mx-5 sm:-mx-6 px-5 sm:px-6 -mb-5 sm:-mb-6 pb-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Confirm Support Pledge</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
