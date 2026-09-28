// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the Bajaj General product catalogue (from samplePayload); it is used
// to resolve the requested insurance category so the quote confirmation can reference
// the matched plan. The quote itself is a synthesized confirmation, not catalogue data.
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

function makeConfirmationId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BAGIC-Q-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

module.exports = async ({
  insurance_type = '',
  applicant_name = '',
  mobile_number = '',
  email_address = '',
  risk_details = null,
  coverage_preferences = null,
  consent_to_contact = false,
} = {}) => {
  // Required: insurance_type, applicant_name, mobile_number, risk_details, consent_to_contact
  if (!insurance_type || typeof insurance_type !== 'string' || !insurance_type.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the insurance_type you want a quote for.' }],
      structuredContent: { confirmation_id: null, status: null, message: null, estimated_premium: null, currency: null, next_step_url: null },
    };
  }
  if (!applicant_name || typeof applicant_name !== 'string' || !applicant_name.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the applicant_name for the quote.' }],
      structuredContent: { confirmation_id: null, status: null, message: null, estimated_premium: null, currency: null, next_step_url: null },
    };
  }
  if (!mobile_number || typeof mobile_number !== 'string' || !mobile_number.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a mobile_number for quote communication.' }],
      structuredContent: { confirmation_id: null, status: null, message: null, estimated_premium: null, currency: null, next_step_url: null },
    };
  }
  if (!risk_details || typeof risk_details !== 'object') {
    return {
      content: [{ type: 'text', text: 'Please provide risk_details so we can start the quote.' }],
      structuredContent: { confirmation_id: null, status: null, message: null, estimated_premium: null, currency: null, next_step_url: null },
    };
  }
  if (consent_to_contact !== true) {
    return {
      content: [{ type: 'text', text: 'Consent to contact is required before we can start an official quote request.' }],
      structuredContent: { confirmation_id: null, status: null, message: null, estimated_premium: null, currency: null, next_step_url: null },
    };
  }

  const query = insurance_type.trim().toLowerCase();
  const matchedPlan = MOCK_DATA.find((p) => p.name.toLowerCase() === query)
    || MOCK_DATA.find((p) => (p.category || '').toLowerCase() === query)
    || MOCK_DATA.find((p) => p.name.toLowerCase().includes(query) || (p.category || '').toLowerCase().includes(query));

  const planLabel = matchedPlan ? matchedPlan.name : insurance_type.trim();
  const confirmation_id = makeConfirmationId();
  const status = 'Quote request received';
  const message = `Thank you, ${applicant_name.trim()}. Your official Bajaj General Insurance quote request for ${planLabel} has been logged. Our team will verify your details and contact you on ${mobile_number.trim()} to complete plan customisation and underwriting. Final premiums and eligibility depend on verification, selected benefits, and policy terms — issuance, price, and coverage are not guaranteed at this stage.`;

  // estimated_premium is only available after underwriting — not known at lead capture.
  const estimated_premium = null;
  const currency = 'INR';
  // next_step_url: official Bajaj General journey entry point (returned data, not fetched).
  const next_step_url = 'https://www.bajajgeneralinsurance.com';

  return {
    content: [{ type: 'text', text: `${status} — reference ${confirmation_id} for ${planLabel}. We'll contact ${applicant_name.trim()} to complete verification and underwriting.` }],
    // structuredContent — flat single-object confirmation shape (widget reads sc directly, no wrapper key)
    structuredContent: { confirmation_id, status, message, estimated_premium, currency, next_step_url },
  };
};

/*
 * TODO: Replace MOCK_DATA / synthesized confirmation with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/quotes
 *   body: { insurance_type, applicant_name, mobile_number, email_address, risk_details, coverage_preferences, consent_to_contact }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's quote API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/quotes`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}` },
 *     body: JSON.stringify({ insurance_type, applicant_name, mobile_number, email_address, risk_details, coverage_preferences, consent_to_contact }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
