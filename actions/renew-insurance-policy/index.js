// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the Bajaj General policy catalogue (from samplePayload) — used to
// resolve a coverage summary for the policy_type being renewed.
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

function maskPolicyNumber(num) {
  const clean = String(num).replace(/\s+/g, '');
  if (clean.length <= 4) return clean;
  return `${'X'.repeat(Math.max(0, clean.length - 4))}${clean.slice(-4)}`;
}

function resolveCoverage(policy_type) {
  const q = String(policy_type || '').trim().toLowerCase();
  if (!q) return null;
  // Map a free-form policy_type to the catalogue category via keyword, then match
  // whole words only (avoids "car" matching "My Health Care Plan").
  const CATEGORY_KEYWORDS = [
    { keys: ['health', 'medical', 'family'], category: 'Health Insurance' },
    { keys: ['car', 'two-wheeler', 'two wheeler', 'bike', 'motor', 'commercial vehicle', 'vehicle'], category: 'Motor Insurance' },
    { keys: ['travel'], category: 'Travel Insurance' },
    { keys: ['home', 'house', 'property'], category: 'Home Insurance' },
    { keys: ['pet', 'dog', 'cat'], category: 'Pet Insurance' },
    { keys: ['cyber'], category: 'Cyber Insurance' },
  ];
  const hasWord = (text, word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text);
  let category = null;
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keys.some((k) => hasWord(q, k))) { category = entry.category; break; }
  }
  const match = (category && MOCK_DATA.find((p) => p.category === category))
    || MOCK_DATA.find((p) => p.category.toLowerCase().split(' ').some((w) => hasWord(q, w)));
  if (!match) return null;
  const highlights = Array.isArray(match.coverage_highlights) && match.coverage_highlights.length
    ? ` — ${match.coverage_highlights.slice(0, 3).join(', ')}`
    : '';
  return `${match.name} (${match.category})${highlights}.`;
}

module.exports = async ({
  policy_type = '',
  policy_number = '',
  registered_mobile_number = '',
  requested_changes = null,
  prior_claims_update = '',
}) => {
  // Validate required inputs — return every outputSchema field (nulled) so the widget
  // reads a consistent key shape on every branch.
  if (!policy_type || typeof policy_type !== 'string' || !policy_type.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the policy_type being renewed (e.g. health, car, home).' }],
      structuredContent: { confirmation_id: null, status: 'incomplete', message: 'Missing policy_type.', renewal_amount: null, currency: null, coverage_summary: null, requirements: [], next_step_url: null },
    };
  }
  if (!policy_number || typeof policy_number !== 'string' || !policy_number.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the existing policy_number to start the renewal.' }],
      structuredContent: { confirmation_id: null, status: 'incomplete', message: 'Missing policy_number.', renewal_amount: null, currency: null, coverage_summary: null, requirements: [], next_step_url: null },
    };
  }
  if (!registered_mobile_number || typeof registered_mobile_number !== 'string' || !registered_mobile_number.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the registered_mobile_number linked to the policy for verification.' }],
      structuredContent: { confirmation_id: null, status: 'incomplete', message: 'Missing registered_mobile_number.', renewal_amount: null, currency: null, coverage_summary: null, requirements: [], next_step_url: null },
    };
  }

  const coverage_summary = resolveCoverage(policy_type)
    || `Renewal of ${policy_type.trim()} policy ${maskPolicyNumber(policy_number)}.`;

  const requirements = [
    'Confirm registered contact details',
    'Complete KYC re-verification',
  ];
  if (prior_claims_update && String(prior_claims_update).trim()) {
    requirements.push('Review disclosed claims information');
  } else {
    requirements.push('Disclose any claims since the last renewal');
  }
  if (requested_changes && typeof requested_changes === 'object' && Object.keys(requested_changes).length) {
    requirements.push('Confirm requested coverage changes');
  }

  const confirmation_id = `RNW-${Date.now().toString(36).toUpperCase()}`;

  return {
    content: [{
      type: 'text',
      text: `Renewal started for ${policy_type.trim()} policy ${maskPolicyNumber(policy_number)} — reference ${confirmation_id}. Contact details verified; complete payment and any outstanding verification to activate continued cover. Coverage remains subject to completed payment, verification, and applicable renewal terms.`,
    }],
    // Computed multi-field result — flat object; the widget reads structuredContent directly.
    structuredContent: {
      confirmation_id,
      status: 'in_progress',
      message: 'Policy located and renewal journey started. Complete the outstanding requirements and payment to finalise the renewal.',
      renewal_amount: null,
      currency: 'INR',
      coverage_summary,
      requirements,
      next_step_url: process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/renewal/${encodeURIComponent(confirmation_id)}` : null,
    },
  };
};

/*
 * TODO: Replace MOCK_DATA / computed stub with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/renewals
 *   body: { policy_type, policy_number, registered_mobile_number, requested_changes, prior_claims_update }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/renewals`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}` },
 *     body: JSON.stringify({ policy_type, policy_number, registered_mobile_number }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
