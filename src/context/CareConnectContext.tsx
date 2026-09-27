import React, { createContext, useContext, useState, useEffect } from 'react';
import { CareNeed, SupporterPledge, CareHome, ExtractedRequirement } from '../types';
import { INITIAL_NEEDS, INITIAL_PLEDGES, INITIAL_CARE_HOMES } from '../data/mockData';

interface CareConnectContextType {
  needs: CareNeed[];
  pledges: SupporterPledge[];
  careHomes: CareHome[];
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  selectedHomeId: string;
  setSelectedHomeId: (id: string) => void;
  activeCareHome: CareHome;
  publishExtractedNeeds: (requirements: ExtractedRequirement[], careHomeId?: string) => number;
  submitPledge: (pledgeData: Omit<SupporterPledge, 'id' | 'timestamp'>) => void;
  createManualNeed: (newNeed: Omit<CareNeed, 'id' | 'createdAt' | 'status' | 'quantitySupported'>) => void;
  updateNeed: (id: string, updates: Partial<CareNeed>) => void;
  deleteNeed: (id: string) => void;
  resetDemoData: () => void;
  metrics: {
    totalNeedsCreated: number;
    totalNeedsSupported: number;
    childrenSupportedCount: number;
    elderlySupportedCount: number;
    activeVolunteers: number;
    careHomesCount: number;
  };
}

const CareConnectContext = createContext<CareConnectContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NEEDS: 'careconnect_needs_v1',
  PLEDGES: 'careconnect_pledges_v1',
  HOMES: 'careconnect_homes_v1',
  API_KEY: 'careconnect_custom_gemini_key_v1',
};

