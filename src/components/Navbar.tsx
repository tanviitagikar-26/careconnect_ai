import React, { useState } from 'react';
import { Heart, Sparkles, Menu, X, Users, Home, Search, LayoutDashboard, BarChart3, Info } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find-a-need', label: 'Find a Need', icon: Search },
    { id: 'ai-assistant', label: 'AI Need Assistant', icon: Sparkles, highlight: true },
    { id: 'volunteer', label: 'Volunteer', icon: Users },
    { id: 'dashboard', label: 'Care Home Dashboard', icon: LayoutDashboard },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition-colors">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
              CareConnect
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    item.highlight && !isActive
                      ? 'text-teal-700 bg-teal-50/70 hover:bg-teal-100/70'
                      : isActive
                      ? 'text-teal-900 bg-teal-100 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSelectTab('ai-assistant')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Need Assistant</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                  currentTab === item.id
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4 text-teal-700" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Ergonomic Mobile Bottom Nav Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'home' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('find-a-need')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'find-a-need' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Needs</span>
        </button>

        <button
          onClick={() => onSelectTab('ai-assistant')}
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-semibold text-teal-800 mt-0.5">AI Need</span>
        </button>

        <button
          onClick={() => onSelectTab('volunteer')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'volunteer' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Volunteer</span>
        </button>

        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
      </nav>
    </>
  );
};
