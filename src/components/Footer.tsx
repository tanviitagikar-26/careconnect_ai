import React from 'react';
import { Heart, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <Heart className="w-4 h-4 fill-slate-950" />
              </div>
              <span className="text-lg font-bold text-white font-['Outfit'] tracking-tight">
                CareConnect
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              "Every care home deserves a helping hand."
            </p>
            <p className="text-slate-400 font-medium">
              Built to turn compassion into action.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>Smart Support for Children & Seniors</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('find-a-need')} className="hover:text-white transition-colors">
                  Find a Need & Support
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('ai-assistant')} className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  AI Need Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('volunteer')} className="hover:text-white transition-colors">
                  Volunteer Matching
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-white transition-colors">
                  Care Home Staff Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Mission */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Our Mission</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('impact')} className="hover:text-white transition-colors">
                  Community Impact Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-white transition-colors">
                  About CareConnect
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
                  Intergenerational Connection
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy, Ethics & Safeguards */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Safeguards & Ethics</h4>
            <div className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
              <p className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First:</strong> Child identities and private healthcare details are protected. No public child photos or unmoderated chat.
                </span>
              </p>
              <p>
                Human Oversight: Authorized care home staff review and approve all support requests before publication.
              </p>
              <p className="text-slate-500">
                Pledge Mode: Coordinators connect directly with donors and volunteers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 CareConnect. Dedicated to turning compassion into coordinated action.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('about')} className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onSelectTab('about')} className="hover:text-slate-400 transition-colors">
              Ethics Framework
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onSelectTab('about')} className="hover:text-slate-400 transition-colors">
              Verification Standards
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