export const CareConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [needs, setNeeds] = useState<CareNeed[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEEDS);
      if (!saved) return INITIAL_NEEDS;
      const parsed = JSON.parse(saved);
      return parsed.map((n: CareNeed) => ({
        ...n,
        title: n.title && n.title.toLowerCase() !== 'undefined' ? n.title : 'Essential Care Support',
      }));
    } catch {
      return INITIAL_NEEDS;
    }
  });

  const [pledges, setPledges] = useState<SupporterPledge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLEDGES);
      return saved ? JSON.parse(saved) : INITIAL_PLEDGES;
    } catch {
      return INITIAL_PLEDGES;
    }
  });

  const [careHomes, setCareHomes] = useState<CareHome[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMES);
      return saved ? JSON.parse(saved) : INITIAL_CARE_HOMES;
    } catch {
      return INITIAL_CARE_HOMES;
    }
  });

  const [customApiKey, setCustomApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    } catch {
      return '';
    }
  });

  const [selectedHomeId, setSelectedHomeId] = useState<string>('home-asha');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(needs));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [needs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLEDGES, JSON.stringify(pledges));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [pledges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOMES, JSON.stringify(careHomes));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [careHomes]);

  const setCustomApiKey = (key: string) => {
    setCustomApiKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const activeCareHome = careHomes.find(h => h.id === selectedHomeId) || careHomes[0];

  // Publish AI-generated approved requirements
  const publishExtractedNeeds = (requirements: ExtractedRequirement[], careHomeId?: string): number => {
    const targetHome = careHomes.find(h => h.id === (careHomeId || selectedHomeId)) || activeCareHome;
    const now = new Date().toISOString();

    const newNeeds: CareNeed[] = requirements.map((req, idx) => {
      // Parse numeric quantity if available
      let qtyReq = 1;
      const numMatch = req.quantity.match(/\d+/);
      if (numMatch) {
        qtyReq = parseInt(numMatch[0], 10);
      }

      // Extract unit string
      let unit = 'units';
      if (/blanket/i.test(req.title) || /blanket/i.test(req.quantity)) unit = 'blankets';
      else if (/wheelchair/i.test(req.title) || /wheelchair/i.test(req.quantity)) unit = 'wheelchairs';
      else if (/doctor|physician/i.test(req.title)) unit = 'sessions';
      else if (/volunteer|teacher|tutor/i.test(req.title)) unit = 'volunteers';
      else if (/kit|supply/i.test(req.title)) unit = 'kits';
      else if (/kg|ration|food/i.test(req.title)) unit = 'kg';

      return {
        id: `need-ai-${Date.now()}-${idx}`,
        careHomeId: targetHome.id,
        careHomeName: targetHome.name,
        careHomeLocation: targetHome.location,
        careHomeVerified: targetHome.verified,
        title: req.title && req.title.toLowerCase() !== 'undefined' ? req.title : 'Essential Care Support',
        description: req.description || 'Community support required.',
        category: req.category,
        beneficiary: req.beneficiary,
        quantityRequired: qtyReq,
        quantitySupported: 0,
        unit,
        priority: req.priority,
        supportType: req.supportType,
        suggestedSupporter: req.suggestedSupporter,
        reason: req.reason,
        createdAt: now,
        status: 'active',
        requiredBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    });

    setNeeds(prev => [...newNeeds, ...prev]);

    // Update active care home's needs counter
    setCareHomes(prev =>
      prev.map(home =>
        home.id === targetHome.id
          ? { ...home, activeNeedsCount: home.activeNeedsCount + newNeeds.length }
          : home
      )
    );

    return newNeeds.length;
  };

  // Submit a supporter pledge
  const submitPledge = (pledgeData: Omit<SupporterPledge, 'id' | 'timestamp'>) => {
    const newPledge: SupporterPledge = {
      ...pledgeData,
      id: `pledge-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setPledges(prev => [newPledge, ...prev]);

    // Update target need progress
    setNeeds(prev =>
      prev.map(need => {
        if (need.id === pledgeData.needId) {
          const addAmount = pledgeData.quantityPledged || 1;
          const newSupported = need.quantitySupported + addAmount;
          const isFulfilled = newSupported >= need.quantityRequired;
          return {
            ...need,
            quantitySupported: Math.min(newSupported, need.quantityRequired),
            status: isFulfilled ? 'fulfilled' : 'partially_supported',
          };
        }
        return need;
      })
    );
  };

  // Manual need creation from dashboard
  const createManualNeed = (newNeedData: Omit<CareNeed, 'id' | 'createdAt' | 'status' | 'quantitySupported'>) => {
    const newNeed: CareNeed = {
      ...newNeedData,
      id: `need-manual-${Date.now()}`,
      createdAt: new Date().toISOString(),
      quantitySupported: 0,
      status: 'active',
    };

    setNeeds(prev => [newNeed, ...prev]);
    setCareHomes(prev =>
      prev.map(h =>
        h.id === newNeed.careHomeId ? { ...h, activeNeedsCount: h.activeNeedsCount + 1 } : h
      )
    );
  };

  const updateNeed = (id: string, updates: Partial<CareNeed>) => {
    setNeeds(prev => prev.map(need => (need.id === id ? { ...need, ...updates } : need)));
  };

  const deleteNeed = (id: string) => {
    setNeeds(prev => prev.filter(need => need.id !== id));
  };

  const resetDemoData = () => {
    setNeeds(INITIAL_NEEDS);
    setPledges(INITIAL_PLEDGES);
    setCareHomes(INITIAL_CARE_HOMES);
    localStorage.removeItem(STORAGE_KEYS.NEEDS);
    localStorage.removeItem(STORAGE_KEYS.PLEDGES);
    localStorage.removeItem(STORAGE_KEYS.HOMES);
  };

  // Baseline network numbers: 156 needs created, 112 needs supported, 83 active volunteers
  const extraNeedsCreated = needs.length - INITIAL_NEEDS.length;
  const newPledgesCount = pledges.length - INITIAL_PLEDGES.length;

  const metrics = {
    totalNeedsCreated: 156 + Math.max(0, extraNeedsCreated),
    totalNeedsSupported: 112 + Math.max(0, newPledgesCount),
    childrenSupportedCount: 148 + Math.floor(Math.max(0, newPledgesCount) * 1.5),
    elderlySupportedCount: 122 + Math.floor(Math.max(0, newPledgesCount) * 1.2),
    activeVolunteers: 83 + Math.max(0, pledges.filter(p => p.supportType === 'Volunteer').length - INITIAL_PLEDGES.filter(p => p.supportType === 'Volunteer').length),
    careHomesCount: 24,
  };

  return (
    <CareConnectContext.Provider
      value={{
        needs,
        pledges,
        careHomes,
        customApiKey,
        setCustomApiKey,
        selectedHomeId,
        setSelectedHomeId,
        activeCareHome,
        publishExtractedNeeds,
        submitPledge,
        createManualNeed,
        updateNeed,
        deleteNeed,
        resetDemoData,
        metrics,
      }}
    >
      {children}
    </CareConnectContext.Provider>
  );
};

export const useCareConnect = () => {
  const context = useContext(CareConnectContext);
  if (!context) {
    throw new Error('useCareConnect must be used within a CareConnectProvider');
  }
  return context;
};
