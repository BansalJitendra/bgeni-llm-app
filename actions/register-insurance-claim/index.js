// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the policyholder's Bajaj General plan catalogue (from samplePayload),
// used to recognise the policy category and shape the required-document checklist.
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

// Documents generally required per claim pathway, and the assistance channel for each.
const CLAIM_PATHWAYS = {
  'health cashless': {
    documents: ['Policy copy / e-card', 'Photo ID proof', 'Hospital admission note', 'Doctor prescription', 'Pre-authorisation form'],
    assistance: 'Health claims helpdesk & network hospital desk: 1800-209-5858',
  },
  'health reimbursement': {
    documents: ['Policy copy / e-card', 'Photo ID proof', 'Itemised hospital bills', 'Discharge summary', 'Doctor prescription', 'Payment receipts'],
    assistance: 'Health claims helpdesk: 1800-209-5858',
  },
  'motor accident': {
    documents: ['Policy copy', 'Driving licence', 'Registration certificate (RC)', 'FIR (if applicable)', 'Damage photos', 'Repair estimate'],
    assistance: '24x7 motor & roadside assistance: 1800-209-5858',
  },
  'motor theft': {
    documents: ['Policy copy', 'Registration certificate (RC)', 'FIR copy', 'Original keys', 'RTO transfer papers'],
    assistance: '24x7 motor claims helpline: 1800-209-5858',
  },
  travel: {
    documents: ['Policy copy', 'Passport / ID', 'Tickets & boarding pass', 'Medical report', 'Original bills & receipts'],
    assistance: 'International travel assistance: +91-20-3030-5858',
  },
  home: {
    documents: ['Policy copy', 'Photos of damage', 'Ownership / rent proof', 'Repair or replacement estimate'],
    assistance: 'General claims helpdesk: 1800-209-5858',
  },
  pet: {
    documents: ['Policy copy', 'Vaccination record', 'Veterinary bills', 'Treatment prescription'],
    assistance: 'General claims helpdesk: 1800-209-5858',
  },
  cyber: {
    documents: ['Policy copy', 'Screenshots of fraud', 'Bank / transaction statement', 'Police / cyber-cell complaint'],
    assistance: 'Cyber claims helpdesk: 1800-209-5858',
  },
  commercial: {
    documents: ['Policy copy', 'Incident report', 'Loss estimate', 'Supporting invoices'],
    assistance: 'Commercial & MSME claims helpdesk: 1800-209-5858',
  },
};

const DEFAULT_PATHWAY = {
  documents: ['Policy copy', 'Photo ID proof', 'Incident description', 'Supporting bills / evidence'],
  assistance: 'Bajaj General claims helpdesk: 1800-209-5858',
};

function normalise(str) {
  return String(str || '').trim().toLowerCase();
}

function resolvePathway(claim_type) {
  const key = normalise(claim_type);
  if (CLAIM_PATHWAYS[key]) return CLAIM_PATHWAYS[key];
  // Partial match — e.g. "health" or "motor" without the full pathway name.
  const hit = Object.keys(CLAIM_PATHWAYS).find((k) => key.includes(k) || k.includes(key));
  if (hit) return CLAIM_PATHWAYS[hit];
  if (key.includes('health')) return CLAIM_PATHWAYS['health reimbursement'];
  if (key.includes('motor') || key.includes('car') || key.includes('vehicle')) return CLAIM_PATHWAYS['motor accident'];
  return DEFAULT_PATHWAY;
}

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `BAGIC-CLM-${stamp}`;
}

module.exports = async ({
  claim_type = '',
  policy_number = '',
  incident_date = '',
  incident_location = '',
  incident_summary = '',
  claimant_contact = null,
  documents_available = [],
} = {}) => {
  const emptyShape = {
    confirmation_id: null,
    status: null,
    message: null,
    required_documents: [],
    missing_documents: [],
    assistance_channel: null,
    next_step_url: null,
  };

  if (!claim_type || typeof claim_type !== 'string' || !claim_type.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a claim_type (e.g. health reimbursement, motor accident, travel) to register the claim.' }],
      structuredContent: { ...emptyShape },
    };
  }
  if (!policy_number || typeof policy_number !== 'string' || !policy_number.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the policy_number connected to this incident.' }],
      structuredContent: { ...emptyShape },
    };
  }
  if (!incident_date || typeof incident_date !== 'string' || !incident_date.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide the incident_date on which the insured event occurred.' }],
      structuredContent: { ...emptyShape },
    };
  }
  if (!incident_summary || typeof incident_summary !== 'string' || !incident_summary.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a short incident_summary describing what happened.' }],
      structuredContent: { ...emptyShape },
    };
  }
  const hasContact = claimant_contact
    && typeof claimant_contact === 'object'
    && Object.keys(claimant_contact).length > 0;
  if (!hasContact) {
    return {
      content: [{ type: 'text', text: 'Please provide claimant_contact details (phone or email) so the claims team can reach you.' }],
      structuredContent: { ...emptyShape },
    };
  }

  const pathway = resolvePathway(claim_type);
  const required_documents = pathway.documents.slice();

  const available = Array.isArray(documents_available)
    ? documents_available.map((d) => normalise(d))
    : [];
  const missing_documents = required_documents.filter((doc) => {
    const docKey = normalise(doc);
    return !available.some((a) => a && (docKey.includes(a) || a.includes(docKey.split(' ')[0])));
  });

  const confirmation_id = makeReference();
  const status = 'Registered — pending document verification';

  const base = process.env.API_BASE_URL || 'https://www.bajajgeneralinsurance.com';
  const next_step_url = `${base}/claim/track?ref=${encodeURIComponent(confirmation_id)}`;

  const missingNote = missing_documents.length
    ? ` Please keep ready: ${missing_documents.join(', ')}.`
    : ' All commonly required documents appear to be available.';
  const message = `Your ${claim_type.trim()} claim on policy ${policy_number.trim()} has been registered with reference ${confirmation_id}. This registration does not confirm claim approval — admissibility and settlement remain subject to verification and policy terms.${missingNote}`;

  return {
    content: [{ type: 'text', text: `Claim registered — reference ${confirmation_id} (${status}). Registration does not confirm approval; ${missing_documents.length ? `${missing_documents.length} document(s) still needed.` : 'documents look complete.'}` }],
    structuredContent: {
      confirmation_id,
      status,
      message,
      required_documents,
      missing_documents,
      assistance_channel: pathway.assistance,
      next_step_url,
    },
  };
};

/*
 * TODO: Replace the mock registration logic with a real API call.
 *
 * Suggested endpoint pattern (update based on actual insurer API):
 *   POST ${process.env.API_BASE_URL}/claims/register
 *   body: { claim_type, policy_number, incident_date, incident_location,
 *           incident_summary, claimant_contact, documents_available }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the insurer's claims API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/claims/register`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ claim_type, policy_number, incident_date, incident_summary }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
