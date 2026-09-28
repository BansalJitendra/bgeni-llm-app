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

const NEXT_STEP_URL = 'https://www.bajajgeneralinsurance.com/';

const DISCLAIMER = 'This is an indicative estimate only. The final premium is subject to validation, plan configuration, applicable taxes, underwriting and selected add-ons.';

// Base annual premiums and drivers per supported category. Deterministic rating
// factors only — this is a mock stand-in for the real rating engine (see TODO).
const CATEGORY_RATING = {
    health: { label: 'Health Insurance', base: 6500, factors: ['Age of eldest insured member', 'Sum insured selected', 'City / zone of residence', 'Number of members covered', 'Add-ons and deductible chosen'] },
    car: { label: 'Motor Insurance', base: 8200, factors: ['Vehicle make, model and variant', 'Registration city / RTO zone', 'Vehicle age and IDV', 'No-claim bonus', 'Add-ons such as zero depreciation'] },
    'two-wheeler': { label: 'Motor Insurance', base: 1400, factors: ['Vehicle make, model and cubic capacity', 'Registration city / RTO zone', 'Vehicle age and IDV', 'No-claim bonus', 'Policy term selected'] },
    home: { label: 'Home Insurance', base: 3200, factors: ['Sum insured on structure and contents', 'Property location and construction type', 'Perils and add-ons covered', 'Policy term selected'] },
    travel: { label: 'Travel Insurance', base: 1800, factors: ['Destination and trip duration', 'Age of eldest traveller', 'Sum insured / coverage tier', 'Number of travellers'] },
    pet: { label: 'Pet Insurance', base: 2200, factors: ['Species, breed and age of pet', 'Sum insured selected', 'Coverage add-ons chosen'] },
    cyber: { label: 'Cyber Insurance', base: 1500, factors: ['Sum insured selected', 'Coverage scope and add-ons', 'Policy term selected'] },
};

function normalizeType(insurance_type) {
    const t = String(insurance_type || '').trim().toLowerCase();
    if (!t) return null;
    if (t.includes('two') || t.includes('bike') || t.includes('scooter')) return 'two-wheeler';
    if (t.includes('car') || t.includes('motor') || t.includes('auto')) return 'car';
    if (t.includes('health') || t.includes('medical') || t.includes('mediclaim')) return 'health';
    if (t.includes('home') || t.includes('house') || t.includes('property')) return 'home';
    if (t.includes('travel') || t.includes('trip')) return 'travel';
    if (t.includes('pet') || t.includes('dog') || t.includes('cat')) return 'pet';
    if (t.includes('cyber')) return 'cyber';
    return null;
}

function toNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const n = parseFloat(value.replace(/[^0-9.]/g, ''));
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

const EMPTY_ESTIMATE = {
    insurance_type: null,
    estimated_premium: null,
    currency: null,
    billing_period: null,
    coverage_summary: null,
    assumptions: [],
    premium_factors: [],
    missing_information: [],
    disclaimer: DISCLAIMER,
    next_step_url: NEXT_STEP_URL,
};

