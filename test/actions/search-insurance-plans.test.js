const handler = require('../../actions/search-insurance-plans/index.js');

describe('search_insurance_plans handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ category: 'health' });
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"find Bajaj General health insurance plans for a growing family in Pune" returns health plans', async () => {
    const out = await handler({
      category: 'health',
      customer_profile: 'family',
      coverage_priorities: ['family floater cover', 'hospitalisation'],
      location: 'Pune',
    });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.plans.length).toBeGreaterThan(0);
    expect(out.structuredContent.plans.every((p) => /health/i.test(p.category))).toBe(true);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ category: 'health' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.plans)).toBe(true);
  });

  test('returns error message when required category is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/category|provide/i);
    expect(out.structuredContent.plans).toEqual([]);
  });

  test('reminds the user to review policy wording and eligibility', async () => {
    const out = await handler({ category: 'health' });
    expect(out.content[0].text).toMatch(/review|exclusion|eligibility|policy/i);
  });

  test('unknown category returns an empty plans array (no results)', async () => {
    const out = await handler({ category: 'spaceship insurance' });
    expect(out.content[0].text).toMatch(/no .*plans found|try a broader/i);
    expect(out.structuredContent.plans).toEqual([]);
  });

  test('coverage_priorities reorders results by relevance without dropping category matches', async () => {
    const out = await handler({ category: 'health', coverage_priorities: ['women-specific'] });
    expect(out.structuredContent.plans.length).toBeGreaterThan(0);
    expect(out.structuredContent.plans.every((p) => /health/i.test(p.category))).toBe(true);
  });
});
