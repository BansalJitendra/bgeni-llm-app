// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  {
    name: 'My Health Care Plan',
    category: 'Health Insurance',
    plan_type: 'Individual and Floater',
    description: 'Comprehensive indemnity health plan with in-patient, pre- and post-hospitalisation cover, day-care procedures and sum insured restoration for individuals and families.',
    sum_insured_range: '₹3 lakh to ₹75 lakh, and ₹1 crore to ₹5 crore',
    eligibility_summary: 'Covers self, spouse, parents, dependent children, parents-in-law, grandchildren and more; 36-month pre-existing disease waiting period; policy period 1/2/3 years.',
    coverage_highlights: ['In-patient hospitalisation', 'Pre- and post-hospitalisation', 'Sum insured restoration', 'Day-care procedures', 'AYUSH cover'],
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/health-banner-img.webp',
  },
  {
    name: 'Health Guard',
    category: 'Health Insurance',
    plan_type: 'Individual and Floater',
    description: 'Family floater and individual health plan covering hospitalisation, day-care and pre/post-hospitalisation expenses along with modern treatments.',
    sum_insured_range: '₹1.5 lakh to ₹75 lakh, and ₹1 crore',
    eligibility_summary: 'Covers self, spouse, parents, dependent children, siblings, parents-in-law and grandchildren; 36-month pre-existing disease waiting period; policy period 1/2/3 years.',
    coverage_highlights: ['In-patient hospitalisation', 'Day-care procedures', 'Modern treatments', 'AYUSH cover', 'Pre- and post-hospitalisation'],
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/healthguard.webp',
  },
  {
    name: 'My Family Complete',
    category: 'Health Insurance',
    plan_type: 'Family Floater',
    description: 'Family health insurance plan providing complete hospitalisation cover for the whole family under a shared floater sum insured.',
    coverage_highlights: ['Family floater cover', 'In-patient hospitalisation', 'Pre- and post-hospitalisation'],
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/Myfamilyimage.webp',
  },
  {
    name: 'HERizon Care',
    category: 'Health Insurance',
    plan_type: 'Individual',
    description: 'Health insurance designed for women, covering hospitalisation together with women-specific health benefits.',
    sum_insured_range: '₹3 lakh to ₹2 crore',
    eligibility_summary: 'Covers self, spouse (female), daughter, aunt and sister; 36-month pre-existing disease waiting period; policy period 1 to 5 years.',
    coverage_highlights: ['Women-specific health cover', 'In-patient hospitalisation', 'Modern treatments', 'AYUSH cover'],
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/herizon.webp',
  },
  {
    name: 'Car Insurance',
    category: 'Motor Insurance',
    description: 'Comprehensive and third-party car insurance covering own damage, third-party liability and optional add-ons such as zero depreciation.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/motor-insurance/images/motor-banner-lop.webp',
  },
  {
    name: 'Two Wheeler Insurance',
    category: 'Motor Insurance',
    description: 'Bike and two-wheeler insurance covering own damage and third-party liability, available as comprehensive and long-term cover.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/motor-insurance/images/bike-banner-img.webp',
  },
  {
    name: 'Travel Insurance',
    category: 'Travel Insurance',
    description: 'Travel insurance covering medical emergencies, trip cancellation and baggage loss for domestic and international trips.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/travel-insurance/images/travel-banner-img.webp',
  },
  {
    name: 'Home Insurance',
    category: 'Home Insurance',
    description: 'Home insurance protecting the house structure and its contents against fire, natural disasters, theft and other perils.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/home-insurance/images/home-banner-img.webp',
  },
  {
    name: 'Pet Insurance',
    category: 'Pet Insurance',
    description: 'Pet insurance for dogs and cats covering veterinary treatment, hospitalisation and third-party liability.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/pet-insurance/images/pet-banner-img.webp',
  },
  {
    name: 'Cyber Insurance',
    category: 'Cyber Insurance',
    description: 'Cyber insurance covering financial loss from online fraud, identity theft, phishing and other cyber risks.',
    image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/cyber-insurance/images/cyber-insurance-banner-img.webp',
  },
];

const DISCLAIMER = 'Availability and final terms remain subject to policy documentation and underwriting — review the policy wording, exclusions, and eligibility before purchasing.';

module.exports = async ({ category = '', customer_profile = '', coverage_priorities = [], location = '' }) => {
  if (!category || typeof category !== 'string' || !category.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide an insurance category (for example: health, car, travel, home, pet, or cyber) to search for plans.' }],
      // structuredContent.plans — bare array outputSchema; key derived from actionName "search_insurance_plans"
      structuredContent: { plans: [] },
    };
  }

  const query = category.trim().toLowerCase();
  const priorities = Array.isArray(coverage_priorities)
    ? coverage_priorities.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.toLowerCase())
    : [];

  // Map common colloquial category terms onto the plan's own category label.
  const SYNONYMS = {
    car: 'motor', bike: 'motor', 'two wheeler': 'motor', 'two-wheeler': 'motor',
    scooter: 'motor', vehicle: 'motor', medical: 'health', mediclaim: 'health',
  };
  const normalized = SYNONYMS[query] || query;

  let plans = MOCK_DATA.filter((plan) => {
    const cat = (plan.category || '').toLowerCase();
    const catWord = cat.replace(' insurance', '').trim();
    return cat.includes(normalized) || normalized.includes(catWord) || catWord.includes(normalized);
  });

  if (priorities.length) {
    const scored = plans.map((plan) => {
      const hay = [plan.description, (plan.coverage_highlights || []).join(' '), plan.eligibility_summary]
        .filter(Boolean).join(' ').toLowerCase();
      const score = priorities.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
      return { plan, score };
    });
    scored.sort((a, b) => b.score - a.score);
    plans = scored.map((s) => s.plan);
  }

  if (plans.length === 0) {
    return {
      content: [{ type: 'text', text: `No Bajaj General Insurance plans found for the "${category.trim()}" category. Try a broader category such as health, motor, travel, home, pet, or cyber.` }],
      structuredContent: { plans: [] },
    };
  }

  const forWhom = customer_profile && typeof customer_profile === 'string' && customer_profile.trim()
    ? ` for a ${customer_profile.trim()}` : '';
  const where = location && typeof location === 'string' && location.trim()
    ? ` in ${location.trim()}` : '';
  const summary = `Found ${plans.length} Bajaj General Insurance plan${plans.length === 1 ? '' : 's'}`
    + ` in the ${plans[0].category || category.trim()} category${forWhom}${where}. `
    + `The leading results best match the stated coverage need. ${DISCLAIMER}`;

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent.plans — bare array outputSchema; key derived from actionName "search_insurance_plans"
    structuredContent: { plans },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/insurance/plans?category=${category}&profile=${customer_profile}&location=${location}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/insurance/plans?category=${encodeURIComponent(category)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