module.exports = async ({ insurance_type = '', rating_details = {}, coverage_preferences = {} } = {}) => {
    if (!insurance_type || typeof insurance_type !== 'string' || !insurance_type.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide an insurance_type (e.g. health, car, two-wheeler, home or travel) to estimate a premium.' }],
            structuredContent: { ...EMPTY_ESTIMATE },
        };
    }

    if (!rating_details || typeof rating_details !== 'object' || Array.isArray(rating_details) || Object.keys(rating_details).length === 0) {
        return {
            content: [{ type: 'text', text: 'Please provide rating_details (such as age, city or coverage need) so an indicative premium can be estimated.' }],
            structuredContent: { ...EMPTY_ESTIMATE },
        };
    }

    const key = normalizeType(insurance_type);
    if (!key) {
        return {
            content: [{ type: 'text', text: `"${insurance_type}" is not a supported category. Supported types are health, car, two-wheeler, home, travel, pet and cyber insurance.` }],
            structuredContent: { ...EMPTY_ESTIMATE },
        };
    }

    const rating = CATEGORY_RATING[key];
    const prefs = (coverage_preferences && typeof coverage_preferences === 'object' && !Array.isArray(coverage_preferences)) ? coverage_preferences : {};

    // Deterministic indicative calculation from the supplied rating details.
    let premium = rating.base;
    const assumptions = [];
    const missing_information = [];

    const age = toNumber(rating_details.age);
    const members = toNumber(rating_details.members) || toNumber(rating_details.number_of_members);
    const sumInsured = toNumber(prefs.sum_insured) || toNumber(rating_details.sum_insured);
    const city = typeof rating_details.city === 'string' ? rating_details.city.trim() : '';
    const planType = typeof prefs.plan_type === 'string' ? prefs.plan_type.trim() : '';

    if (age !== null) {
        premium += Math.max(0, age - 30) * 120;
        assumptions.push(`Eldest insured member aged ${age}`);
    } else {
        missing_information.push('Exact age / date of birth for each insured member');
    }

    if (members !== null && members > 1) {
        premium += (members - 1) * Math.round(rating.base * 0.35);
        assumptions.push(`${members} members covered under one policy`);
    } else if (key === 'health') {
        missing_information.push('Number of members to be covered');
    }

    if (sumInsured !== null) {
        premium += Math.round(sumInsured * 0.0016);
        assumptions.push(`Sum insured of ${sumInsured.toLocaleString('en-IN')}`);
    } else {
        missing_information.push('Preferred sum insured');
    }

    if (city) {
        const metro = /mumbai|delhi|bengaluru|bangalore|chennai|kolkata|hyderabad|pune/i.test(city);
        premium = Math.round(premium * (metro ? 1.12 : 1.0));
        assumptions.push(`${metro ? 'Metro-tier' : 'Non-metro'} city location (${city})`);
    } else {
        missing_information.push('City / zone of residence');
    }

    if (key === 'health' || key === 'travel') {
        missing_information.push('Any pre-existing medical conditions');
    }
    missing_information.push('Preferred add-ons (e.g. maternity, personal accident, zero depreciation)');

    assumptions.push('1-year policy term with no declared claims history');
    premium = Math.round(premium / 10) * 10;

    // Match a catalogue plan for the coverage summary where one exists.
    const plan = MOCK_DATA.find((p) => p.category === rating.label
        && (planType ? p.name.toLowerCase().includes(planType.toLowerCase()) : true));

    const coverageParts = [];
    if (plan) coverageParts.push(plan.name);
    if (planType) coverageParts.push(planType);
    if (sumInsured !== null) coverageParts.push(`${sumInsured.toLocaleString('en-IN')} sum insured`);
    if (members !== null && members > 1) coverageParts.push(`${members} members`);
    const coverage_summary = coverageParts.length
        ? coverageParts.join(', ')
        : `${rating.label} indicative cover`;

    // Content guidance: explain the largest premium drivers and the one or two
    // inputs the user could change to explore another scenario, without implying
    // that cheaper coverage is automatically more suitable.
    const topDrivers = rating.factors.slice(0, 2).join(' and ');
    const summaryText = `Indicative annual premium for ${rating.label} is approximately ₹${premium.toLocaleString('en-IN')}. `
        + `The biggest drivers here are ${topDrivers.toLowerCase()}. `
        + `Adjusting the sum insured or the number of members covered is the quickest way to explore another scenario — `
        + `note that a lower premium usually means less cover, so weigh the price against the protection you need. `
        + `This is an estimate, not a final offer.`;

    return {
        content: [{ type: 'text', text: summaryText }],
        structuredContent: {
            insurance_type: rating.label,
            estimated_premium: premium,
            currency: 'INR',
            billing_period: 'per year',
            coverage_summary,
            assumptions,
            premium_factors: rating.factors,
            missing_information,
            disclaimer: DISCLAIMER,
            next_step_url: NEXT_STEP_URL,
        },
    };
};

/*
 * TODO: Replace MOCK_DATA and the deterministic CATEGORY_RATING calculation
 * with a real call to the insurer's rating engine.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/premium/estimate
 *   body: { insurance_type, rating_details, coverage_preferences }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/premium/estimate`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ insurance_type, rating_details, coverage_preferences }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
