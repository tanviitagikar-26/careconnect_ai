import React, { useState, useMemo } from 'react';
import {
  Users,
  Heart,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  BookOpen,
  Stethoscope,
  Smile,
  Laptop,
  Palette,
  Music,
  Trees,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';
import { CareNeed } from '../types';

interface VolunteerPageProps {
  onSelectNeedToSupport: (need: CareNeed) => void;
}

export const VolunteerPage: React.FC<VolunteerPageProps> = ({ onSelectNeedToSupport }) => {
  const { needs, submitPledge } = useCareConnect();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Belagavi');
  const [availability, setAvailability] = useState('Weekends (3-4 hours)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Teaching', 'Companionship']);
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);

  const availableSkills = [
    { id: 'Teaching', label: 'Teaching & English', icon: BookOpen },
    { id: 'Healthcare', label: 'Healthcare & Nursing', icon: Stethoscope },
    { id: 'Companionship', label: 'Companionship & Conversation', icon: Smile },
    { id: 'Technology', label: 'Computer & Digital Skills', icon: Laptop },
    { id: 'Art', label: 'Art & Crafts', icon: Palette },
    { id: 'Music', label: 'Music & Storytelling', icon: Music },
    { id: 'Gardening', label: 'Gardening & Nature', icon: Trees },
    { id: 'Mentoring', label: 'Life Skills & Mentorship', icon: Award },
  ];

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Recommend opportunities matching the volunteer's selected skills
  const matchedNeeds = useMemo(() => {
    return needs.filter(need => {
      // Must be volunteer or service oriented
      const isVolunteerable =
        need.supportType === 'Volunteer' ||
        need.supportType === 'Provide a Service' ||
        need.category === 'Education' ||
        need.category === 'Companionship' ||
        need.category === 'Healthcare' ||
        need.category === 'Skills & Mentorship';

      if (!isVolunteerable) return false;

      // Check skill overlap
      if (selectedSkills.includes('Teaching') && (need.category === 'Education' || need.title.toLowerCase().includes('teach'))) return true;
      if (selectedSkills.includes('Healthcare') && need.category === 'Healthcare') return true;
      if (selectedSkills.includes('Companionship') && (need.category === 'Companionship' || need.title.toLowerCase().includes('story'))) return true;
      if (selectedSkills.includes('Technology') && (need.category === 'Skills & Mentorship' || need.title.toLowerCase().includes('computer'))) return true;
      if (selectedSkills.includes('Art') || selectedSkills.includes('Music')) {
        if (need.category === 'Activities' || need.title.toLowerCase().includes('art') || need.title.toLowerCase().includes('music')) return true;
      }
      return false;
    });
  }, [needs, selectedSkills]);

  const handleGeneralVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    submitPledge({
      needId: matchedNeeds[0]?.id || 'volunteer-pool',
      needTitle: matchedNeeds[0]?.title || 'General Volunteer Pool',
      careHomeName: matchedNeeds[0]?.careHomeName || 'Asha Children’s & Senior Network',
      supporterName: name.trim(),
      supporterContact: email.trim(),
      supportType: 'Volunteer',
      contribution: `Registered for ${selectedSkills.join(', ')} (${availability})`,
      skills: selectedSkills.join(', '),
      availability,
      location,
      message: 'Excited to contribute my time to help care-home residents.',
    });

    setPledgeSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
          Community Engagement
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          "Your time can become someone's support."
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From teaching English and conducting weekend computer classes for children, to providing medical checkups or playing chess with seniors — match your gifts with genuine care home requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Volunteer Profile Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Volunteer Preferences</h3>
            <p className="text-xs text-slate-500">
              Select what you enjoy doing; we'll automatically recommend matching requests.
            </p>
          </div>

          {pledgeSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">Thank you, {name}!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your volunteer profile has been registered in the CareConnect matching pool for <strong>{location}</strong>. You can also directly respond to any specific card on the right!
              </p>
              <button
                onClick={() => setPledgeSubmitted(false)}
                className="text-xs font-semibold text-emerald-900 underline"
              >
                Update preferences
              </button>
            </div>
          ) : (
            <form onSubmit={handleGeneralVolunteerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavita Joshi or Rahul Mehta"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email / Phone Contact</label>
                <input
                  type="text"
                  placeholder="For care home staff coordination"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Belagavi">Belagavi</option>
                    <option value="Hubli">Hubli</option>
                    <option value="Dharwad">Dharwad</option>
                    <option value="Bangalore">Bangalore (Remote Tutoring)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={e => setAvailability(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Weekends (3-4 hours)">Weekends (3-4 hrs)</option>
                    <option value="Weekday evenings">Weekday evenings</option>
                    <option value="Once monthly">Once monthly</option>
                    <option value="Flexible / On Call">Flexible / On Call</option>
                  </select>
                </div>
              </div>

              {/* Skills Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Skills & Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills.map(skill => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <skill.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                        <span className="truncate">{skill.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Register Volunteer Availability</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center italic">
                Volunteer visits and activities are coordinated and supervised directly by authorized care-home staff.
              </p>
            </form>
          )}
        </div>

        {/* Matched Opportunities Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                Recommended Opportunities ({matchedNeeds.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Matched to: {selectedSkills.join(', ') || 'All skills'}
            </span>
          </div>

          <div className="space-y-4">
            {matchedNeeds.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                No active volunteer requests matched your current skills. Try selecting "Teaching" or "Companionship"!
              </div>
            ) : (
              matchedNeeds.map(need => (
                <div
                  key={need.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span>{need.careHomeName}</span>
                        <span>·</span>
                        <span className="text-teal-700">{need.careHomeLocation}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{need.title}</h4>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {need.beneficiary}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {need.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Target supporter: <strong>{need.suggestedSupporter}</strong>
                    </span>

                    <button
                      onClick={() => onSelectNeedToSupport(need)}
                      className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Volunteer for This Need</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
