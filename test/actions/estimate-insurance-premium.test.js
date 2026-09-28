const handler = require('../../actions/estimate-insurance-premium/index.js');

describe('estimate_insurance_premium handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({ insurance_type: 'health', rating_details: { age: 38, members: 4, city: 'Mumbai' } });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"indicative annual premium for Bajaj General Health Guard" returns a premium estimate', async () => {
        const out = await handler({
            insurance_type: 'health insurance',
            rating_details: { age: 38, members: 4, city: 'Mumbai' },
            coverage_preferences: { plan_type: 'Health Guard', sum_insured: 1000000 },
        });
        expect(out.structuredContent.insurance_type).toBe('Health Insurance');
        expect(typeof out.structuredContent.estimated_premium).toBe('number');
        expect(out.structuredContent.estimated_premium).toBeGreaterThan(0);
        expect(out.structuredContent.currency).toBe('INR');
        expect(out.structuredContent.billing_period).toBe('per year');
        expect(out.content[0].text).toMatch(/indicative/i);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ insurance_type: 'car', rating_details: { city: 'Pune' } });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('returns error message when insurance_type is missing', async () => {
        const out = await handler({ rating_details: { age: 30 } });
        expect(out.content[0].text).toMatch(/insurance_type|provide/i);
        expect(out.structuredContent.estimated_premium).toBeNull();
    });

    test('returns error message when rating_details is missing', async () => {
        const out = await handler({ insurance_type: 'health' });
        expect(out.content[0].text).toMatch(/rating_details|provide/i);
        expect(out.structuredContent.estimated_premium).toBeNull();
    });

    test('unsupported category returns a helpful message with a null estimate', async () => {
        const out = await handler({ insurance_type: 'spaceship insurance', rating_details: { age: 40 } });
        expect(out.content[0].text).toMatch(/not a supported category|supported types/i);
        expect(out.structuredContent.estimated_premium).toBeNull();
    });

    test('every return path exposes the same structuredContent key shape', async () => {
        const keys = [
            'insurance_type', 'estimated_premium', 'currency', 'billing_period',
            'coverage_summary', 'assumptions', 'premium_factors',
            'missing_information', 'disclaimer', 'next_step_url',
        ];
        const happy = await handler({ insurance_type: 'health', rating_details: { age: 38, members: 4, city: 'Mumbai' } });
        const missing = await handler({});
        keys.forEach((k) => {
            expect(happy.structuredContent).toHaveProperty(k);
            expect(missing.structuredContent).toHaveProperty(k);
        });
    });

    test('flags missing information when rating details are sparse', async () => {
        const out = await handler({ insurance_type: 'health', rating_details: { age: 40 } });
        expect(Array.isArray(out.structuredContent.missing_information)).toBe(true);
        expect(out.structuredContent.missing_information.length).toBeGreaterThan(0);
    });

    test('metro city applies a higher premium than a non-metro city', async () => {
        const base = { insurance_type: 'health', rating_details: { age: 40, members: 2 } };
        const metro = await handler({ ...base, rating_details: { ...base.rating_details, city: 'Mumbai' } });
        const nonMetro = await handler({ ...base, rating_details: { ...base.rating_details, city: 'Nagpur' } });
        expect(metro.structuredContent.estimated_premium).toBeGreaterThan(nonMetro.structuredContent.estimated_premium);
    });
});
