export type CategoryType =
  | 'Education'
  | 'Healthcare'
  | 'Essentials'
  | 'Accessibility'
  | 'Food'
  | 'Clothing'
  | 'Companionship'
  | 'Skills & Mentorship'
  | 'Infrastructure'
  | 'Activities'
  | 'Volunteer'
  | 'Other';

export type BeneficiaryType = 'Children' | 'Elderly' | 'Both' | 'Care Home';

export type PriorityType = 'High' | 'Medium' | 'Low';

export type SupportType =
  | 'Donate Items'
  | 'Volunteer'
  | 'Provide a Service'
  | 'Provide Equipment'
  | 'Sponsor a Need';

export interface ExtractedRequirement {
  id?: string;
  title: string;
  description: string;
  category: CategoryType;
  beneficiary: BeneficiaryType;
  quantity: string;
  priority: PriorityType;
  supportType: SupportType;
  suggestedSupporter: string;
  reason: string;
  approved?: boolean;
}

export interface CareNeed {
  id: string;
  careHomeId: string;
  careHomeName: string;
  careHomeLocation: string;
  careHomeVerified: boolean;
  title: string;
  description: string;
  category: CategoryType;
  beneficiary: BeneficiaryType;
  quantityRequired: number;
  quantitySupported: number;
  unit: string;
  priority: PriorityType;
  supportType: SupportType;
  suggestedSupporter: string;
  reason?: string;
  createdAt: string;
  status: 'active' | 'partially_supported' | 'fulfilled' | 'review';
  requiredBy?: string;
}

export interface SupporterPledge {
  id: string;
  needId: string;
  needTitle: string;
  careHomeName: string;
  supporterName: string;
  supporterContact?: string;
  supportType: SupportType;
  contribution: string;
  quantityPledged?: number;
  skills?: string;
  availability?: string;
  location?: string;
  message?: string;
  timestamp: string;
}

export interface CareHome {
  id: string;
  name: string;
  type: 'Children Home' | 'Old Age Home' | 'Integrated Care Home';
  location: string;
  verified: boolean;
  verificationNote: string;
  residentCount: {
    children?: number;
    elderly?: number;
  };
  contactPerson: string;
  about: string;
  activeNeedsCount: number;
}
