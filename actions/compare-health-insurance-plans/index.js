// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// Verbatim samplePayload from Action Planner — the published Bajaj General catalogue.
const MOCK_DATA = [
    {
        name: 'My Health Care Plan',
        category: 'Health Insurance',
        plan_type: 'Individual and Floater',
        description: 'Comprehensive indemnity health plan with in-patient, pre- and post-hospitalisation cover, day-care procedures and sum insured restoration for individuals and families.',
        sum_insured_range: '₹3 lakh to ₹75 lakh, and ₹1 crore to ₹5 crore',
        eligibility_summary: 'Covers self, spouse, parents, dependent children, parents-in-law, grandchildren and more; 36-month pre-existing disease waiting period; policy period 1/2/3 years.',
        coverage_highlights: [
            'In-patient hospitalisation',
            'Pre- and post-hospitalisation',
            'Sum insured restoration',
            'Day-care procedures',
            'AYUSH cover',
        ],
        image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/health-banner-img.webp',
    },
    {
        name: 'Health Guard',
        category: 'Health Insurance',
        plan_type: 'Individual and Floater',
        description: 'Family floater and individual health plan covering hospitalisation, day-care and pre/post-hospitalisation expenses along with modern treatments.',
        sum_insured_range: '₹1.5 lakh to ₹75 lakh, and ₹1 crore',
        eligibility_summary: 'Covers self, spouse, parents, dependent children, siblings, parents-in-law and grandchildren; 36-month pre-existing disease waiting period; policy period 1/2/3 years.',
        coverage_highlights: [
            'In-patient hospitalisation',
            'Day-care procedures',
            'Modern treatments',
            'AYUSH cover',
            'Pre- and post-hospitalisation',
        ],
        image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/healthguard.webp',
    },
    {
        name: 'My Family Complete',
        category: 'Health Insurance',
        plan_type: 'Family Floater',
        description: 'Family health insurance plan providing complete hospitalisation cover for the whole family under a shared floater sum insured.',
        coverage_highlights: [
            'Family floater cover',
            'In-patient hospitalisation',
            'Pre- and post-hospitalisation',
        ],
        image_url: 'https://www.bajajgeneralinsurance.com/content/dam/revampbagic/health-insurance/images/Myfamilyimage.webp',
    },
    {
        name: 'HERizon Care',
        category: 'Health Insurance',
        plan_type: 'Individual',
        description: 'Health insurance designed for women, covering hospitalisation together with women-specific health benefits.',
        sum_insured_range: '₹3 lakh to ₹2 crore',
        eligibility_summary: 'Covers self, spouse (female), daughter, aunt and sister; 36-month pre-existing disease waiting period; policy period 1 to 5 years.',
        coverage_highlights: [
            'Women-specific health cover',
            'In-patient hospitalisation',
            'Modern treatments',
            'AYUSH cover',
        ],
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
]

function findPlan(query) {
    const q = query.trim().toLowerCase()
    return MOCK_DATA.find((p) => p.name.toLowerCase() === q)
        || MOCK_DATA.find((p) => p.name.toLowerCase().includes(q))
        || null
}

// Map a raw catalogue item to the aligned comparison shape the widget renders.
function toComparisonPlan(item) {
    const eligibility = typeof item.eligibility_summary === 'string' ? item.eligibility_summary : ''
    const waiting = []
    const waitMatch = eligibility.match(/[^.;]*waiting period[^.;]*/i)
    if (waitMatch) waiting.push(waitMatch[0].trim())
    const durationMatch = eligibility.match(/policy period[^.;]*/i)
    return {
        name: item.name,
        fit_summary: item.description || '',
        sum_insured_range: item.sum_insured_range || 'Refer policy wording',
        plan_type: item.plan_type || 'N/A',
        eligible_members: [],
        policy_duration: durationMatch ? durationMatch[0].replace(/policy period/i, '').trim() : 'N/A',
        waiting_periods: waiting,
        coverage_highlights: Array.isArray(item.coverage_highlights) ? item.coverage_highlights : [],
        add_ons: [],
        limitations: [],
        details_url: '',
    }
}

module.exports = async ({ first_plan_name = '', second_plan_name = '', customer_context = '' }) => {
    if (!first_plan_name || typeof first_plan_name !== 'string' || !first_plan_name.trim()
        || !second_plan_name || typeof second_plan_name !== 'string' || !second_plan_name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide both first_plan_name and second_plan_name to compare.' }],
            structuredContent: {
                comparison_title: null, plans: [], key_differences: [], next_step: null,
            },
        }
    }

    const rawA = findPlan(first_plan_name)
    const rawB = findPlan(second_plan_name)
    const missing = []
    if (!rawA) missing.push(first_plan_name.trim())
    if (!rawB) missing.push(second_plan_name.trim())
    if (missing.length > 0) {
        return {
            content: [{ type: 'text', text: `Could not find published details for: ${missing.join(', ')}. Please check the plan name(s).` }],
            structuredContent: {
                comparison_title: null, plans: [], key_differences: [], next_step: null,
            },
        }
    }

    const planA = toComparisonPlan(rawA)
    const planB = toComparisonPlan(rawB)

    const key_differences = []
    if (planA.plan_type !== planB.plan_type) {
        key_differences.push(`${planA.name} is offered as ${planA.plan_type}, while ${planB.name} is offered as ${planB.plan_type}.`)
    }
    if (planA.sum_insured_range !== planB.sum_insured_range) {
        key_differences.push(`Sum insured options differ: ${planA.name} offers ${planA.sum_insured_range}; ${planB.name} offers ${planB.sum_insured_range}.`)
    }
    const onlyA = planA.coverage_highlights.filter((h) => !planB.coverage_highlights.includes(h))
    const onlyB = planB.coverage_highlights.filter((h) => !planA.coverage_highlights.includes(h))
    if (onlyA.length > 0) key_differences.push(`${planA.name} additionally highlights: ${onlyA.join(', ')}.`)
    if (onlyB.length > 0) key_differences.push(`${planB.name} additionally highlights: ${onlyB.join(', ')}.`)

    const comparison_title = `${planA.name} vs ${planB.name}`
    const next_step = 'Review the full exclusions and policy wording for each plan, then request a premium quote for your family before deciding.'

    const contextNote = customer_context && customer_context.trim()
        ? ` for ${customer_context.trim()}`
        : ''

    return {
        content: [{ type: 'text', text: `Comparing ${planA.name} and ${planB.name}${contextNote} on sum insured, plan type and hospitalisation benefits. Neither is universally best — review the exclusions and policy wording before deciding.` }],
        // structuredContent.plans — named-wrapper outputSchema (top-level "plans" array)
        structuredContent: {
            comparison_title,
            plans: [planA, planB],
            key_differences,
            next_step,
        },
    }
}

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/health-insurance/plans?name=${first_plan_name}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/health-insurance/plans?name=${encodeURIComponent(first_plan_name)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
