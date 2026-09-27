import React, { useState } from 'react';
import { CareConnectProvider } from './context/CareConnectContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupportModal } from './components/SupportModal';

import { HomePage } from './pages/HomePage';
import { FindANeedPage } from './pages/FindANeedPage';
import { AINeedAssistantPage } from './pages/AINeedAssistantPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { CareHomeDashboardPage } from './pages/CareHomeDashboardPage';
import { ImpactPage } from './pages/ImpactPage';
import { AboutPage } from './pages/AboutPage';
import { CareNeed } from './types';

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedNeedForSupport, setSelectedNeedForSupport] = useState<CareNeed | null>(null);

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSupport = (need: CareNeed) => {
    setSelectedNeedForSupport(need);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 antialiased">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Page Content View */}
      <main className="flex-1 pb-16 lg:pb-8">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={handleSelectTab}
            onSelectNeedToSupport={handleOpenSupport}
          />
        )}

        {currentTab === 'find-a-need' && (
          <FindANeedPage
            onSelectNeedToSupport={handleOpenSupport}
            onOpenAIAssistant={() => handleSelectTab('ai-assistant')}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AINeedAssistantPage
            onNeedsPublished={() => handleSelectTab('find-a-need')}
          />
        )}

        {currentTab === 'volunteer' && (
          <VolunteerPage onSelectNeedToSupport={handleOpenSupport} />
        )}

        {currentTab === 'dashboard' && (
          <CareHomeDashboardPage
            onOpenAIAssistant={() => handleSelectTab('ai-assistant')}
            onSelectNeedToSupport={handleOpenSupport}
          />
        )}

        {currentTab === 'impact' && <ImpactPage />}

        {currentTab === 'about' && (
          <AboutPage onOpenAIAssistant={() => handleSelectTab('ai-assistant')} />
        )}
      </main>

      {/* Support Modal Trigger */}
      {selectedNeedForSupport && (
        <SupportModal
          need={selectedNeedForSupport}
          onClose={() => setSelectedNeedForSupport(null)}
        />
      )}

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}

export default function App() {
  return (
    <CareConnectProvider>
      <MainAppContent />
    </CareConnectProvider>
  );
}
