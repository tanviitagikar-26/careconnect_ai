import { ExtractedRequirement, CategoryType, BeneficiaryType, PriorityType, SupportType } from '../types';

export function parseNeedsLocally(text: string): { extractedRequirements: ExtractedRequirement[]; summary: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { extractedRequirements: [], summary: 'No needs detected.' };
  }

  // Split into candidate segments using punctuation, conjunctions, list markers
  // e.g. "We need 15 blankets, 2 wheelchairs, a doctor for our elderly residents and someone to teach English to the children."
  const rawSegments = trimmed
    .split(/(?:,|\band\b|;|\.|\n|\r\n|(?:\d+\.))/gi)
    .map(s => s.trim())
    .filter(s => s.length > 3 && !/^(we need|we also need|also|additionally|plus)$/i.test(s));

  const items: ExtractedRequirement[] = [];

  // Keyword patterns & taxonomy
  for (const segment of rawSegments) {
    const lower = segment.toLowerCase();

    // Check if segment is meaningful
    let title = '';
    let category: CategoryType = 'Essentials';
    let beneficiary: BeneficiaryType = 'Care Home';
    let quantity = 'As needed';
    let priority: PriorityType = 'Medium';
    let supportType: SupportType = 'Donate Items';
    let suggestedSupporter = 'Community donors and supporters';
    let reason = 'Identified from natural language description.';
    let description = '';

    // Extract quantity pattern: numbers + optional units
    const numOnly = segment.match(/\b\d+\b/);
    const qtyMatch = segment.match(/(\d+[\s-]*(?:kits|units|wheelchairs|blankets|kg|pairs|boxes|pack|volunteers|teachers|doctors|hours|residents)?)/i);
    if (qtyMatch && !qtyMatch[0].includes('2026') && !qtyMatch[0].includes('100%')) {
      quantity = qtyMatch[0].trim();
    }
    const cleanNum = numOnly ? numOnly[0] : '';

    // Determine Beneficiary
    if (/(elderly|senior|old|grandparent|aged|retiree|dementia)/i.test(lower)) {
      beneficiary = 'Elderly';
    } else if (/(child|children|kid|orphan|student|boy|girl|school)/i.test(lower)) {
      beneficiary = 'Children';
    } else if (/(both|everyone|residents|all)/i.test(lower)) {
      beneficiary = 'Both';
    }

    // Pattern 1: Wheelchair / Mobility / Accessibility Equipment
    if (/wheelchair|crutch|walker|walking stick|ramp|accessibility|handrail/i.test(lower)) {
      title = cleanNum ? `${cleanNum} Mobility Wheelchairs` : 'Mobility Wheelchairs';
      category = 'Accessibility';
      beneficiary = beneficiary === 'Children' ? 'Children' : 'Elderly';
      priority = 'High';
      supportType = 'Provide Equipment';
      suggestedSupporter = 'Medical equipment providers, rehabilitation clinics & donors';
      description = `Mobility assistance equipment (${quantity}) required to ensure residents can move safely with dignity.`;
      reason = 'Wheelchairs are essential physical mobility equipment requiring direct hardware provision.';
    }
    // Pattern 2: Doctor / Healthcare / Nurse / Medicine / Medical checkup
    else if (/doctor|physician|nurse|medical|health|checkup|clinic|medicine|first aid|tablet/i.test(lower)) {
      title = 'Visiting Physician / Healthcare Consultation';
      category = 'Healthcare';
      beneficiary = beneficiary === 'Children' ? 'Children' : 'Elderly';
      priority = 'High';
      supportType = 'Provide a Service';
      suggestedSupporter = 'Healthcare professionals, licensed physicians & medical volunteers';
      description = `Regular health examinations and medical consultations for residents to manage chronic conditions and preventative care.`;
      reason = 'Medical and healthcare requests require qualified professional attention and elevated priority.';
    }
    // Pattern 3: Blankets / Warmth / Bedding / Mattresses
    else if (/blanket|bedsheet|mattress|quilt|pillow|linen/i.test(lower)) {
      title = cleanNum ? `${cleanNum} Warm Blankets & Bedding` : 'Warm Blankets & Bedding';
      category = 'Essentials';
      beneficiary = beneficiary !== 'Care Home' ? beneficiary : 'Both';
      priority = 'Medium';
      supportType = 'Donate Items';
      suggestedSupporter = 'Textile suppliers, local families & community charity groups';
      description = `Clean, warm blankets and bedding sets to ensure comfortable and dignified rest throughout the seasons.`;
      reason = 'Bedding is a primary physical comfort essential suitable for direct community donations.';
    }
    // Pattern 4: English Teacher / Tutoring / Computer classes / Education
    else if (/english|teacher|teach|tutor|math|science|computer|class|education|school supply|stationery|notebook/i.test(lower)) {
      if (/computer|digital|coding/i.test(lower)) {
        title = 'Computer Literacy & Digital Skills Volunteer';
        category = 'Skills & Mentorship';
        supportType = 'Volunteer';
        suggestedSupporter = 'Tech professionals, college students & digital educators';
        description = `Volunteer to teach computer fundamentals, digital literacy, and basic software skills.`;
        reason = 'Digital skills training prepares young residents with modern educational tools.';
      } else if (/supply|notebook|stationery|kit|pencil|book/i.test(lower)) {
        title = 'Educational Books & School Supply Kits';
        category = 'Education';
        supportType = 'Donate Items';
        suggestedSupporter = 'Education donors, book drives & stationery retailers';
        description = `Notebooks, stationery kits, and learning materials for academic study.`;
        reason = 'Tangible school supplies directly enable daily schooling and literacy.';
      } else {
        title = 'English Language Tutor & Teacher';
        category = 'Education';
        supportType = 'Volunteer';
        suggestedSupporter = 'Language educators, retired teachers & university volunteers';
        description = `Volunteer teacher to conduct regular English speaking, grammar, and reading sessions.`;
        reason = 'Education and language coaching require dedicated volunteer time and mentorship.';
      }
      beneficiary = 'Children';
      priority = 'Medium';
    }
    // Pattern 5: Companionship / Storytelling / Emotional support
    else if (/companion|talk|listen|story|spend time|lonely|visit|games/i.test(lower)) {
      title = 'Resident Companionship & Conversation Partner';
      category = 'Companionship';
      beneficiary = beneficiary === 'Children' ? 'Children' : 'Elderly';
      priority = 'Medium';
      supportType = 'Volunteer';
      suggestedSupporter = 'Empathetic volunteers, storytellers & intergenerational youth clubs';
      description = `Warm individuals who can spend compassionate time conversing, playing board games, and listening to life stories.`;
      reason = 'Social interaction combats emotional isolation and preserves human dignity.';
    }
    // Pattern 6: Food / Meals / Groceries / Rice / Nutrition
    else if (/food|meal|ration|grocery|rice|wheat|milk|oil|nutrition|vegetables/i.test(lower)) {
      title = 'Nutritional Groceries & Monthly Food Supplies';
      category = 'Food';
      beneficiary = 'Both';
      priority = 'High';
      supportType = 'Donate Items';
      suggestedSupporter = 'Grocery vendors, wholesale suppliers & food relief networks';
      description = `Essential dry rations and nutritional provisions to ensure balanced daily meals.`;
      reason = 'Daily nutrition is a critical fundamental survival necessity.';
    }
    // Pattern 7: Clothes / Footwear / Uniforms
    else if (/cloth|dress|shirt|pants|sweater|shoe|uniform|sandal/i.test(lower)) {
      title = 'Clothing & Footwear Support';
      category = 'Clothing';
      beneficiary = beneficiary !== 'Care Home' ? beneficiary : 'Children';
      priority = 'Medium';
      supportType = 'Donate Items';
      suggestedSupporter = 'Apparel donors, clothing manufacturers & community drives';
      description = `Dignified, clean everyday clothing and proper footwear suited for seasonal weather.`;
      reason = 'Clothing ensures personal dignity, hygiene, and thermal comfort.';
    }
    // Pattern 8: Infrastructure / Plumbing / Repairs / Painting
    else if (/plumb|repair|paint|roof|leak|electric|light|carpenter|fan/i.test(lower)) {
      title = 'Facility Maintenance & Repair Services';
      category = 'Infrastructure';
      beneficiary = 'Care Home';
      priority = 'High';
      supportType = 'Provide a Service';
      suggestedSupporter = 'Skilled tradespeople, plumbers, electricians & contractors';
      description = `Skilled technical maintenance to address repairs and ensure safe living quarters.`;
      reason = 'Building maintenance protects physical health, safety, and habitability.';
    }
    // Fallback: General support
    else {
      // Clean up string into a title
      const cleanTitle = segment
        .replace(/^(we need|need|looking for|someone to|requesting|required)\s+/i, '')
        .trim();
      title = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      if (title.length > 50) title = title.slice(0, 47) + '...';
      category = 'Essentials';
      description = `Request for ${cleanTitle} to support the care-home community.`;
      reason = 'Extracted directly from unstructured care home notes.';
    }

    // Ensure title has proper casing
    if (title && !items.some(it => it.title.toLowerCase() === title.toLowerCase())) {
      items.push({
        id: `extracted-${Date.now()}-${items.length}`,
        title,
        description,
        category,
        beneficiary,
        quantity: quantity || '1 unit',
        priority,
        supportType,
        suggestedSupporter,
        reason,
        approved: true,
      });
    }
  }

  // If nothing was parsed from splitting, create a single clean card
  if (items.length === 0) {
    items.push({
      id: `extracted-${Date.now()}-fallback`,
      title: 'General Care Home Support Request',
      description: trimmed,
      category: 'Essentials',
      beneficiary: 'Both',
      quantity: 'As specified',
      priority: 'Medium',
      supportType: 'Donate Items',
      suggestedSupporter: 'Community donors and volunteers',
      reason: 'General request processed from unstructured care home input.',
      approved: true,
    });
  }

  const summary = `Organized ${items.length} actionable support ${items.length === 1 ? 'requirement' : 'requirements'} across ${Array.from(new Set(items.map(i => i.category))).join(', ')}.`;

  return {
    extractedRequirements: items,
    summary,
  };
}
