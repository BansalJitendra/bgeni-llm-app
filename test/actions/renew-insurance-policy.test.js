const handler = require('../../actions/renew-insurance-policy/index.js');

describe('renew_insurance_policy handler', () => {
  const validArgs = {
    policy_type: 'health',
    policy_number: 'HG-4471-8890-2261',
    registered_mobile_number: '9876543210',
  };

  test('content is an array of text blocks', async () => {
    const out = await handler(validArgs);
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Begin the online renewal" happy path returns a confirmation reference', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent).toBeDefined();
    expect(out.structuredContent.confirmation_id).toMatch(/^RNW-/);
    expect(out.structuredContent.status).toBe('in_progress');
    expect(out.structuredContent.coverage_summary).toMatch(/Health Guard|health/i);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('masks the policy number in the summary text', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text).not.toContain('HG-4471-8890-2261');
    expect(out.content[0].text).toMatch(/2261/);
  });

  test('returns error message when policy_type is missing', async () => {
    const out = await handler({ policy_number: 'HG-1', registered_mobile_number: '9876543210' });
    expect(out.content[0].text).toMatch(/policy_type|provide/i);
    expect(out.structuredContent.status).toBe('incomplete');
  });

  test('returns error message when policy_number is missing', async () => {
    const out = await handler({ policy_type: 'health', registered_mobile_number: '9876543210' });
    expect(out.content[0].text).toMatch(/policy_number|provide/i);
  });

  test('returns error message when registered_mobile_number is missing', async () => {
    const out = await handler({ policy_type: 'health', policy_number: 'HG-1' });
    expect(out.content[0].text).toMatch(/registered_mobile_number|provide/i);
  });

  test('every branch returns the same structuredContent key shape', async () => {
    const keys = ['confirmation_id', 'status', 'message', 'renewal_amount', 'currency', 'coverage_summary', 'requirements', 'next_step_url'];
    const ok = await handler(validArgs);
    const err = await handler({});
    keys.forEach((k) => {
      expect(ok.structuredContent).toHaveProperty(k);
      expect(err.structuredContent).toHaveProperty(k);
    });
  });

  test('adds a claims-review requirement when prior_claims_update is provided', async () => {
    const out = await handler({ ...validArgs, prior_claims_update: 'One cashless claim in 2025.' });
    expect(out.structuredContent.requirements).toEqual(
      expect.arrayContaining([expect.stringMatching(/claims/i)]),
    );
  });

  test('resolves a coverage summary for a motor policy type', async () => {
    const out = await handler({ ...validArgs, policy_type: 'car' });
    expect(out.structuredContent.coverage_summary).toMatch(/Car Insurance|Motor/i);
  });
});
